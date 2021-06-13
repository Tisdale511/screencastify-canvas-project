import React, {useRef, useState, useEffect} from 'react'
import './App.css';
import { Container, Row, Col, Button, Input, FormGroup, Form, Label, Card } from 'reactstrap';

function App() {
  //https://reactjs.org/docs/hooks-reference.html#useref
  const canvasRef = useRef(null)

  // implemented for fancy state management
  const [shapesArray, setShapesArray] = useState([])
  const [selectedShapes, setSelectedShapes] = useState([])

  useEffect(() => {
    console.log("yay", selectedShapes);
    // drawShape('rectangle');
  }, [selectedShapes]);

  const createRectangle = (canvas, ctx, color = 'green', width = 50, height = 50) => {
    console.log('canvas', ctx);
    console.log('clr', color)
    ctx.fillStyle = color
    
    // x and y variables allow for flexibility with dimensions, and let the shape appear in the center
    let x = canvas.width/2 - width/2
    let y = canvas.height/2 - height/2
    
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
    ctx.fillRect(x, y, width, height)

    //add border
    ctx.strokeStyle = 'orange'
    ctx.lineWidth = 3
    ctx.strokeRect(x - 4, y - 4, width + 8, height + 8)
    
    setShapesArray([...shapesArray, {
      type: "rectangle",
      width: width,
      height: height,
      x: x,
      y: y,
      color: color,
      selected: false
    }]);
  }

  const createCircle = (canvas, ctx, color = 'red', radius = 25) => {
    let x = canvas.width/2
    let y = canvas.height/2
    
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath
    ctx.beginPath() 
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
    ctx.arc(x, y, radius, 0, 2*(Math.PI))
    ctx.fillStyle = color
    ctx.fill()
    setShapesArray(
      [...shapesArray, {
        type: "circle",
        radius: radius,
        x: x,
        y: y,
        color: color,
        selected: false
      }]
    );
  }

  const drawShape = (type) => {
    let canvas = canvasRef.current
    let ctx = canvas.getContext('2d')
    //loop over the state object and draw each element
    console.log('stuff', canvas.width)
    if(type === 'circle'){
      createCircle(canvas, ctx)
    }
    if(type === 'rectangle'){
      createRectangle(canvas, ctx)
    }
    
  }

  const addRect = (color = 'green', x, y, width = 50, height = 50, selected = false) => {
    setShapesArray([...shapesArray, {
      type: "rectangle",
      width: width,
      height: height,
      x: x,
      y: y,
      color: color,
      selected: selected
    }]);
  }

  // returns object containing x and y coordinates of a mouse click
  const getMouseCoordinates = (e) => {
    let canvas = canvasRef.current
    let canvasLocation = canvas.getBoundingClientRect()
    
    // was getting a decimal value on x, so used Math.trunc()
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX
    let x = Math.trunc(e.clientX - canvasLocation.left)
    let y = Math.trunc(e.clientY - canvasLocation.top)
    // console.log(`${x}, ${y}`)
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
  const removeShapeFromState = (shape, shapeArr) => {
    return shapeArr.filter((currShape) => !isSameShape(shape, currShape))
  }

  const handleMouseDown = (e) => {
    let mousePosition = getMouseCoordinates(e)
    for(let i = shapesArray.length - 1; i > -1; i -= 1){
      let currShape = shapesArray[i]
      if(isWithinShape(mousePosition, currShape)){
        if(!e.shiftKey){
          if(isShapeInArray(currShape, selectedShapes)){
            let tempState = selectedShapes
            let splicedArray = removeShapeFromState(currShape, tempState)
            setSelectedShapes(splicedArray)
            console.log('spl', splicedArray)
          }else{
            setSelectedShapes([currShape])
          }
        }else{
          if(!isShapeInArray(currShape, selectedShapes)){
            setSelectedShapes([...selectedShapes, currShape])
          }
        }
        break  
      }else{
        setSelectedShapes([])
      }
    }
  }

  // sets selectedShapes state to correspond with the range slider radius value
  const handleRangeChange = (index, e) => {
    setSelectedShapes(selectedShapes.map((shape, idx) => {
      if(index === idx){
        return {...shape, radius: parseInt(e.target.value, 10)}
      }else{
        return shape
      }
    }))
  }

  // const handleMouseUp = (e) => {
  //   let 
  // }

 
  return (
    <Container className='main'>
      <Row>
        <Col xs='auto' className='column'>
          <div>
              <Button onClick={() => drawShape('rectangle')}>
                  Rectangle
              </Button><br/>
              <Button onClick={() => drawShape('circle')}>
                  Circle
              </Button>
          </div>
        </Col>
        <Col xs='auto'>
          <canvas id='canvas' width='500' height='500' ref={canvasRef} onMouseDown={handleMouseDown}>
          </canvas>
        </Col>
        <Col xs='auto' className='column'>       
          {/* design UI element
          .map selectedShapes to display values of object
          look in react strap for a slider to change circle radius
           */}
           {selectedShapes.map((shape, index) => {
            return (
            <Card key={`editor-${index}`}>    
              <Button color="danger" xs='6'>
                delete {shape.type}
              </Button>
              <p>color editor</p>
              {shape.type === 'rectangle' && <Form>
                <FormGroup row >
                  <Label sm={2}>x</Label>
                  <Col sm={4}>
                    <Input placeholder={shape.width} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>y</Label>
                  <Col sm={4}>
                    <Input placeholder={shape.height}/>
                  </Col>
                </FormGroup>
              </Form>}
              
              {shape.type === 'circle' && <Form >
                <div className="slider">radius<br/>
                   <input type="range" min="10" max="200" defaultValue={shape.radius} 
                  onChange={(e) => handleRangeChange(index, e)}/>
                  <p id="rangeValue">{shape.radius}</p>
                </div>
                </Form>}<br/>
            </Card>
           )})}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
