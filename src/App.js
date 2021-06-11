import React, {useRef, useState, useEffect} from 'react'
import './App.css';
import { Container, Row, Col, Button } from 'reactstrap';

function App() {
  //https://reactjs.org/docs/hooks-reference.html#useref
  const canvasRef = useRef(null)

  const rectWidth = 50
  const rectHeight = 50

  const circleRadius = 25

  // implemented for fancy state management
  const [shapesArray, setShapesArray] = useState([])
  const [selectedShapes, setSelectedShapes] = useState([])

  useEffect(() => {
    console.log("yay", selectedShapes);
  }, [selectedShapes]);

  const createRectangle = () => {
    let canvas = canvasRef.current
    let ctx = canvas.getContext('2d')

    ctx.fillStyle = 'green'
    
    // x and y variables allow for flexibility with dimensions, and let the shape appear in the center
    let x = canvas.width/2 - rectWidth/2
    let y = canvas.height/2 - rectHeight/2
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
    ctx.fillRect(x, y, rectWidth, rectHeight)
    setShapesArray([...shapesArray, {
      type: "rectangle",
      width: rectWidth,
      height: rectHeight,
      x: x,
      y: y,
      color: 'green' 
    }]);

  }

  const createCircle = () => {
      let canvas = canvasRef.current
      let ctx = canvas.getContext('2d')

      let x = canvas.width/2
      let y = canvas.height/2
      
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath
      ctx.beginPath() 
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
      ctx.arc(x, y, circleRadius, 0, 2*(Math.PI))
      ctx.fillStyle = 'red'
      ctx.fill()
      setShapesArray(
        [...shapesArray, {
          type: "circle",
          radius: circleRadius,
          x: x,
          y: y,
          color: 'red'
        }]
      );
  }
  
  // const canvasState = () => {
  //   let valid = false
  //   let shapes = shapesArray
  //   let dragging = false
  //   let selection = null
  //   let xDrag = 0
  //   let yDrag = 0
  // }
  
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

  const handleMouseDown = (e) => {
    let mousePosition = getMouseCoordinates(e)
    for(let i = shapesArray.length - 1; i > -1; i -= 1){
      let currShape = shapesArray[i]
      if(isWithinShape(mousePosition, currShape)){
        if(!e.shiftKey){
          setSelectedShapes([currShape])
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
  

  // const handleMouseUp = (e) => {
  //   let 
  // }

 
  return (
    <Container className='main'>
      <Row>
        <Col xs='2' className='column'>
          <div>
              <Button onClick={createRectangle}>
                  Rectangle
              </Button><br/>
              <Button onClick={createCircle}>
                  Circle
              </Button>
          </div>
        </Col>
        <Col xs='auto'>
          <canvas id='canvas' width='500' height='500' ref={canvasRef} 
          onMouseDown={handleMouseDown}
          >
          </canvas>
        </Col>
        <Col xs='auto' className='column'>
          {/* design UI element
          .map selectedShapes to display values of object
          look in react strap for a slider to change circle radius
           */}
          <div>
            edit dimensions
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
