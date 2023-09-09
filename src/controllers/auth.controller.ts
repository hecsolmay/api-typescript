import { type Request, type Response } from 'express'

import { sendMail } from '../services/mail'
import * as services from '../services/users'
import { type RequestWithUser } from '../types'
import { handleError } from '../utils/errors'
import { generatePassword, mailGenerator } from '../utils/generators'
import { toNewUser, toSignInFields } from '../utils/newEntries'
import { parseEmail } from '../utils/parse'
import { tokenRefreshSign, tokenSign } from '../utils/token'

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = toSignInFields(req.body)

    const user = await services.searchUser(email)

    if (user === null) {
      return res.status(404).json({ message: 'User Not Found' })
    }

    const isCorrectPassword = await user.validPassword(password ?? '')

    if (!isCorrectPassword) {
      return res.status(404).json({ message: 'Passwords not Matched' })
    }

    const refreshToken = tokenRefreshSign({ id: user.userId ?? '' })

    await user.update({ rememberToken: refreshToken })

    delete user.dataValues.password

    const token = tokenSign({ id: user.userId ?? '' })

    return res.json({ user, token })
  } catch (error) {
    return handleError(error, res)
  }
}

export const singUp = async (req: Request, res: Response) => {
  try {
    const newUser = toNewUser(req.body)
    const user = await services.createUser(newUser)

    return res.status(201).json({ message: 'User registered', user })
  } catch (error) {
    return handleError(error, res)
  }
}

export const restorePassword = async (req: Request, res: Response) => {
  try {
    const email = parseEmail(req.body.email)
    const user = await services.searchUser(email.toLowerCase().trim())

    if (user === null) {
      return res.status(404).json({ message: 'User Not Found' })
    }

    const newPassword = generatePassword()

    await user.update({ password: '1234' })

    const mail = mailGenerator({ password: newPassword, username: user.fullname })

    sendMail(res, email, mail, 'Restauración de contraseña')

    return null
  } catch (error) {
    return handleError(error, res)
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { user } = (req as RequestWithUser)

    const token = tokenSign({ id: user.userId ?? '' })

    return res.json({ message: 'Token refreshed', token })
  } catch (error) {
    return handleError(error, res)
  }
}
