import {EventEmitter} from 'node:events'
import {Notification} from './models.js'

export const realtime=new EventEmitter()
export async function notify({user,type,title,message,entityType,entityId}){
  const notification=await Notification.create({user,type,title,message,entityType,entityId})
  realtime.emit('notification',{userId:String(user),notification:notification.toObject()})
  return notification
}
