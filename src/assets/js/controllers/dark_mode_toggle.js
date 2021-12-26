import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['lightToggle', 'darkToggle']
  initialize() {
    const isLightMode =
      (localStorage && localStorage).getItem('isLightMode') === 'true'
    if (isLightMode) {
      this.useLightMode()
    }
  }
  useDarkMode() {
    document.documentElement.classList.add('dark')
    localStorage.setItem('isLightMode', false)
    this.darkToggleTarget.classList.add('hidden')
    this.lightToggleTarget.classList.remove('hidden')
  }
  useLightMode() {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('isLightMode', true)
    this.darkToggleTarget.classList.remove('hidden')
    this.lightToggleTarget.classList.add('hidden')
  }
}
