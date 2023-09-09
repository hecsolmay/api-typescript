import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import path from 'path'

import authRoutes from './routes/auth.routes'
import objectiveRoutes from './routes/objective.routes'
import userRoutes from './routes/user.routes'
import testRoutes from './routes/test.routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api', (_req, res) => {
  res.send('Hola Mundo')
})

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/objective', objectiveRoutes)
app.use('/api/test', testRoutes)
app.use('/api/public', express.static(path.join(__dirname, '../public/uploads')))

export default app
