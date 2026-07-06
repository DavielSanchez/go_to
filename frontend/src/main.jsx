import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './styles2.css'
import './styles3.css'
import './styles4.css'
import './styles5.css'
import './styles6.css'
import './styles7.css'
import './styles8.css'
import App from './App'
import { AuthProvider, useAuth } from './AuthContext'
import Login from './Login'
import NotificationCenter from './NotificationCenter'
import {api} from './api'
import {DialogProvider} from './DialogContext'

class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error,info){api('/errors',{method:'POST',body:{message:error.message,stack:`${error.stack}\n${info.componentStack}`,path:location.pathname}}).catch(()=>{})}
  render() {
    if (this.state.error) return <main className="fatal-error"><h1>No pudimos iniciar Vía</h1><p>{this.state.error.message}</p><button onClick={() => location.reload()}>Intentar de nuevo</button></main>
    return this.props.children
  }
}

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el contenedor principal de la aplicación.')
function Root(){const {user,loading}=useAuth();if(loading)return <main className="boot"><span/><p>Preparando la operación…</p></main>;return user?<><App/><NotificationCenter/></>:<Login/>}
createRoot(root).render(<React.StrictMode><AppErrorBoundary><AuthProvider><DialogProvider><Root/></DialogProvider></AuthProvider></AppErrorBoundary></React.StrictMode>)
