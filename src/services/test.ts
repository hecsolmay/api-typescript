import { literal } from 'sequelize'
import Practice from '../models/Practice'
import Test from '../models/Tests'
import { TestTypes } from '../models/Types'
import { TestUsers } from '../models/UnionTables'
import User from '../models/Users'
import { type TestCommonCreateDTO, type TestCreateDTO, type TestUpdateDTO } from '../types'
import { ValidationRequestError } from '../utils/errors'
import { getUnionPracticeQuestion, getUnionTestQuestion } from '../utils/joinsRelations'
import { toNewCommonTest } from '../utils/newEntries'
import { getInfoPage } from '../utils/pagination'
import { getTestQueryWithPagination } from '../utils/requestQuery'
import { clearPracticeQuestions, clearTestQuestions, createPracticeQuestion, createTestQuestion } from './questions'
import { checkTestUsers } from './testUsers'

export const getTests = async (query: any, getDeleted = false) => {
  const { limit, offset, page, ...params } = getTestQueryWithPagination(query)
  const excludeFieldsTest = ['experimenterId', 'testTypeId']

  if (!getDeleted) {
    excludeFieldsTest.push('deletedAt')
  }

  const { count, rows } = await Test.findAndCountAll({
    attributes: {
      exclude: excludeFieldsTest,
      include: [
        [
          literal('(SELECT COUNT(*) FROM test_users WHERE test_users.test_id = tests.test_id)'),
          'users'
        ]
      ]
    },
    include: [
      {
        model: TestTypes,
        as: 'type',
        attributes: ['name', 'testTypeId']
      },
      {
        model: Practice,
        as: 'practice'
      },
      {
        model: User,
        as: 'experimenter',
        attributes: {
          exclude: ['password', 'rememberToken', 'createdAt', 'updatedAt', 'deletedAt', 'typeId']
        }
      }
    ],
    limit,
    offset,
    order: [
      ['createdAt', 'DESC'],
      ['testId', 'DESC']
    ],
    paranoid: !getDeleted,
    where: params
  })

  const info = getInfoPage({ limit, count, currentPage: page })

  return { test: rows, info }
}

export const getTestById = async (id: string) => {
  const joinPracticeQuestion = getUnionPracticeQuestion()
  const joinTestQuestion = getUnionTestQuestion()

  const test = await Test.findByPk(id, {
    attributes: {
      exclude: ['experimenterId', 'testTypeId'],
      include: [
        [
          literal('(SELECT COUNT(*) FROM test_users WHERE test_users.test_id = tests.test_id)'),
          'users'
        ]
      ]
    },
    include: [
      {
        model: TestTypes,
        as: 'type',
        attributes: ['name', 'testTypeId']
      },
      {
        model: Practice,
        as: 'practice',
        attributes: {
          exclude: ['createdAt', 'deletedAt', 'updatedAt', 'testTypeId', 'testId']
        },
        include: joinPracticeQuestion
      },
      {
        model: User,
        as: 'experimenter',
        attributes: {
          exclude: ['password', 'rememberToken', 'createdAt', 'updatedAt', 'deletedAt', 'typeId']
        }
      },
      joinTestQuestion
    ]
  }
  )

  if (test === null) {
    return { test: null, users: null }
  }

  const users = await TestUsers.findAll({
    attributes: {
      exclude: ['deletedAt', 'testId', 'updatedAt', 'createdAt']
    },
    where: { testId: id },
    paranoid: true
  })

  return { test, users }
}

// export const getTestGameById = async (id: string) => {
//   const originalTest = await Test.findByPk(id, {
//     include: { model: Practice, as: 'practice' }
//   })

//   if (originalTest === null) return null

//   const isRandom = originalTest.isRandom ?? false
//   const isPracticeRandom = originalTest?.practice[0]?.isRandom ?? false

//   const test = await Test.findByPk(id, {
//     // separate: true,
//     attributes: {
//       exclude: ['experimenterId', 'testTypeId'],
//       include: [
//         [
//           literal('(SELECT COUNT(*) FROM test_users WHERE test_users.test_id = tests.test_id)'),
//           'users'
//         ]
//       ]
//     },
//     include: [
//       {
//         model: TestTypes,
//         as: 'type',
//         attributes: ['name', 'testTypeId']
//       },
//       getUnionTestQuestion(isRandom),
//       {
//         model: Practice,
//         as: 'practice',
//         attributes: {
//           exclude: ['createdAt', 'deletedAt', 'updatedAt', 'testTypeId', 'testId']
//         },
//         include: getUnionPracticeQuestion(isPracticeRandom)
//       }
//     ]
//   }
//   )

//   if (test === null) {
//     return test
//   }

// //   const practice = test.practice.length === 0 ? null : test.practice[0]
// //   test.setDataValue('practice', practice)

// //   if (test.questions?.length !== 0) {
// //     const newQuestions = getFormatedQuestion(test.questions)

// //     test.questions = newQuestions
// //   }

// //   if (test.practice !== null) {
// //     const practice = test.practice[0]
// //     const questions = practice?.dataValues?.questions ?? []
// //     if (questions?.length !== 0) {
// //       const newQuestions = getFormatedQuestion(questions)

// //       test.practice[0].questions = newQuestions
// //     }
// //   }

//   return test
// }

export const createTest = async (test: TestCreateDTO, experimenterId: string) => {
  const testType = await TestTypes.findOne({ where: { name: 'test' } })

  if (testType === null) {
    throw new ValidationRequestError('Something went wrong')
  }

  const { practice, questions, users, ...restTest } = test

  const newTest = { ...restTest, testTypeId: testType.testTypeId, experimenterId }

  const testCreated = await (await Test.create(newTest)).save()

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i]
    await createTestQuestion(i, question, testCreated.testId ?? '')
  }

  if (practice !== undefined) {
    await createPractice(practice, testCreated.testId ?? '')
  }

  if (users !== undefined && users.length !== 0) {
    await checkTestUsers(testCreated.testId ?? '', users, newTest.dateStart)
  }

  return testCreated
}

export const createPractice = async (practice: TestCommonCreateDTO, testId: string) => {
  const { questions, ...restOfPractice } = practice

  const practiceType = await TestTypes.findOne({ where: { name: 'practice' } })

  if (practiceType === null) {
    throw new ValidationRequestError('something went wrong in the asignation of practice type')
  }

  const newPractice = {
    testId,
    ...restOfPractice,
    testTypeId: practiceType.testTypeId
  }

  const practiceCreated = await (await Practice.create(newPractice)).save()

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i]
    await createPracticeQuestion(i, question, practiceCreated.practiceId ?? '')
  }

  return newPractice
}

export const deletedById = async (id: string) => {
  const deletedTest = await Test.destroy({ where: { testId: id } })

  if (deletedTest === 0) return null

  return deletedTest
}

export const updateById = async (id: string, updatedTest: TestUpdateDTO, experimenterId: string) => {
  const { users, practice, questions, ...restOfUpdate } = updatedTest

  const newTest = {
    ...restOfUpdate,
    experimenterId
  }

  const previousTest = await Test.findByPk(id)

  if (previousTest == null) return null

  const [testUpdated] = await Test.update(newTest, { where: { testId: id } })

  if (testUpdated === 0) return null

  await clearTestQuestions(id)

  if (questions !== undefined) {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      await createTestQuestion(i, question, id)
    }
  }

  if (practice != null) {
    await updatePractice(practice, id)
  }

  if (users !== undefined && users.length !== 0) {
    const prevDate = new Date(previousTest.dateStart)
    const newDate = newTest.dateStart ?? new Date(previousTest.dateStart)
    await checkTestUsers(id, users, newDate, prevDate !== newDate)
  }

  return testUpdated
}

export const updatePractice = async (newPractice: Partial<TestCommonCreateDTO>, testId: string) => {
  const { questions, ...restOfNewPractice } = newPractice

  const practice = {
    testId,
    ...restOfNewPractice
  }

  const foundPractice = await Practice.findOne({ where: { testId } })

  if (foundPractice === null) {
    const newPracticeDTO = toNewCommonTest(practice)
    const createdPractice = await createPractice(newPracticeDTO, testId)

    return createdPractice
  }

  const updatedPractice = await Practice.update(practice, { where: { practiceId: foundPractice.practiceId } })
  await clearPracticeQuestions(foundPractice.practiceId ?? '')

  if (questions !== undefined) {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      await createPracticeQuestion(i, question, foundPractice.practiceId ?? '')
    }
  }

  return updatedPractice
}

export const restoreById = async (id: string) => {
  const originalTest = await Test.findByPk(id, { paranoid: false })

  if (originalTest === null) return null

  await originalTest.restore()

  return originalTest
}
