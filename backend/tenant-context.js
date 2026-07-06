import {AsyncLocalStorage} from 'node:async_hooks'
export const tenantStorage=new AsyncLocalStorage()
export const tenantId=()=>tenantStorage.getStore()?.tenantId
export const withTenant=(id,fn)=>tenantStorage.run({tenantId:id},fn)
export function tenantPlugin(schema){schema.pre(/^find/,function(){const id=tenantId();if(id)this.where({tenant:id})});schema.pre(['updateOne','updateMany','findOneAndUpdate','deleteOne','deleteMany','countDocuments'],function(){const id=tenantId();if(id)this.where({tenant:id})});schema.pre('validate',function(next){const id=tenantId();if(id&&!this.tenant)this.tenant=id;next()});schema.pre('aggregate',function(){const id=tenantId();if(id)this.pipeline().unshift({$match:{tenant:this.model.base.Types.ObjectId.createFromHexString(String(id))}})})}
