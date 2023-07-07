import { DataTypes, type ModelStatic } from 'sequelize'
import { sequelize } from '../database'
import { EMAIL_STATUS } from '../enums'
import { type TestQuestionModel, type PracticeQuestionModel, type TestUserModel } from './types.d'

export const PracticeQuestion: ModelStatic<PracticeQuestionModel> = sequelize.define<PracticeQuestionModel>('practices_questions', {
  practiceQuestionId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'practice_question_id'
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  paranoid: true
})

export const TestQuestion: ModelStatic<TestQuestionModel> = sequelize.define<TestQuestionModel>('test_questions', {
  testQuestionId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'test_question_id'
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  paranoid: true
})

export const TestUsers: ModelStatic<TestUserModel> = sequelize.define<TestUserModel>('test_users', {
  testUserId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'test_user_id'
  },
  emailStatus: {
    type: DataTypes.ENUM(EMAIL_STATUS.SEND, EMAIL_STATUS.PENDING),
    defaultValue: EMAIL_STATUS.PENDING
  }
}, {
  freezeTableName: true,
  paranoid: true
})
