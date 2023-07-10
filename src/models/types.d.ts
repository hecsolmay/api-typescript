
import { type Model } from 'sequelize'
import { type EMAIL_STATUS, type TEST_STATUS } from '../enums'

export interface UserAttributes {
  userId?: string
  name: string
  lastname: string
  fullname: string | null
  email: string
  password?: string
  phoneNumber: string | null
  rememberToken: string | null
  rol?: UserTypesAttributes
}

export interface ImageContent {
  main: string
  preview: string
  thumbnail: string
}

export interface AnswerAttributes {
  answerId?: string
  answer: string
  time: number
  order: number
}

export interface ObjectiveAttributes {
  objectiveId?: string
  label: string
  content: string | ImageContent
  contentType?: ContentTypesAttributes
}

export interface TestCommonAtrributes {
  name: string
  SOA: number
  ISI: number
  questionQuantity: number
  pause: number
  isRandom: boolean
}

export interface PracticeAttributes extends TestCommonAtrributes {
  practiceId?: string
  testId?: string
}

export interface TestAttributes extends TestCommonAtrributes {
  testId?: string
  dateStart: Date
  dateEnd: Date
  status: TEST_STATUS | null
  practice?: PracticeAttributes[] | PracticeAttributes
}

export interface UserTypesAttributes {
  typeId?: string
  name: string
}

export interface TestTypesAttributes {
  testTypeId?: string
  name: string
}

export interface ContentTypesAttributes {
  contentTypeId?: string
  name: string
}

export interface TaskAttributes {
  taskId: string
  fn: string
  date: Date
}

export interface PracticeQuestionAttributes {
  practiceQuestionId?: string
  order: number
  practiceId?: string
}

export interface TestQuestionAttributes {
  testQuestionId?: string
  order: number
  testId?: string
}

export interface TestUserAttributes {
  testUserId?: string
  emailStatus: EMAIL_STATUS
  testId?: string
  userId?: string
}

export interface UserModel extends Model<UserAttributes>, UserAttributes {
  validPassword: (password: string) => Promise<boolean>
}

export interface TestAnswerModel extends Model<AnswerAttributes>, AnswerAttributes {}
export interface PracticeAnswerModel extends Model<AnswerAttributes>, AnswerAttributes {}
export interface ObjectiveModel extends Model<ObjectiveAttributes>, ObjectiveAttributes {}
export interface PracticeModel extends Model<PracticeAttributes>, PracticeAttributes {}
export interface TestModel extends Model<TestAttributes>, TestAttributes {}
export interface TaskModel extends Model<TaskAttributes>, TaskAttributes {}

// Types Models

export interface UserTypesModel extends Model<UserTypesAttributes>, UserTypesAttributes {}
export interface TestTypesModel extends Model<TestTypesAttributes>, TestTypesAttributes {}
export interface ContentTypesModel extends Model< ContentTypesAttributes>, ContentTypesAttributes {}

// Union Tables Models

export interface PracticeQuestionModel extends Model< PracticeQuestionAttributes>, PracticeQuestionAttributes {}
export interface TestQuestionModel extends Model< TestQuestionAttributes>, TestQuestionAttributes {}
export interface TestUserModel extends Model< TestUserAttributes>, TestUserAttributes {}
