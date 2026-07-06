import {Router} from 'express';import {allow} from '../auth.js';import {createXlsx} from '../xlsx.js'
const router=Router(),send=(res,name,headers,row)=>res.set({'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','Content-Disposition':`attachment; filename="${name}"`}).send(createXlsx([{name:'Plantilla',headers,rows:[row]}]))
router.get('/employees.xlsx',allow('admin','hr'),(req,res)=>send(res,'plantilla-empleados.xlsx',['bms','siteCode','name','email','department','zone','address','city','recurring'],['7002001','SDQ-01','Nombre Apellido','correo@empresa.com','Operaciones','Santo Domingo Este','Calle y número','Santo Domingo','true']))
router.get('/schedules.xlsx',allow('admin','workforce'),(req,res)=>send(res,'plantilla-horarios.xlsx',['bms','workDate','startsAt','endsAt','workingDays','overtimeApproved','reason'],['7002001',new Date().toISOString().slice(0,10),'14:00','22:30','1|2|3|4|5','false','Carga semanal']))
export default router
