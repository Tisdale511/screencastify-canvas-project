import React, {useRef, useState} from 'react'
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
      xCoord: x,
      yCoord: y 
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
          xCoord: x,
          yCoord: y
        }]
      );
  }
  console.log(shapesArray)
  return (
    <Container className='main'>
      <Row>
        <Col xs='2' className='column'>
          <div className="ShapeSelector">
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
          onClick={(e) => {
            console.log(e)
            // get the mouse coordinates
            // check if mouse coordinates fall within x y coordinates from an object in shapesArray
            // console.log true or false --> am I inside of an object or no?
          }}>
          </canvas>
        </Col>
        <Col xs='auto' className='column'>
          <div>
            edit dimensions
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
