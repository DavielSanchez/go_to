import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config.js'
import { authenticate } from './auth.js'
import { errorHandler } from './utils.js'
import authRoutes from './routes/auth.js'
import employeeRoutes from './routes/employees.js'
import requestRoutes from './routes/requests.js'
import routeRoutes from './routes/routes.js'
import boardingRoutes from './routes/boarding.js'
import dashboardRoutes from './routes/dashboard.js'
import adminRoutes from './routes/admin.js'
import pilotRoutes from './routes/pilot.js'
import {ErrorEvent} from './models.js'
import templateRoutes from './routes/templates.js'
import reportRoutes from './routes/reports.js'

export function createApp(){
 const app=express();app.disable('x-powered-by');app.use(helmet());app.use(cors({origin(origin,cb){if(!origin||config.corsOrigin.includes(origin))return cb(null,true);cb(new Error('Origen no permitido por CORS.'))},credentials:true}));app.use(express.json({limit:'2mb'}));app.use(morgan(config.env==='test'?'tiny':'combined'));app.post('/api/errors',async(req,res)=>{await ErrorEvent.create({message:req.body.message,stack:req.body.stack,path:req.body.path,method:'CLIENT',status:500,ip:req.ip});res.status(202).end()})
 app.get('/api/health',(req,res)=>res.json({status:'ok',service:'via-api',timestamp:new Date().toISOString()}));app.use('/api/auth',authRoutes);app.use('/api/dashboard',authenticate,dashboardRoutes);app.use('/api/employees',authenticate,employeeRoutes);app.use('/api/requests',authenticate,requestRoutes);app.use('/api/routes',authenticate,routeRoutes);app.use('/api/boarding',authenticate,boardingRoutes);app.use('/api/admin',authenticate,adminRoutes)
 app.use('/api/templates',authenticate,templateRoutes);app.use('/api/reports',authenticate,reportRoutes);app.use('/api/pilot',authenticate,pilotRoutes);app.use('/api',(req,res)=>res.status(404).json({error:{code:'NOT_FOUND',message:'Endpoint no encontrado.'}}));app.use(errorHandler);return app
}
