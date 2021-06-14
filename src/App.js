import React, {useRef, useState, useEffect} from 'react'
import './App.css'
import { Container, Row, Col, Button, Input, FormGroup, Form, Label, Card } from 'reactstrap';

function App() {
  //https://reactjs.org/docs/hooks-reference.html#useref
  const canvasRef = useRef(null)

  // implemented for fancy state management
  const [shapesArray, setShapesArray] = useState([])
  const [isDragging, setIsDragging] = useState(false)

  let mouseOnCanvas = false

  useEffect(() => {
    console.log("shapesArray Updated", shapesArray)
    if(shapesArray.length > 0){
      draw()
    }else{
      canvasRef.current.getContext('2d').clearRect(0, 0, 500, 500)
    }
  }, [shapesArray]);

  const drawRectangle = (ctx, shape) => {
    ctx.fillStyle = shape.color
    
    // add hover
    if(shape.hover){
      ctx.shadowColor = '#0000FF'
      ctx.shadowBlur = 10
    }else{
      ctx.shadowBlur = 0
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
    ctx.fillRect(shape.x, shape.y, shape.width, shape.height)


    //adding border
    if(shape.selected){
      ctx.strokeStyle = '#FFA500'
      ctx.lineWidth = 3
      ctx.strokeRect(shape.x - 4, shape.y - 4, shape.width + 8, shape.height + 8)
    }
  }

  const drawCircle = (ctx, shape) => {
    
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath
    ctx.beginPath() 
    // add hover
    if(shape.hover){
      ctx.shadowColor = '#0000FF'
      ctx.shadowBlur = 10
    }else{
      ctx.shadowBlur = 0
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
    ctx.arc(shape.x, shape.y, shape.radius, 0, 2*(Math.PI))
    ctx.fillStyle = shape.color
    ctx.fill()

    // adding border
    if(shape.selected){
      ctx.strokeStyle = '#FFA500'
      ctx.lineWidth = 3
      ctx.strokeRect(shape.x - 4, shape.y - 4, shape.width + 8, shape.height + 8)
      
      ctx.arc(shape.x, shape.y, shape.radius + 4, 0, 2*(Math.PI))
      ctx.stroke()
    }
  }

  const draw = () => {
    let ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, 500, 500)
    shapesArray.forEach((shape)=>{
      if(shape.type === 'circle'){
        drawCircle(ctx, shape)
      }
      if(shape.type === 'rectangle'){
        drawRectangle(ctx,shape)
      }
    })
  }

  const addRect = () => {
    setShapesArray([...shapesArray, {
      type: "rectangle",
      width: 50,
      height: 50,
      x: 225,
      y: 225,
      color: '#00FF00',
      selected: false,
      hover: false
    }])
  }

  const addCircle = () => {
    setShapesArray(
      [...shapesArray, {
        type: "circle",
        radius: 25,
        x: 250,
        y: 250,
        color: '#ff0000',
        selected: false,
        hover: false
      }]
    )
  }

  // returns object containing x and y coordinates of a mouse click
  const getMouseCoordinates = (e) => {
    let canvas = canvasRef.current
    let canvasLocation = canvas.getBoundingClientRect()
    
    // was getting a decimal value on x, so used Math.trunc()
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX
    let x = Math.trunc(e.clientX - canvasLocation.left)
    let y = Math.trunc(e.clientY - canvasLocation.top)
    return {x, y}
  }
  
  // returns true if mouse coordinates are inside of a shape
  const isWithinShape = (mousePosition, shape) => {
    if(shape.type === 'rectangle'){
      return (shape.x <= mousePosition.x) && (shape.x + shape.width >= mousePosition.x) &&
      (shape.y <= mousePosition.y) && (shape.y + shape.height >= mousePosition.y)
    }
    if(shape.type === 'circle'){
      let dx = mousePosition.x - shape.x
      let dy = mousePosition.y - shape.y
      let dist = Math.abs(Math.sqrt(dx*dx + dy*dy))
      return(dist <= shape.radius)
    }
  }
  
  // returns true if shapes are the same
  const isSameShape = (shape1, shape2) => {
    return (shape1.type === shape2.type) && (shape1.x === shape2.x) && (shape1.y === shape2.y) && (shape1.radius === shape2.radius) && (shape1.height === shape2.height) && (shape1.width === shape2.width) && (shape1.color === shape2.color)
  }

  // returns true if shape is in array
  const isShapeInArray = (shape, shapeArr) => {
    return shapeArr.findIndex((currShape) => isSameShape(shape, currShape)) > -1
  }

  // returns new array with selected element removed
  const removeShapeFromArray = (shape) => {
    setShapesArray(shapesArray.filter((currShape) => !isSameShape(shape, currShape)))
  }

  const handleMouseDown = (e) => {
    let mousePosition = getMouseCoordinates(e)
    for(let i = shapesArray.length - 1; i > -1; i -= 1){
      let currShape = shapesArray[i]
      if(isWithinShape(mousePosition, currShape)){
        setIsDragging(true)
        setShapesArray(
          shapesArray.map(shape => {
            if(isSameShape(shape, currShape)){
              return {...shape, selected: !shape.selected}
            }else{
              return {...shape, selected: e.shiftKey ? shape.selected : false}
            }
          })
        )
        break
      }else{
        setShapesArray(
          shapesArray.map(shape => {
              return {...shape, selected: false}
            }
          )
        )
      }
    }
  }

  const handleMouseUp = (e) => {
    setIsDragging(false)
  }

  // sets selectedShapes state to correspond with the range slider radius value
  const handleRadiusChange = (e, currShape) => {
    setShapesArray(shapesArray.map(shape => {
      if(isSameShape(shape, currShape)){
        return {...shape, radius: parseInt(e.target.value, 10)}
      }else{
        return shape
      }
    }))
  }

  const handleWidthChange = (e, currShape) => {
    setShapesArray(shapesArray.map(shape => {
      if(isSameShape(shape, currShape)){
        return {
          ...shape, 
          x: shape.x + shape.width/2 - e.target.value/2, 
          width: parseInt(e.target.value, 10)
        }
      }else{
        return shape
      }
    }))
  }

  const handleHeightChange = (e, currShape) => {
    setShapesArray(shapesArray.map(shape => {
      if(isSameShape(shape, currShape)){
        return {
          ...shape, 
          y: shape.y + shape.height/2 - e.target.value/2, 
          height: parseInt(e.target.value, 10)}
      }else{
        return shape
      }
    }))
  }

  const handleColorChange = (e, currShape) => {
    setShapesArray(shapesArray.map(shape => {
      if(isSameShape(shape, currShape)){
        return {...shape, color: e.target.value}
      }else{
        return shape
      }
    }))
  }


  // setShapesArray(
  //   shapesArray.map(shape => {
  //     if(isSameShape(shape, currShape)){
  //       let newShape = {...shape, hover: isWithinShape(mousePosition, currShape)}
  //       if(newShape.selected && isDragging){
  //         let x = mousePosition.x
  //         let y = mousePosition.y
  //         if(shape.type === 'rectangle'){

  //         }
  //         newShape.x = x;
  //         newShape.y = y;
  //       }
  //       return newShape
  //     }else{
  //       return {...shape, hover: false}
  //     }
  //   })
  // )
  const handleOnMouseMove = (e) => {
    let mousePosition = getMouseCoordinates(e)
    for(let i = shapesArray.length - 1; i > -1; i -= 1){
      let currShape = shapesArray[i]
      if(isWithinShape(mousePosition, currShape)){
        setShapesArray(
          shapesArray.map(shape => {
            if(isSameShape(shape, currShape)){
              return {...shape, hover: true}
            }else{
              return {...shape, hover: false}
            }
          })
        )
        break
      }else{
        setShapesArray(
          shapesArray.map(shape => {
              return {...shape, hover: false}
            }
          )
        )
      }
      console.log('curr',currShape);
      if(currShape.selected && isDragging){
        setShapesArray(
          shapesArray.map(shape => {
            if(isSameShape(shape, currShape)){
              let x = mousePosition.x
              let y = mousePosition.y
              if(shape.type === 'rectangle'){

              }
              return {...shape, x: x, y: y }
            }else{
              return {...shape}
            }
          })
        ) 
      }
    }
  }

  return (
    <Container className='main'>
      <Row>
        <Col xs='auto' className='column'>
          <div>
              <Button onClick={addRect}>
                  Rectangle
              </Button><br/>
              <Button onClick={addCircle}>
                  Circle
              </Button>
          </div>
        </Col>
        <Col xs='auto'>
          <canvas id='canvas' width='500' height='500' ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleOnMouseMove} onMouseUp={handleMouseUp}>
          </canvas>
        </Col>
        <Col xs='auto' className='column'>       
           {shapesArray.filter(shape=>shape.selected).map((shape, index) => (
                <Card key={`editor-${index}`}>    
                  <Button color="danger" xs='6' onClick={() => removeShapeFromArray(shape)}>
                    delete {shape.type}
                  </Button>
                    <FormGroup row >
                      <Label sm={4}>color</Label>
                      <Col sm={8}>
                        <input type='color' value={shape.color} onChange={(e) => handleColorChange(e, shape)}/>
                      </Col>
                    </FormGroup>
                  {shape.type === 'rectangle' && <Form>
                    <FormGroup row >
                      <Label sm={4}>x</Label>
                      <Col sm={8}>{shape.x}</Col>
                    </FormGroup>
                    <FormGroup row >
                      <Label sm={4}>y</Label>
                      <Col sm={8}>{shape.y}</Col>
                    </FormGroup>
                    <FormGroup>
                      <Label sm={4}>width</Label>
                      
                      <input type="range" min="10" max="400" defaultValue={shape.width} 
                      onChange={e => handleWidthChange(e, shape)}/>
                     
                    </FormGroup>
                    <FormGroup>
                      <Label sm={4}>height</Label>
                      
                      <input type="range" min="10" max="400" defaultValue={shape.height} 
                      onChange={e => handleHeightChange(e, shape)}/>
                      
                    </FormGroup>
                  </Form>}
                  
                  {shape.type === 'circle' && <Form >
                    <FormGroup row >
                      <Label sm={4}>x</Label>
                      <Col sm={6}>{shape.x}</Col>
                    </FormGroup>
                    <FormGroup row >
                      <Label sm={4}>y</Label>
                      <Col sm={6}>{shape.y}</Col>
                    </FormGroup>
                    <FormGroup>
                      <Label sm={4}>radius</Label>
                      
                       <input type="range" min="10" max="200" defaultValue={shape.radius} 
                      onChange={e => handleRadiusChange(e, shape)}/>
                      <p id="rangeValue">{shape.radius}</p>
                      
                    </FormGroup>
                    </Form>}
                </Card>
               )
            )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
