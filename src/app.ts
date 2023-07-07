import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'

import authRoutes from './routes/auth.routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api', (_req, res) => {
  res.send('Hola Mundo')
})

app.use('/api/auth', authRoutes)
app.use('/api/public', express.static(path.join(__dirname, '../public/uploads')))

export default app
