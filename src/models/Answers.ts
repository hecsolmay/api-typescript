import { DataTypes, type ModelStatic } from 'sequelize'
import { sequelize } from '../database'
import { type PracticeAnswerModel, type TestAnswerModel } from './types.d'

export const TestAnswer: ModelStatic<TestAnswerModel> = sequelize.define<TestAnswerModel>('test_answers', {
  answerId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'answer_id'
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  paranoid: true
})

export const PracticeAnswer: ModelStatic<PracticeAnswerModel> = sequelize.define<PracticeAnswerModel>('practice_answers', {
  answerId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'answer_id'
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  paranoid: true
})
