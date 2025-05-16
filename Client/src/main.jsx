
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RegistrationPage from './components/Registration_Page.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <RegistrationPage/>
  </>,
)
