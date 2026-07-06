import mongoose from 'mongoose'
import {tenantPlugin} from './tenant-context.js'

const options = { timestamps: true, versionKey: false }
const tenantSchema = new mongoose.Schema({name:{type:String,required:true},slug:{type:String,required:true,unique:true,lowercase:true},active:{type:Boolean,default:true},sites:[{code:String,name:String,address:String}],settings:{timezone:{type:String,default:'America/Santo_Domingo'},minimumExitTime:{type:String,default:'21:00'}}},options)
const addressSchema = new mongoose.Schema({ line1: String, sector: String, city: { type: String, default: 'Santo Domingo' }, zone: { type: String, required: true }, coordinates: { lat: Number, lng: Number } }, { _id: false })

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin','hr','workforce','operations','supervisor','trainer','driver','employee'], required: true }, active: { type: Boolean, default: true }, employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
}, options)

const employeeSchema = new mongoose.Schema({
  employeeCode:{type:String,select:false}, bms: { type: String, required: true, match: /^\d{7}$/ }, siteCode:{type:String,required:true}, name: { type: String, required: true }, email: { type: String, lowercase: true }, department: { type: String, required: true }, supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, address: { type: addressSchema, required: true },
  active: { type: Boolean, default: true }, generalEligibility: { type: Boolean, default: true }, recurring: { type: Boolean, default: false }, qrToken: { type: String, required: true, unique: true },
}, options)

const scheduleSchema = new mongoose.Schema({ employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, workDate: { type: Date, required: true }, startsAt: String, endsAt: { type: String, required: true }, overtimeApproved: { type: Boolean, default: false }, source: { type: String, enum: ['import','manual','overtime'], default: 'manual' }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }, options)
employeeSchema.pre('validate',function(next){this.employeeCode=this.bms;next()})
scheduleSchema.index({ employee: 1, workDate: 1 }, { unique: true })

const requestSchema = new mongoose.Schema({ employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, serviceDate: { type: Date, required: true }, status: { type: String, enum: ['eligible','pending','confirmed','cancelled','rejected','assigned','boarded','no_show'], default: 'pending' }, eligibilityReason: String, exceptional: { type: Boolean, default: false }, exceptionReason: { type: String, enum: ['overtime','emergency','operational_change','substitution', null], default: null }, approvalStatus: { type: String, enum: ['not_required','pending','approved','rejected'], default: 'not_required' }, approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' }, confirmedAt: Date }, options)
requestSchema.index({ employee: 1, serviceDate: 1 }, { unique: true })

const vehicleSchema = new mongoose.Schema({ code: { type: String, required: true, unique: true }, plate: { type: String, required: true, unique: true }, capacity: { type: Number, required: true, min: 1 }, provider: String, operationalStatus: { type: String, enum: ['available','assigned','maintenance','inactive'], default: 'available' } }, options)
const driverSchema = new mongoose.Schema({ name: { type: String, required: true }, phone: String, license: { type: String, required: true, unique: true }, active: { type: Boolean, default: true }, authorizedVehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }], user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }, options)

const routeSchema = new mongoose.Schema({ code: { type: String, required: true }, name: { type: String, required: true }, serviceDate: { type: Date, required: true }, zone: { type: String, required: true }, departureTime: String, estimatedMinutes: Number, vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }, driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }, passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }], status: { type: String, enum: ['draft','approved','sent','boarding','completed','cancelled'], default: 'draft' }, stops: [{ label: String, order: Number }], approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, approvedAt: Date }, options)
routeSchema.index({ code: 1, serviceDate: 1 }, { unique: true })

const boardingSchema = new mongoose.Schema({ route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true }, employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, boardedAt: { type: Date, default: Date.now }, validation: { type: String, enum: ['allowed','unauthorized','wrong_route','outside_schedule','duplicate','ad_hoc'], required: true }, adHocReason: String, scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, offlineId: String }, options)
boardingSchema.index({ route: 1, employee: 1 }, { unique: true, partialFilterExpression: { validation: 'allowed' } })

const ruleSchema = new mongoose.Schema({ key: { type: String, required: true, unique: true }, label: String, enabled: { type: Boolean, default: true }, value: mongoose.Schema.Types.Mixed, description: String }, options)
const auditSchema = new mongoose.Schema({ actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, action: { type: String, required: true }, entityType: String, entityId: String, before: mongoose.Schema.Types.Mixed, after: mongoose.Schema.Types.Mixed, metadata: mongoose.Schema.Types.Mixed, ip: String }, options)

const tenantField={tenant:{type:mongoose.Schema.Types.ObjectId,ref:'Tenant',required:true,index:true}}
for(const [schema,path] of [[userSchema,'email'],[employeeSchema,'qrToken'],[vehicleSchema,'code'],[vehicleSchema,'plate'],[driverSchema,'license'],[ruleSchema,'key']])schema.path(path).options.unique=false
for(const schema of [userSchema,employeeSchema,scheduleSchema,requestSchema,vehicleSchema,driverSchema,routeSchema,boardingSchema,ruleSchema,auditSchema])schema.add(tenantField)
routeSchema.add({description:String,routeType:{type:String,enum:['door_to_door','common_points'],default:'common_points'}})
requestSchema.add({employeeComment:String,supervisorComment:String,decidedAt:Date})
scheduleSchema.add({workingDays:[{type:Number,min:0,max:6}],changeReason:String})
userSchema.index({tenant:1,email:1},{unique:true});employeeSchema.index({tenant:1,bms:1},{unique:true});vehicleSchema.index({tenant:1,code:1},{unique:true});routeSchema.index({tenant:1,code:1,serviceDate:1},{unique:true})

const notificationSchema=new mongoose.Schema({tenant:{type:mongoose.Schema.Types.ObjectId,ref:'Tenant',required:true,index:true},user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},type:{type:String,required:true},title:{type:String,required:true},message:String,entityType:String,entityId:String,readAt:Date},options)
const tripSchema=new mongoose.Schema({tenant:{type:mongoose.Schema.Types.ObjectId,ref:'Tenant',required:true,index:true},route:{type:mongoose.Schema.Types.ObjectId,ref:'Route',required:true},startedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},startedAt:{type:Date,default:Date.now},missingPassengers:{type:Number,default:0},status:{type:String,enum:['started','completed'],default:'started'}},options)
const errorEventSchema=new mongoose.Schema({tenant:{type:mongoose.Schema.Types.ObjectId,ref:'Tenant'},user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},message:String,stack:String,path:String,method:String,status:Number,ip:String},options)
for(const schema of [userSchema,employeeSchema,scheduleSchema,requestSchema,vehicleSchema,driverSchema,routeSchema,boardingSchema,ruleSchema,auditSchema,notificationSchema,tripSchema,errorEventSchema])schema.plugin(tenantPlugin)

export const User = mongoose.model('User', userSchema)
export const Tenant = mongoose.model('Tenant',tenantSchema)
export const Employee = mongoose.model('Employee', employeeSchema)
export const Schedule = mongoose.model('Schedule', scheduleSchema)
export const TransportRequest = mongoose.model('TransportRequest', requestSchema)
export const Vehicle = mongoose.model('Vehicle', vehicleSchema)
export const Driver = mongoose.model('Driver', driverSchema)
export const Route = mongoose.model('Route', routeSchema)
export const Boarding = mongoose.model('Boarding', boardingSchema)
export const EligibilityRule = mongoose.model('EligibilityRule', ruleSchema)
export const AuditLog = mongoose.model('AuditLog', auditSchema)
export const Notification = mongoose.model('Notification',notificationSchema)
export const Trip = mongoose.model('Trip',tripSchema)
export const ErrorEvent = mongoose.model('ErrorEvent',errorEventSchema)
