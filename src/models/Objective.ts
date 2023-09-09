import { DataTypes, type ModelStatic } from 'sequelize'
import { sequelize } from '../database'
import { type ObjectiveModel } from './types.d'
import { apiUrl } from '../config'
import { FILE_SIZE_NAMES } from '../enums'

const URL_BASE = `${apiUrl}/public`

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
  paranoid: true,
  hooks: {
    afterFind: (results: ObjectiveModel | ObjectiveModel[]) => {
      if (Array.isArray(results)) {
        // Si es un arreglo de resultados
        results.forEach((result) => {
          modifyContent(result)
        })
      } else {
        // Si es un solo resultado
        modifyContent(results)
      }
    }
  }
})

function modifyContent (result: ObjectiveModel) {
  if (result.contentType !== undefined && result.contentType.name === 'image') {
    if (typeof result.content === 'string') {
      result.content = {
        main: `${URL_BASE}/${FILE_SIZE_NAMES.main}-${result.content}`,
        thumbnail: `${URL_BASE}/${FILE_SIZE_NAMES.thumbnail}-${result.content}`,
        preview: `${URL_BASE}/${FILE_SIZE_NAMES.thumbnailPreview}-${result.content}`
      }
    }
  }
}

export default Objective
