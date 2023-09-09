import { EMAIL_STATUS } from '../enums'
import { TestUsers } from '../models/UnionTables'
import User from '../models/Users'
import { type UserModel } from '../models/types.d'
import { type TestUserCreateDTO } from '../types'
import { generateInvitationEmail, generateReAsignationEmail } from '../utils/generators'
import { cancelTask } from '../utils/schedule'
import { sendReasignationEmail, sendScheduledMail } from './mail'

export const checkTestUsers = async (testId: string, users: TestUserCreateDTO[], dateToStart = new Date(), isChangeDate = false) => {
  const origalUsers = await TestUsers.findAll({
    attributes: {
      exclude: ['deletedAt', 'testId', 'updatedAt', 'createdAt']
    },
    include: {
      model: User,
      attributes: {
        exclude: ['password', 'typeId', 'rememberToken', 'deletedAt']
      },
      paranoid: true
    },
    where: { testId },
    paranoid: true
  })

  const existendUsers = origalUsers.filter((user) => {
    return users.some((reqUser) => reqUser.userId === user.userId)
  })

  const newTestUsers = users.filter((reqUser) => {
    return !origalUsers.some((user) => user.userId === reqUser.userId)
  })

  const usersToDelete = origalUsers.filter((user) => {
    return !users.some((reqUser) => reqUser.userId === user.userId)
  })

  for (let i = 0; i < usersToDelete.length; i++) {
    const user = usersToDelete[i]
    await deleteTestUser(user.testUserId ?? '')
  }

  if (isChangeDate) {
    for (let i = 0; i < existendUsers.length; i++) {
      const existendUser = existendUsers[i]
      const userId = existendUser.userId
      console.log(existendUser)
      const user = await User.findByPk(userId)
      updatePrevTestUser({ testId, dateToStart, user, testUserId: existendUser.testUserId ?? '', emailStatus: existendUser.emailStatus })
    }
  }

  for (let i = 0; i < newTestUsers.length; i++) {
    const userId = newTestUsers[i].userId
    const user = await User.findByPk(userId)

    if (user !== null) {
      const currentDate = new Date()
      const oneDayBeforeDate = new Date(dateToStart)

      if (currentDate < oneDayBeforeDate) {
        await createTestUser(testId, user, dateToStart, EMAIL_STATUS.PENDING)
      } else {
        await createTestUser(testId, user, dateToStart, EMAIL_STATUS.SEND)
      }
    }
  }
}

export const updateEmailStatusUser = async (testUserId: string, emailStatus: EMAIL_STATUS) => {
  await TestUsers.update({ emailStatus }, { where: { testUserId } })
}

export const deleteTestUser = async (testUserId: string) => {
  cancelTask(testUserId)
  await TestUsers.destroy({ where: { testUserId } })
}

export const createTestUser = async (testId: string, user: UserModel, date = new Date(), emailStatus = EMAIL_STATUS.PENDING) => {
  const userCreate = await TestUsers.create({ userId: user.userId, testId, emailStatus })
  await userCreate.save()
  const mail = generateInvitationEmail({
    email: user.email,
    userName: user.fullname ?? user.email,
    testId,
    dateToStart: date
  })

  sendScheduledMail({
    to: user.email,
    mail,
    taskId: userCreate.testUserId ?? '',
    date
  })
}

interface UpdatePrevTestUserProps {
  testId: string
  dateToStart: Date
  testUserId: string
  user: UserModel | null
  emailStatus: EMAIL_STATUS
}

export const updatePrevTestUser = ({ testId, dateToStart = new Date(), user, testUserId, emailStatus = EMAIL_STATUS.PENDING }: UpdatePrevTestUserProps) => {
  if (user === null) return
  console.log(user)

  if (emailStatus === EMAIL_STATUS.PENDING) {
    const mail = generateInvitationEmail({ email: user.email, userName: user.fullname ?? user.email, testId, dateToStart })

    sendScheduledMail({
      to: user.email,
      mail,
      taskId: testUserId,
      date: dateToStart
    })
    return
  }

  const mail = generateReAsignationEmail({ email: user.email, userName: user.fullname ?? user.email, testId, dateToStart })

  sendReasignationEmail({
    to: user.email,
    mail,
    taskId: testUserId
  })
}
