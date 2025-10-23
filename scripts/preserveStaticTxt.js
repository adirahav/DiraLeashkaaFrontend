import { copyFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const adsTxtSrc = join(__dirname, '../ads.txt')
const appAdsTxtSrc = join(__dirname, '../app-ads.txt')
const serviceWorkerSrc = join(__dirname, '../service-worker.js')
const manifestSrc = join(__dirname, '../manifest.json')
const logo192Src = join(__dirname, '../assets/logo_192x192.png')
const logo512Src = join(__dirname, '../assets/logo_512x512.png')

const adsTxtDest = join(__dirname, '../../../NodeProjects/diraleashkaa-backend/public/ads.txt')
const appAdsTxtDest = join(__dirname, '../../../NodeProjects/diraleashkaa-backend/public/app-ads.txt')
const serviceWorkerDest = join(__dirname, '../../../NodeProjects/diraleashkaa-backend/public/service-worker.js')
const manifestDest = join(__dirname, '../../../NodeProjects/diraleashkaa-backend/public/manifest.json')
const logo192Dest = join(__dirname, '../../../NodeProjects/diraleashkaa-backend/public/assets/logo_192x192.png')
const logo512Dest = join(__dirname, '../../../NodeProjects/diraleashkaa-backend/public/assets/logo_512x512.png')

try {
  await copyFile(adsTxtSrc, adsTxtDest)
  console.log('ads.txt copied ✔️')
  
  await copyFile(appAdsTxtSrc, appAdsTxtDest)
  console.log('app-ads.txt copied ✔️')

  await copyFile(serviceWorkerSrc, serviceWorkerDest)
  console.log('service-worker.js copied ✔️')
  
  await copyFile(manifestSrc, manifestDest)
  console.log('manifest.json copied ✔️')

  await copyFile(logo192Src, logo192Dest)
  console.log('logo_192x192.png copied ✔️')

  await copyFile(logo512Src, logo512Dest)
  console.log('logo_512x512.png copied ✔️')

} catch (err) {
  console.error('Error copying static files:', err)
}
