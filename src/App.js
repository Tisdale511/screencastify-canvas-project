import './App.css';
import Canvas from './components/Canvas/Canvas.js';
import EditDimensions from './components/EditDimensions/EditDimensions.js';
import ShapeSelector from './components/ShapeSelector/ShapeSelector.js';
import { Container, Row, Col } from 'reactstrap';

function App() {
  return (
    <Container className='main'>
      <Row>
        <Col xs='2' className='column'>
          <ShapeSelector/>
        </Col>
        <Col xs='auto'>
          <Canvas/>
        </Col>
        <Col xs='auto' className='column'>
          <EditDimensions/>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
