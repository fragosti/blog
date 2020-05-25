import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['lightToggle', 'darkToggle']
  initialize() {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true'
    if (isDarkMode) {
      this.useDarkMode()
    }
  }
  useDarkMode() {
    document.documentElement.classList.add('mode-dark')
    localStorage.setItem('isDarkMode', true)
    this.darkToggleTarget.classList.add('hidden')
    this.lightToggleTarget.classList.remove('hidden')
  }
  useLightMode() {
    document.documentElement.classList.remove('mode-dark')
    localStorage.setItem('isDarkMode', false)
    this.darkToggleTarget.classList.remove('hidden')
    this.lightToggleTarget.classList.add('hidden')
  }
}
