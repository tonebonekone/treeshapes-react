import { useEffect, useRef, useState } from 'react'

function App() {
  const [windowW, setWidth] = useState(window.innerWidth)
  const [windowH, setHeight] = useState(window.innerHeight)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    window.addEventListener('resize', updateWidthAndHeight)
    return () => window.removeEventListener('resize', updateWidthAndHeight)
  }, [])

  function updateWidthAndHeight() {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const angleIncrement = (30 * Math.PI) / 180
    const startX = canvas.width / 2
    const startY = canvas.height - 100
    const height = (canvas.height * 7) / 24

    const thickness = 0.5
    const maxDepth = 8
    const branchPropagation = 5

    function createRect(x: number, y: number, w: number, h: number, color: string) {
      ctx.fillStyle = color
      ctx.fillRect(x, y, w, h)
    }

    function drawLine(x1: number, y1: number, x2: number, y2: number, thickness: number, color: string) {
      ctx.lineWidth = thickness
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.closePath()
      ctx.stroke()
    }

    function drawBranch(x: number, y: number, height: number, thickness: number, angle: number, depth: number) {
      if (depth > maxDepth) return

      let endX = x - height * Math.sin(angle)
      let endY = y - height * Math.cos(angle)
      //   console.log("x, y             ", `${x}, ${y}`);
      //   console.log("endX, endY       ", `${endX}, ${endY}`);

      drawLine(x, y, endX, endY, thickness, 'black')

      let newHeight = (height * 8) / 12
      let newThickness = (thickness * 2) / 3
      //   console.log("newHeight:       ", newHeight);
      //   console.log("newThickness:    ", newThickness);

      let angleStart

      //   console.log("angle:           ", angle);

      angleStart =
        branchPropagation % 2 === 0
          ? angle - angleIncrement / 2 - (Math.trunc(branchPropagation / 2) - 1) * angleIncrement
          : angle - Math.trunc(branchPropagation / 2) * angleIncrement

      //   console.log("angleStart:      ", angleStart);

      for (let i = 0; i < branchPropagation; i++) {
        drawBranch(endX, endY, newHeight, newThickness, angleStart + i * angleIncrement, depth + 1)
      }
    }

    createRect(0, 0, canvas.width, canvas.height, '#EEE')

    drawBranch(startX, startY, height, thickness, 0, Math.PI / 2)
  }, [windowW, windowH])

  return <canvas ref={canvasRef} width={windowW} height={windowH} onClick={(e) => {}} />
}

export default App
