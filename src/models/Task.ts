import { DataTypes, type ModelStatic } from 'sequelize'
import { sequelize } from '../database'
import { type TaskModel } from './types.d'

const Task: ModelStatic<TaskModel> = sequelize.define<TaskModel>('task', {
  taskId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'task_id'
  },
  fn: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    get () {
      return new Date(Date.parse(this.getDataValue('date')))
    }
  }
}, {
  freezeTableName: true
})

export default Task
