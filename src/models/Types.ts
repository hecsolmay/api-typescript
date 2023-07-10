import { DataTypes, type ModelStatic } from 'sequelize'
import { sequelize } from '../database'
import { type ContentTypesModel, type TestTypesModel, type UserTypesModel } from './types.d'

export const UserTypes: ModelStatic<UserTypesModel> = sequelize?.define<UserTypesModel>('user_types', {
  typeId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'type_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  paranoid: true
})

export const TestTypes: ModelStatic<TestTypesModel> = sequelize?.define<TestTypesModel>('test_types', {
  testTypeId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'test_type_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  paranoid: true
})

export const ContentTypes: ModelStatic<ContentTypesModel> = sequelize?.define<ContentTypesModel>('content_types', {
  contentTypeId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'content_type_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  paranoid: true
})
