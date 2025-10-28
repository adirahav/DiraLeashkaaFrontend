import { copyFile } from 'fs/promises'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const adsTxtSrc = join(__dirname, '../ads.txt')
const appAdsTxtSrc = join(__dirname, '../app-ads.txt')
//const serviceWorkerSrc = join(__dirname, '../service-worker.js')
//const manifestSrc = join(__dirname, '../manifest.json')
//const logo192Src = join(__dirname, '../icon-192x192.png')
//const logo512Src = join(__dirname, '../icon-512x512.png')
//const indexHtmlSrc = join(__dirname, '../dist/index.html')

const backendPublic = join(__dirname, '../../../NodeProjects/diraleashkaa-backend/public')
const adsTxtDest = join(backendPublic, 'ads.txt')
const appAdsTxtDest = join(backendPublic, 'app-ads.txt')
//const serviceWorkerDest = join(backendPublic, 'service-worker.js')
//const manifestDest = join(backendPublic, 'manifest.json')
//const logo192Dest = join(backendPublic, 'assets/icon-192x192.png')
//const logo512Dest = join(backendPublic, 'assets/icon-512x512.png')
//const indexHtmlDest = join(backendPublic, 'index.html')

try {
  await copyFile(adsTxtSrc, adsTxtDest)
  console.log('ads.txt copied ✔️')
  
  await copyFile(appAdsTxtSrc, appAdsTxtDest)
  console.log('app-ads.txt copied ✔️')

  /*await copyFile(serviceWorkerSrc, serviceWorkerDest)
  console.log('service-worker.js copied ✔️')
  
  await copyFile(manifestSrc, manifestDest)
  console.log('manifest.json copied ✔️')

  await copyFile(logo192Src, logo192Dest)
  console.log('icon-192x192.png copied ✔️')

  await copyFile(logo512Src, logo512Dest)
  console.log('icon-512x512.png copied ✔️')

  // index.html
  let indexHtml = readFileSync(indexHtmlSrc, 'utf8')

  if (!indexHtml.includes('rel="manifest"')) {
    indexHtml = indexHtml.replace(
      '</head>',
      '  <link rel="manifest" href="/manifest.json">\n<meta name="theme-color" content="#1976d2" />\n</head>'
    )
    console.log('✅ manifest link added to index.html')
  }

  writeFileSync(indexHtmlDest, indexHtml, 'utf8')
  console.log('index.html copied ✔️')*/

} catch (err) {
  console.error('Error copying static files:', err)
}
