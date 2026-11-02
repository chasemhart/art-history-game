// Image helpers: connect a painting to its optimized web copies.
//
// Used by: anything that shows a painting (the Sort screen, later the zoom
// view and review list), and the preloading of the next painting.
// Why it exists as its own file: the web copies, their sizes, and the rules
// for which one a browser should download are the same everywhere a painting
// appears. Writing that once here means a screen just asks for "the image for
// this painting" and gets every attribute right.

import imageSizes from '../data/imageSizes.json'

const WEB_FOLDER = '/images/web/'

// How wide the painting appears on screen, so the browser can pick the
// smallest copy that still looks sharp. On wide screens the painting column
// is at most about 720px wide; on narrow screens it spans the page minus its
// side margins. A phone with a high-resolution screen may still choose the
// larger copy, which is the browser's call to make.
export const PAINTING_SIZES = '(min-width: 1000px) 720px, calc(100vw - 32px)'

// Everything an <img> needs for one painting: the copies to choose from
// (srcSet), its real width and height (so the page reserves the right shape
// before it loads and nothing jumps), and its alt text.
export function paintingImage(painting, { sizes = PAINTING_SIZES } = {}) {
  const info = imageSizes[painting.id]
  if (!info) {
    throw new Error(`No web image for "${painting.id}". Run npm run images.`)
  }
  const largest = info.variants.at(-1)
  return {
    src: WEB_FOLDER + largest.file,
    srcSet: info.variants.map((v) => `${WEB_FOLDER}${v.file} ${v.width}w`).join(', '),
    sizes,
    width: info.width,
    height: info.height,
    alt: painting.image.alt,
  }
}

// The smallest copy, for places where the picture is only a hint of color
// (the blurred ambient glow) or a thumbnail
export function smallestImage(painting) {
  return WEB_FOLDER + imageSizes[painting.id].variants[0].file
}

// Ask the browser to start downloading a painting before it is shown, so the
// next painting appears without a wait. The browser uses the same srcset rules
// as the real image, so it fetches the same copy it will later display.
export function preloadPainting(painting) {
  const { src, srcSet, sizes } = paintingImage(painting)
  const img = new Image()
  img.sizes = sizes
  img.srcset = srcSet
  img.src = src
}
