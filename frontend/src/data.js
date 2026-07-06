export const employees = [
  ['E-1042','Mariela Santos','MS','Servicio al cliente','Camilo Peña','14:00–22:30','22:30','Santo Domingo Este','confirmed','R-03','BUS-18'],
  ['E-1187','Joel Matos','JM','Operaciones','Camilo Peña','13:00–21:30','21:30','Los Alcarrizos','confirmed','R-01','BUS-07'],
  ['E-1204','Noelia Rosario','NR','Calidad','Iris Valdez','12:00–20:30','20:30','Gazcue','ineligible','—','—'],
  ['E-1268','Adrián Lora','AL','Finanzas','Iris Valdez','15:00–23:00','23:00','Santo Domingo Norte','pending','R-02','BUS-12'],
  ['E-1311','Kiara Báez','KB','Servicio al cliente','Camilo Peña','14:00–22:30','22:30','Santo Domingo Este','confirmed','R-03','BUS-18'],
  ['E-1390','Rafael Encarnación','RE','Tecnología','Iris Valdez','09:00–18:00','18:00','Piantini','ineligible','—','—'],
  ['E-1422','Lisandra Cuevas','LC','Operaciones','Camilo Peña','16:00–00:30','00:30','Los Alcarrizos','exception','R-01','BUS-07'],
].map(([id,name,initials,dept,supervisor,shift,exit,zone,status,route,bus])=>({id,name,initials,dept,supervisor,shift,exit,zone,status,route,bus}))

export const routes = [
  {id:'R-01',name:'Corredor Oeste',zone:'Los Alcarrizos · Herrera',bus:'BUS-07',driver:'Víctor Polanco',capacity:30,passengers:26,departure:'21:45',eta:'52 min',status:'ready'},
  {id:'R-02',name:'Corredor Norte',zone:'Villa Mella · Sabana Perdida',bus:'BUS-12',driver:'Elena Frías',capacity:24,passengers:19,departure:'23:15',eta:'46 min',status:'ready'},
  {id:'R-03',name:'Corredor Este',zone:'Alma Rosa · Los Mameyes',bus:'BUS-18',driver:'Bruno Tavárez',capacity:32,passengers:29,departure:'22:45',eta:'58 min',status:'draft'},
]

export const audit = [
  ['14:32','Workforce importó 148 horarios','Archivo turnos_04_jul.csv'],
  ['14:34','Motor recalculó elegibilidad','96 elegibles · 52 fuera de política'],
  ['15:06','Camilo Peña aprobó overtime','Lisandra Cuevas · salida 00:30'],
  ['15:18','Operaciones ajustó la ruta R-03','BUS-18 · +3 pasajeros'],
].map(([time,text,detail])=>({time,text,detail}))
