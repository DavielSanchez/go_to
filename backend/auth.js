import jwt from 'jsonwebtoken'
import { config } from './config.js'
import { User } from './models.js'
import {tenantStorage} from './tenant-context.js'

export function signToken(user) {
  return jwt.sign({ sub: user.id, tenant:String(user.tenant), role: user.role, name: user.name }, config.jwtSecret, { expiresIn: config.jwtExpiresIn })
}

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
    if (!token) return res.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Inicia sesión para continuar.' } })
    const payload = jwt.verify(token, config.jwtSecret)
    const user = await User.findOne({_id:payload.sub,tenant:payload.tenant}).select('name email role active employee tenant')
    if (!user?.active) return res.status(401).json({ error: { code: 'INVALID_SESSION', message: 'La sesión ya no es válida.' } })
    req.user = user;req.tenantId=user.tenant
    tenantStorage.run({tenantId:String(user.tenant)},next)
  } catch {
    res.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'La sesión expiró o no es válida.' } })
  }
}

export const allow = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Tu rol no permite realizar esta acción.' } })
