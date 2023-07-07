import { type Request, type Response } from 'express'
import nodemailer from 'nodemailer'

import { mailerEmail, mailerPassword } from '../config'
import * as services from '../services/users'
import { handleError } from '../utils/errors'
import { generatePassword, mailGenerator } from '../utils/generators'
import { toNewUser, toSignInFields } from '../utils/newEntries'
import { tokenRefreshSign, tokenSign } from '../utils/token'
import { parseString } from '../utils/parse'
import { type RequestWithUser } from '../types'

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
    const email = parseString(req.body.email)
    const user = await services.searchUser(email.toLowerCase().trim())

    if (user === null) {
      return res.status(404).json({ message: 'User Not Found' })
    }

    const newPassword = generatePassword()

    await user.update({ password: newPassword })

    // ** Transporter para IONOS

    const transporter = nodemailer.createTransport({
      host: 'smtp.ionos.com',
      port: 587,
      secure: false,
      auth: {
        user: mailerEmail,
        pass: mailerPassword
      }
    })

    const mail = mailGenerator({ password: newPassword, username: user.fullname })

    const mailOptions = {
      from: mailerEmail,
      to: email,
      subject: 'Restauración de contraseña',
      html: mail
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error != null) {
        console.error(error)
        return res.status(500).json({ message: 'Error al enviar el correo electrónico', error: error.message })
      } else {
        return res.json({ message: 'Correo electrónico enviado: ', info: info.response })
      }
    })

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
