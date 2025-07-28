import { copyFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const adsTxtSrc = join(__dirname, '../ads.txt')
const appAdsTxtSrc = join(__dirname, '../app-ads.txt')

const adsTxtDest = join(__dirname, '../../../NodeProjects/diraleashkaa-backend/public/ads.txt')
const appAdsTxtDest = join(__dirname, '../../../NodeProjects/diraleashkaa-backend/public/app-ads.txt')

try {
  await copyFile(adsTxtSrc, adsTxtDest)
  console.log('ads.txt copied ✔️')
  
  await copyFile(appAdsTxtSrc, appAdsTxtDest)
  console.log('app-ads.txt copied ✔️')
  
} catch (err) {
  console.error('Error copying ads files:', err)
}
