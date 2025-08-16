import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './src/App'
import '@ionic/react/css/core.css'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

