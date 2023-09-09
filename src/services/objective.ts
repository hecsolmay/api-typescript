
import { Op } from 'sequelize'
import Objective from '../models/Objective'
import { ContentTypes } from '../models/Types'
import { type ObjectiveCreateDTO, type ObjectiveQueryWithPagination, type ObjectiveUpdateDTO } from '../types'
import { ValidationRequestError } from '../utils/errors'
import { getInfoPage } from '../utils/pagination'

export const getObjectives = async (query: ObjectiveQueryWithPagination, getDeleted = false) => {
  const { label, limit, offset, page } = query

  const excludeAttributes = ['contentTypeId']

  if (!getDeleted) {
    excludeAttributes.push('deletedAt')
  }

  const { count, rows } = await Objective.findAndCountAll({
    attributes: {
      exclude: excludeAttributes
    },
    include: {
      model: ContentTypes,
      as: 'contentType',
      attributes: ['name', 'contentTypeId']
    },
    limit,
    offset,

    where: {
      [Op.or]: [
        { label: { [Op.like]: `%${label}%` } }
      ]
    },
    order: [
      ['createdAt', 'DESC'],
      ['objective_id', 'DESC']
    ],
    paranoid: !getDeleted

  })

  const info = getInfoPage({ limit, count, currentPage: page })

  return { objectives: rows, info }
}

export const getObjective = async (id: string) => {
  const objective = await Objective.findByPk(id, {
    attributes: {
      exclude: ['contentTypeId']
    },
    include: {
      model: ContentTypes,
      as: 'contentType',
      attributes: ['name', 'contentTypeId']
    }
  })

  return objective
}

export const createObjective = async (objective: ObjectiveCreateDTO) => {
  const { label, content, contentType = 'text' } = objective

  const foundContent = await ContentTypes.findOne({ where: { name: contentType.toLowerCase().trim() } })

  if (foundContent === null) {
    throw new ValidationRequestError('Invalid Content Type')
  }

  const { contentTypeId } = foundContent.dataValues

  if (contentTypeId === undefined) {
    throw new ValidationRequestError('Invalid Content Type')
  }

  const newStimulus = {
    label: label.toUpperCase().trim(),
    content,
    contentTypeId
  }

  const stimulus = await Objective.create(newStimulus)
  const objectiveCreated = await stimulus.save()

  return objectiveCreated
}

export const deleteObjective = async (id: string) => {
  const deletedObjective = await Objective.destroy({ where: { objectiveId: id } })

  if (deletedObjective === 0) return null

  return deletedObjective
}

export const restoreObjective = async (id: string) => {
  const objective = await Objective.findByPk(id, { paranoid: false })
  if (objective === null) return null

  await objective.restore()

  return objective
}

export const updateObjective = async (id: string, newObject: ObjectiveUpdateDTO) => {
  const { contentType, ...restOfObjective } = newObject

  const foundContent = await ContentTypes.findOne({ where: { name: contentType?.toLowerCase().trim() } })

  if (foundContent === null) {
    throw new ValidationRequestError('Invalid or missing ContentType')
  }

  const { contentTypeId } = foundContent.dataValues

  const newObjective = {
    ...restOfObjective,
    contentTypeId
  }

  const [updatedObjective] = await Objective.update(newObjective, {
    where: {
      objectiveId: id
    }
  })

  if (updatedObjective === 0) return null

  return updatedObjective
}
