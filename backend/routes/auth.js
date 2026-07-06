import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { Tenant,User,AuditLog } from '../models.js'
import { authenticate, signToken } from '../auth.js'
import { asyncHandler } from '../utils.js'

const router = Router()
router.post('/login', asyncHandler(async (req,res) => {
  const input = z.object({ tenant:z.string().min(2),email: z.string().email(), password: z.string().min(8) }).parse(req.body)
  const tenant=await Tenant.findOne({slug:input.tenant.toLowerCase(),active:true});if(!tenant)return res.status(401).json({error:{code:'INVALID_TENANT',message:'Empresa o site no válido.'}})
  const user = await User.findOne({tenant:tenant._id,email: input.email.toLowerCase(), active: true }).select('+passwordHash')
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Correo o contraseña incorrectos.' } })
  await AuditLog.create({tenant:tenant._id,actor:user._id,action:'auth.login',entityType:'User',entityId:user.id,metadata:{role:user.role},ip:req.ip})
  res.json({ token: signToken(user), user: { id:user.id,name:user.name,email:user.email,role:user.role,employee:user.employee,tenant:{id:tenant.id,name:tenant.name,slug:tenant.slug} } })
}))
router.get('/me', authenticate, (req,res) => res.json({ user: req.user }))
export default router
