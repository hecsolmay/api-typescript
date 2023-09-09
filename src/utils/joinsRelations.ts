import { type Includeable, literal } from 'sequelize'
import { TestQuestion, PracticeQuestion } from '../models/UnionTables'
import Objective from '../models/Objective'
import { ContentTypes } from '../models/Types'

const includeQuestion: Includeable[] | undefined = [
  {
    model: Objective,
    as: 'stimulus',
    attributes: {
      exclude: ['contentTypeId', 'createdAt', 'deletedAt', 'updatedAt']
    },
    include: [{
      model: ContentTypes,
      as: 'contentType',
      attributes: ['name', 'contentTypeId']
    }]
  },
  {
    model: Objective,
    as: 'objective',
    attributes: {
      exclude: ['contentTypeId', 'createdAt', 'deletedAt', 'updatedAt']
    },
    include: [{
      model: ContentTypes,
      as: 'contentType',
      attributes: ['name', 'contentTypeId']
    }]
  }
]

export function getUnionTestQuestion (isRandom = false): Includeable {
  return {
    model: TestQuestion,
    as: 'questions',
    attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt', 'testId', 'objectiveId', 'stimulusId'] },
    order: isRandom ? literal('rand()') : [['order', 'ASC']],
    separate: true,
    include: includeQuestion
  }
}

export function getUnionPracticeQuestion (isRandom = false): Includeable[] {
  return [{
    model: PracticeQuestion,
    order: isRandom ? literal('rand()') : [['order', 'ASC']],
    separate: true,
    attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt', 'testId', 'objectiveId', 'stimulusId', 'practiceId'] },
    as: 'questions',
    include: includeQuestion
  }]
}
