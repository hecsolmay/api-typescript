import { DataTypes, type ModelStatic } from 'sequelize'
import { sequelize } from '../database'
import { type ObjectiveModel } from './types.d'

const Objective: ModelStatic<ObjectiveModel> = sequelize.define<ObjectiveModel>('objectives', {
  objectiveId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'objective_id'
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  paranoid: true
})

export default Objective
