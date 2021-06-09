import React from 'react'
import './ShapeSelector.css'
import { Button } from 'reactstrap'

const ShapeSelector = () => {
    const rectWidth = 50
    const rectHeight = 50
    
    const circleRadius = 25

    const createRectangle = () => {
        // gets element from the html on the page, written in the return value in Canvas.js
        let canvas = document.getElementById('canvas')
        let ctx = canvas.getContext('2d')

        ctx.fillStyle = 'green'
        
        // x and y variables allow for flexibility with dimensions, and let the shape appear in the center
        let x = canvas.width/2 - rectWidth/2
        let y = canvas.height/2 - rectHeight/2
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
        ctx.fillRect(x, y, rectWidth, rectHeight)
    }

    const createCircle = () => {
        let canvas = document.getElementById('canvas')
        let ctx = canvas.getContext('2d')

        let x = canvas.width/2
        let y = canvas.height/2
        
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath
        ctx.beginPath() 
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
        ctx.arc(x, y, circleRadius, 0, 2*(Math.PI))
        ctx.fillStyle = 'red'
        ctx.fill()
    }

    return (
        <div className="ShapeSelector">
            <Button onClick={createRectangle}>
                Rectangle
            </Button><br/>
            <Button onClick={createCircle}>
                Circle
            </Button>
        </div>
    )
}

export default ShapeSelector
