import { Router } from 'express'
import { z } from 'zod'
import { allow } from '../auth.js'
import { AuditLog,Driver,EligibilityRule,Vehicle } from '../models.js'
import { asyncHandler,audit } from '../utils.js'
const router=Router()
router.get('/vehicles',asyncHandler(async(req,res)=>res.json({data:await Vehicle.find().sort({code:1}).lean()})))
router.post('/vehicles',allow('admin','operations','provider'),asyncHandler(async(req,res)=>{const input=z.object({code:z.string(),plate:z.string(),capacity:z.number().int().positive(),provider:z.string(),operationalStatus:z.enum(['available','assigned','maintenance','inactive']).default('available')}).parse(req.body);const data=await Vehicle.create(input);await audit(req,'vehicle.created','Vehicle',data.id,null,data.toObject());res.status(201).json({data})}))
router.get('/drivers',asyncHandler(async(req,res)=>res.json({data:await Driver.find().populate('authorizedVehicles').sort({name:1}).lean()})))
router.post('/drivers',allow('admin','operations','provider'),asyncHandler(async(req,res)=>{const input=z.object({name:z.string(),phone:z.string(),license:z.string(),authorizedVehicles:z.array(z.string()).default([])}).parse(req.body);const data=await Driver.create(input);await audit(req,'driver.created','Driver',data.id,null,data.toObject());res.status(201).json({data})}))
router.get('/rules',asyncHandler(async(req,res)=>res.json({data:await EligibilityRule.find().sort({key:1}).lean()})))
router.put('/rules/:key',allow('admin','operations','hr'),asyncHandler(async(req,res)=>{const before=await EligibilityRule.findOne({key:req.params.key}).lean();const data=await EligibilityRule.findOneAndUpdate({key:req.params.key},{...req.body,key:req.params.key},{upsert:true,new:true,runValidators:true});await audit(req,'rule.updated','EligibilityRule',data.id,before,data.toObject());res.json({data})}))
router.get('/audit',allow('admin','operations','hr'),asyncHandler(async(req,res)=>{const data=await AuditLog.find().populate('actor','name email role').sort({createdAt:-1}).limit(Math.min(Number(req.query.limit)||100,500)).lean();res.json({data})}))
export default router
