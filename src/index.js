import React from 'react'
import ReactDOM from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import './index.css'
import App from './App'

import localizationEN from './locales/en/translation.json'
import localizationCZ from './locales/cz/translation.json'

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: {
    en: {
      common: localizationEN
    },
    cz: {
      common: localizationCZ
    }
  }
})

ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
