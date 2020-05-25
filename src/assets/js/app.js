import { Application } from 'stimulus'
import Turbolinks from 'turbolinks'

import DarkModeController from './controllers/dark_mode_toggle'

const application = Application.start()
application.register('dark-mode-controller', DarkModeController)

Turbolinks.start()
