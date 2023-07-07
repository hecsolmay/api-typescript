import { DataTypes, type ModelStatic } from 'sequelize'
import { sequelize } from '../database'
import { type PracticeModel } from './types.d'

const Practice: ModelStatic<PracticeModel> = sequelize.define<PracticeModel>('practices', {
  practiceId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'practice_id'
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
    field: 'question_quantity'
  },
  pause: {
    type: DataTypes.INTEGER
  },
  isRandom: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'is_random',
    defaultValue: false
  }
}, {
  freezeTableName: true,
  paranoid: true
})

export default Practice
