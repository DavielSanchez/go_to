import { AuditLog, EligibilityRule,ErrorEvent } from './models.js'

export const startOfDay = value => { const d = value ? new Date(value) : new Date(); d.setHours(0,0,0,0); return d }
export const endOfDay = value => { const d = startOfDay(value); d.setHours(23,59,59,999); return d }
export const asyncHandler = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next)

export async function audit(req, action, entityType, entityId, before, after, metadata = {}) {
  await AuditLog.create({ tenant:req.tenantId,actor: req.user?._id, action, entityType, entityId: String(entityId || ''), before, after, metadata:{...metadata,role:req.user?.role}, ip: req.ip })
}

export async function evaluateEligibility(employee, schedule) {
  if (!employee.active) return { eligible: false, reason: 'Empleado inactivo' }
  if (!employee.generalEligibility) return { eligible: false, reason: 'Beneficio desactivado por RRHH' }
  if (schedule.overtimeApproved) return { eligible: true, reason: 'Overtime aprobado' }
  const rule = await EligibilityRule.findOne({ key: 'minimum_exit_time', enabled: true }).lean()
  const minimum = rule?.value || '21:00'
  return schedule.endsAt >= minimum ? { eligible: true, reason: `Salida posterior a ${minimum}` } : { eligible: false, reason: `Salida anterior a ${minimum}` }
}

export function errorHandler(err, req, res, next) {
  console.error(err)
  ErrorEvent.create({tenant:req.tenantId,user:req.user?._id,message:err.message,stack:err.stack,path:req.originalUrl,method:req.method,status:err.status||500,ip:req.ip}).catch(()=>{})
  if (err.name === 'ZodError') return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Los datos enviados no son válidos.', details: err.flatten() } })
  if (err.code === 11000) return res.status(409).json({ error: { code: 'DUPLICATE', message: 'Ya existe un registro con esos datos.', fields: err.keyValue } })
  if (err.name === 'ValidationError') return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: err.message } })
  res.status(err.status || 500).json({ error: { code: 'INTERNAL_ERROR', message: configSafeMessage(err) } })
}

function configSafeMessage(err) { return process.env.NODE_ENV === 'production' ? 'Ocurrió un error inesperado.' : err.message }
