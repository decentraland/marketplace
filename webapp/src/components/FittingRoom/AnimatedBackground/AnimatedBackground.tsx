import { useEffect, useRef } from 'react'
import fallbackBackgroundUrl from '../../../images/background/custom-welcome-background.webp'
import overlayTextureUrl from '../../../images/background/DCL_LogoPattern.png'
import { FRAGMENT_SHADER, VERTEX_SHADER } from './AnimatedBackground.shaders'
import { createProgram, createShader, loadTexture } from './AnimatedBackground.utils'
import './AnimatedBackground.css'

// Ported from decentraland/auth (src/components/AnimatedBackground): a WebGL
// purple vignette with the DCL logo pattern drifting across it. The static
// image is the fallback while WebGL boots (or if it's unavailable).
const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) {
      console.error('WebGL not supported')
      return
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vs || !fs) return

    const program = createProgram(gl, vs, fs)
    if (!program) return

    const positionLoc = gl.getAttribLocation(program, 'a_position')
    const timeLoc = gl.getUniformLocation(program, 'u_time')
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
    const overlayTexLoc = gl.getUniformLocation(program, 'u_overlayTex')

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)

    const overlayTexture = loadTexture(gl, overlayTextureUrl)

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.clientWidth * dpr
      const h = canvas.clientHeight * dpr
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }

    const startTime = performance.now() / 1000

    const render = () => {
      resize()
      gl.viewport(0, 0, canvas.width, canvas.height)

      gl.useProgram(program)

      gl.uniform1f(timeLoc, performance.now() / 1000 - startTime)
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height)

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, overlayTexture)
      gl.uniform1i(overlayTexLoc, 0)

      gl.enableVertexAttribArray(positionLoc)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

      gl.drawArrays(gl.TRIANGLES, 0, 6)

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buffer)
      gl.deleteTexture(overlayTexture)
    }
  }, [])

  return (
    <div className="AnimatedBackground" aria-hidden>
      <div className="AnimatedBackground__fallback" style={{ backgroundImage: `url(${fallbackBackgroundUrl})` }} />
      <canvas ref={canvasRef} className="AnimatedBackground__canvas" />
    </div>
  )
}

export default AnimatedBackground
