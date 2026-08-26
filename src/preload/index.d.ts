import { ElectronAPI } from '@electron-toolkit/preload'
import { IElectronAPI } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
  }
}
