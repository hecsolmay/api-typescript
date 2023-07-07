import { Sequelize } from 'sequelize'
import { database, user, password, host } from '../config'

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'production' ? false : console.log
})

async function startConnection (): Promise<void> {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: false, alter: true })
    require('./createTables')
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export {
  sequelize,
  startConnection
}
