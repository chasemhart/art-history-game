// Image pipeline: turns Chase's original images into small, fast web images.
//
// Run with: npm run images
// Used by: the app reads the files this writes (public/images/web/) and the
// sizes it records (src/data/imageSizes.json).
// Why it exists as its own script: the originals add up to about 17 MB, and
// one is over 4 MB. A phone on a cellular connection would wait seconds for
// each painting. Making the small copies by hand would be slow and easy to get
// wrong, so this script does it the same way every time. Chase's originals are
// never changed.
//
// For each painting in src/data/paintings.js it writes two WebP files named by
// the painting's id, one fitting inside 800 by 800 pixels and one inside 1600
// by 1600. Fitting inside a square (instead of fixing the width) keeps tall
// portraits from becoming huge files. WebP is used alone, without a JPEG
// fallback, because every current browser shows it.

import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import paintings from '../src/data/paintings.js'

const root = new URL('../', import.meta.url)
const originalsDir = fileURLToPath(new URL('public/images/', root))
const webDir = fileURLToPath(new URL('public/images/web/', root))
const sizesFile = fileURLToPath(new URL('src/data/imageSizes.json', root))

// The two sizes: phones and small screens get the first, large and sharp
// screens the second. The browser chooses using srcset (see src/lib/images.js).
const SIZES = [800, 1600]
// Quality 80 is where WebP files get much smaller with no difference you can
// see at normal viewing size
const QUALITY = 80
// Warn if a web copy is still heavier than this, so it gets a second look
const BUDGET_BYTES = 300 * 1024

// Skip work when the web copy is newer than the original, so re-running the
// script after adding one painting only processes that painting
async function isUpToDate(original, output) {
  try {
    const [o, w] = await Promise.all([stat(original), stat(output)])
    return w.mtimeMs >= o.mtimeMs
  } catch {
    return false
  }
}

async function main() {
  await mkdir(webDir, { recursive: true })
  const sizes = {}
  const expectedFiles = new Set()
  let totalLarge = 0

  for (const painting of paintings) {
    const original = originalsDir + painting.image.original
    const variants = []
    const { width: originalWidth, height: originalHeight } = await sharp(original).rotate().metadata()

    for (const [index, size] of SIZES.entries()) {
      // If the original already fit inside the previous size, a larger copy
      // would be the same picture saved twice, so stop here
      const previous = SIZES[index - 1]
      if (previous && originalWidth <= previous && originalHeight <= previous) break

      const file = `${painting.id}-${size}.webp`
      const output = webDir + file
      expectedFiles.add(file)

      if (!(await isUpToDate(original, output))) {
        await sharp(original)
          // Respect the camera's rotation flag, then drop the metadata
          .rotate()
          .resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 6 })
          .toFile(output)
      }

      const { width, height } = await sharp(output).metadata()
      const bytes = (await stat(output)).size
      variants.push({ file, width, height })

      if (bytes > BUDGET_BYTES) {
        console.warn(`  Heavier than ${BUDGET_BYTES / 1024} KB: ${file} (${Math.round(bytes / 1024)} KB)`)
      }
    }
    totalLarge += (await stat(webDir + variants.at(-1).file)).size

    // A painting shown about 660 pixels tall looks soft on sharp screens if
    // the original is much smaller than that
    if (Math.max(originalWidth, originalHeight) < 1000) {
      console.warn(`  Low-resolution original (${originalWidth} by ${originalHeight}): ${painting.image.original}`)
    }

    // The largest copy's dimensions give the shape (aspect ratio) the page
    // reserves before the image arrives, so nothing jumps while it loads
    const largest = variants.at(-1)
    sizes[painting.id] = {
      width: largest.width,
      height: largest.height,
      variants: variants.map(({ file, width }) => ({ file, width })),
    }
  }

  // Remove web copies of paintings that are no longer in the data
  for (const file of await readdir(webDir)) {
    if (!expectedFiles.has(file)) await rm(webDir + file)
  }

  await writeFile(sizesFile, JSON.stringify(sizes, null, 2) + '\n')

  console.log(
    `Optimized ${paintings.length} paintings. Largest copies total ${(totalLarge / 1024 / 1024).toFixed(1)} MB.`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
