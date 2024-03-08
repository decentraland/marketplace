import { useEffect, useRef } from 'react'
import { drawImage } from './utils'
import { Props } from './EnsImage.types'

export const EnsImage = ({ name, className, onlyLogo }: Props) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const resizeListener = () => {
      requestAnimationFrame(() => ref.current && drawImage(ref.current, name, ref.current.offsetWidth, ref.current.offsetHeight))
    }
    window.addEventListener('resize', resizeListener)
    return () => {
      ref.current?.removeEventListener('resize', resizeListener)
    }
  }, [name])

  useEffect(() => {
    requestAnimationFrame(() => ref.current && drawImage(ref.current, name, ref.current.offsetWidth, ref.current.offsetHeight, onlyLogo))
  }, [name])

  return <canvas style={{ height: '100%', width: '100%' }} ref={ref} className={className} />
}
