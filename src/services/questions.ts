import { PracticeQuestion, TestQuestion } from '../models/UnionTables'
import { type QuestionCreateDTO } from '../types'

export const createTestQuestion = async (index: number, question: QuestionCreateDTO, testId: string) => {
  const { stimulusId, objectiveId } = question

  const newQuestion = {
    testId,
    order: index,
    stimulusId,
    objectiveId
  }

  await (await TestQuestion.create(newQuestion)).save()
}

export const createPracticeQuestion = async (index: number, question: QuestionCreateDTO, practiceId: string) => {
  const { stimulusId, objectiveId } = question

  const newQuestion = {
    practiceId,
    order: index,
    stimulusId,
    objectiveId
  }

  await (await PracticeQuestion.create(newQuestion)).save()
}

export const clearTestQuestions = async (testId: string) => {
  await TestQuestion.destroy({ where: { testId }, force: true })
}

export const clearPracticeQuestions = async (practiceId: string) => {
  await PracticeQuestion.destroy({ where: { practiceId } })
}
