import { DataTypes, type ModelStatic } from 'sequelize'
import { sequelize } from '../database'
import { TEST_STATUS } from '../enums'
import { type TestModel } from './types.d'

const Test: ModelStatic<TestModel> = sequelize.define<TestModel>('tests', {
  testId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'test_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  SOA: {
    type: DataTypes.INTEGER({ length: 11 }),
    allowNull: false
  },
  ISI: {
    type: DataTypes.INTEGER({ length: 11 }),
    allowNull: false
  },
  questionQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'question_quantity'
  },
  dateStart: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'date_start'
  },
  dateEnd: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'date_end'
  },
  isRandom: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'is_random',
    defaultValue: false
  },
  pause: {
    type: DataTypes.INTEGER
  },
  status: {
    type: DataTypes.VIRTUAL,
    get () {
      const currentDate = new Date()
      const startDate = this.getDataValue('dateStart')
      const endDate = this.getDataValue('dateEnd')

      if (endDate < currentDate) {
        return TEST_STATUS.COMPLETE
      } else if (currentDate < startDate) {
        return TEST_STATUS.TOSTART
      } else if (startDate <= currentDate && currentDate <= endDate) {
        return TEST_STATUS.ONGOING
      } else {
        return null
      }
    }
  }
}, {
  freezeTableName: true,
  paranoid: true
})

export default Test
