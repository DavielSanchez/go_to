import { createApp } from './app.js'
import { config } from './config.js'
import { connectDatabase,disconnectDatabase } from './db.js'
import {createServer} from 'node:http'
import {Server} from 'socket.io'
import jwt from 'jsonwebtoken'
import {realtime} from './realtime.js'

try {
 await connectDatabase()
 const httpServer=createServer(createApp());const io=new Server(httpServer,{cors:{origin:config.corsOrigin,credentials:true}})
 io.use((socket,next)=>{try{const payload=jwt.verify(socket.handshake.auth?.token,config.jwtSecret);socket.user=payload;next()}catch{next(new Error('Sesión inválida'))}})
 io.on('connection',socket=>socket.join(`user:${socket.user.sub}`));realtime.on('notification',({userId,notification})=>io.to(`user:${userId}`).emit('notification',notification))
 const server=httpServer.listen(config.port,()=>console.log(`Vía API escuchando en http://localhost:${config.port}`))
 const shutdown=signal=>{console.log(`${signal}: cerrando API`);server.close(async()=>{await disconnectDatabase();process.exit(0)})}
 process.on('SIGINT',()=>shutdown('SIGINT'));process.on('SIGTERM',()=>shutdown('SIGTERM'))
} catch(error){console.error('No se pudo iniciar la API:',error.message);process.exit(1)}
