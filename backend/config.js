import 'dotenv/config'

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/via_transport',
  jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'via-local-development-secret-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(x => x.trim()),
}

if (!config.jwtSecret) throw new Error('JWT_SECRET es obligatorio en producción.')
