import { FormControlLabel, Grid, Switch } from '@mui/material'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import InputSlider from './components/InputSlider'

function App() {
  // CANVAS
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasW, setCanvasWidth] = useState(window.innerWidth)
  const [canvasH, setCanvasHeight] = useState(window.innerHeight)

  // CONSTANTS
  const [thickness, setThickness] = useState(0.5)
  const [heightFactor, setHeightFactor] = useState(0.65)
  const [maxDepth, setMaxDepth] = useState(7)
  const [branchPropagation, setBranchPropagation] = useState(5)
  const [angle, setAngle] = useState(36)

  const handleThickness = (val: number) => setThickness(val)
  const handleHeightFactor = (val: number) => setHeightFactor(val)
  const handleMaxDepth = (val: number) => setMaxDepth(val)
  const handleBranchPropagation = (val: number) => setBranchPropagation(val)
  const handleAngle = (val: number) => setAngle(val)

  const [isRotate, setIsRotate] = useState(false)

  useLayoutEffect(() => {
    if (containerRef.current && containerRef.current.clientWidth) {
      setCanvasWidth(containerRef.current.clientWidth)
    }
    if (containerRef.current && containerRef.current.clientHeight) {
      setCanvasHeight(containerRef.current.clientHeight)
    }
  }, [])

  // DRAW
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const angleIncrement = (angle * Math.PI) / 180
    const startX = canvas.width / 2
    const startY = canvas.height - 100
    const height = (canvas.height * 7) / 24

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

      let newHeight = height * heightFactor
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
  }, [canvasW, canvasH, thickness, heightFactor, maxDepth, branchPropagation, angle])

  // ROTATE
  useEffect(() => {
    if (!isRotate) return

    let rotate = setInterval(incrementAngle, 100)

    function incrementAngle() {
      let newAngle = angle + 1
      if (newAngle >= 360) {
        setAngle(0)
      } else {
        setAngle(newAngle)
      }
    }

    return () => clearInterval(rotate)
  }, [angle, isRotate])

  function handleRotateSwitch() {
    setIsRotate(!isRotate)
  }

  // WATCH CANVAS
  useEffect(() => {
    window.addEventListener('resize', updateWidthAndHeight)
    return () => window.removeEventListener('resize', updateWidthAndHeight)
  }, [])

  function updateWidthAndHeight() {
    setCanvasWidth(window.innerWidth)
    setCanvasHeight(window.innerHeight)
  }

  return (
    <Grid container>
      <Grid item xs={2} sx={{ p: 2 }}>
        <InputSlider label="Thickness" value={thickness} step={0.1} min={0.1} max={2} emitChange={handleThickness} />
        <InputSlider
          label="Height Factor"
          value={heightFactor}
          step={0.05}
          min={0.25}
          max={0.75}
          emitChange={handleHeightFactor}
        />
        <InputSlider label="Max Depth" value={maxDepth} step={1} min={1} max={7} emitChange={handleMaxDepth} />
        <InputSlider
          label="Branch Propagation"
          value={branchPropagation}
          step={1}
          min={1}
          max={10}
          emitChange={handleBranchPropagation}
        />
        <InputSlider label="Branch Angle" value={angle} step={6} min={1} max={360} emitChange={handleAngle} />
        <FormControlLabel control={<Switch checked={isRotate} onChange={handleRotateSwitch} />} label="Rotate" />
      </Grid>
      <Grid item xs={10}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
          <canvas ref={canvasRef} width={canvasW} height={canvasH} />
        </div>
      </Grid>
    </Grid>
  )
}

export default App
