import { Op } from 'sequelize'
import { UserTypes } from '../models/Types'
import { TestUsers } from '../models/UnionTables'
import User from '../models/Users'

import { type CreateUserDTO, type UserQueryWithPagination, type UserUpdateDTO } from '../types'
import { ValidationRequestError } from '../utils/errors'
import { getInfoPage } from '../utils/pagination'

export const getAllUsers = async (query: UserQueryWithPagination, noDeleted?: boolean) => {
  const { getDeleted, limit, offset, page, q } = query

  const getDeletedUsers = noDeleted !== undefined ? noDeleted : getDeleted

  const excludeAttributes = ['password', 'typeId', 'rememberToken']

  if (!getDeletedUsers) {
    excludeAttributes.push('deletedAt')
  }

  const { count, rows } = await User.findAndCountAll({
    attributes: {
      exclude: excludeAttributes
    },
    include: {
      model: UserTypes,
      as: 'rol',
      attributes: ['name', 'typeId']
    },

    limit,
    offset,

    where: {
      [Op.or]: [
        { fullname: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } }
      ]
    },
    order: [
      ['createdAt', 'DESC'],
      ['user_id', 'DESC']
    ],
    paranoid: !getDeletedUsers
  })

  const info = getInfoPage({ limit, count, currentPage: page })

  return { users: rows, info }
}

export const getExperimentUsers = async (testId?: string) => {
  const users = await TestUsers.findAll({
    attributes: {
      exclude: ['deletedAt', 'testId', 'userId']
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

  return users
}

export const searchUser = async (email?: string) => {
  const user = await User.findOne({
    attributes: {
      exclude: ['typeId']
    },
    where: { email },
    include: {
      model: UserTypes,
      as: 'rol',
      attributes: ['name', 'typeId']
    }
  })

  return user
}

export const getUserById = async (id?: string) => {
  const user = await User.findByPk(id, {
    attributes: {
      exclude: ['typeId']
    },
    include: {
      model: UserTypes,
      as: 'rol',
      attributes: ['name', 'typeId']
    }
  })
  return user
}

export const createUser = async (userToCreate: CreateUserDTO) => {
  const { rol = 'user', ...restOfUser } = userToCreate

  const foundRole = await UserTypes.findOne({ where: { name: rol } })

  if (foundRole === null) {
    throw new ValidationRequestError('Invalid Rol')
  }

  const newUser = {
    ...restOfUser,
    typeId: foundRole.dataValues.typeId
  }

  const user = await User.create(newUser)
  const userCreated = await user.save()

  return userCreated
}

export const updateUser = async (id: string, userFieldsDTO: UserUpdateDTO) => {
  const { rol = 'user', ...restOfUser } = userFieldsDTO
  const foundRole = await UserTypes.findOne({ where: { name: rol } })

  if (foundRole === null) {
    throw new ValidationRequestError('Invalid Rol')
  }

  const updatedUserFields = {
    ...restOfUser,
    typeId: foundRole.dataValues.typeId
  }

  console.log(updatedUserFields)

  const updatedUser = await User.update(updatedUserFields, { where: { userId: id }, individualHooks: true })

  return updatedUser
}

export const deleteUser = async (id: string) => {
  const deletedUser = await User.destroy({ where: { userId: id } })

  if (deletedUser === 0) return null

  return deletedUser
}

export const restoreUser = async (id: string) => {
  const user = await User.findByPk(id, { paranoid: false })

  if (user === null) return null

  await user.restore()

  return user
}
