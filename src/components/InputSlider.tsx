import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import MuiInput from '@mui/material/Input'

const Input = styled(MuiInput)`
  width: 42px;
`

interface InputSliderProps {
  label: string
  value: number | string | Array<number | string>
  step: number
  min: number
  max: number
  emitChange: (val: number) => void
}

export default function InputSlider({ label, value, step, min, max, emitChange }: InputSliderProps) {
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') emitChange(newValue)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let val = event.target.value === '' ? '' : Number(event.target.value)
    if (typeof val === 'number') emitChange(val)
  }

  const handleBlur = () => {
    if (value < min) {
      emitChange(min)
    } else if (value > max) {
      emitChange(max)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography id={`input-slider-${label}`} gutterBottom>
        {label}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby={`input-slider-${label}`}
            step={step}
            marks
            min={min}
            max={max}
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: step,
              min: min,
              max: max,
              type: 'number',
              'aria-labelledby': `input-slider-${label}`,
            }}
            sx={{ width: '60px' }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
