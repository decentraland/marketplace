import logoImg from '../../../images/logo_dcl.svg'

const gradientColors = [
  { min: 2, max: 3, colors: ['#C640CD', '#691FA9'] }, // Purple gradient for name length 2-3
  { min: 4, max: 5, colors: ['#FF2D55', '#FFBC5B'] }, // Orange gradient for name length 4-5
  { min: 5, max: 6, colors: ['#73FFAF', '#1A9850'] }, // Green gradient for name length 5-6
  { min: 7, max: 8, colors: ['#81D1FF', '#3077E1'] }, // Blue gradient for name length 7-8
  { min: 9, max: 10, colors: ['#F6C1FF', '#FF4BED'] }, // Pink gradient for name length 9-10
  { min: 11, max: 15, colors: ['#FF9EB1', '#FF2D55'] } // Red gradient for name length 11-15 (max length)
]

const fontFile = new FontFace('Inter', 'url(https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2)')

document.fonts.add(fontFile)
const promiseOfLoadedFont = fontFile.load()

function getGradientColors(nameLength: number) {
  // Find the gradient that matches the length of the name
  const matchingGradient = gradientColors.find(gradient => nameLength >= gradient.min && nameLength <= gradient.max)
  // Return the colors if found, or default colors if no match
  return matchingGradient ? matchingGradient.colors : ['#000000', '#FFFFFF'] // Default to black and white if no match
}

const promiseOfALogo = new Promise<HTMLImageElement>((resolve, reject) => {
  const img = new Image()
  img.src = logoImg
  img.onload = () => resolve(img)
  img.onabort = reject
  img.onerror = reject
})

export async function drawImage(canvas: HTMLCanvasElement, name: string, width: number, height: number, onlyLogo?: boolean): Promise<void> {
  // Create a canvas and get the context
  const ctx = canvas.getContext('2d')

  const borderRadius = 8
  let nameYPosition = 0
  if (!ctx) {
    return
  }

  ctx.fillStyle = '#000000' // Set the background color
  ctx.fillRect(0, 0, width, height)

  ctx.canvas.width = width
  ctx.canvas.height = height

  // Create a rounded rectangle path
  ctx.beginPath()
  ctx.moveTo(borderRadius, 0)
  ctx.lineTo(width - borderRadius, 0)
  ctx.quadraticCurveTo(width, 0, width, borderRadius)
  if (onlyLogo) {
    ctx.lineTo(width, height - borderRadius)
    ctx.quadraticCurveTo(width, height, width - borderRadius, height)
    ctx.lineTo(borderRadius, height)
    ctx.quadraticCurveTo(0, height, 0, height - borderRadius)
  } else {
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
  }
  ctx.lineTo(0, borderRadius)
  ctx.quadraticCurveTo(0, 0, borderRadius, 0)
  ctx.closePath()

  // Clip the path so everything drawn afterwards will be within rounded corners
  ctx.clip()

  // Generate gradient based on the name length
  const colors = getGradientColors(name.length)

  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, colors[0])
  gradient.addColorStop(1, colors[1])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  if (!onlyLogo) {
    try {
      await promiseOfLoadedFont
      ctx.font = '600 24px Inter' // This sets the font weight to 600 and the font size to 40px
      ctx.fillStyle = '#FCFCFC'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Calculate the vertical center for the name
      nameYPosition = height / 2 + 10 // Adjust as needed
      ctx.fillText(name, width / 2, nameYPosition)

      ctx.font = '700 16px Inter' // This sets the font weight to700 and the font size to 18px
      ctx.fillStyle = '#FCFCFCCC'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const dclEthYPosition = nameYPosition + 30 // Position "DCL.ETH" below the name
      ctx.globalAlpha = 0.7
      ctx.fillText('DCL.ETH', width / 2, dclEthYPosition)
      ctx.globalAlpha = 1
    } catch (e) {
      console.error('Error loading fonts', e)
    }
  }

  // Load and draw the logo
  try {
    const logoWidth = onlyLogo ? width * 0.8 : 40 // LOGO WIDTH
    const logoHeight = onlyLogo ? height * 0.8 : 40 // LOGO HEIGHT
    const logoXPosition = width / 2 - logoWidth / 2 // Center the logo
    const logoYPosition = onlyLogo ? height / 2 - logoHeight / 2 : nameYPosition - logoHeight - 25 // Adjust space above the name
    if (!onlyLogo) {
      ctx.globalAlpha = 0.5
    }
    ctx.drawImage(await promiseOfALogo, logoXPosition, logoYPosition, logoWidth, logoHeight)
    ctx.globalAlpha = 1
  } catch (e) {
    console.error('Error loading logo', e)
  }
}
