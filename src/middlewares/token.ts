import { type NextFunction, type Request, type Response } from 'express'
import { getUserById } from '../services/users'
import { type RequestWithUser } from '../types'
import { handleError } from '../utils/errors'
import { tokenVerify, verifyRefresh } from '../utils/token'

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = (authHeader != null) ? authHeader.split(' ')[1] : null

    if (token == null) {
      return res.sendStatus(401)
    }

    const verify = tokenVerify(token)

    const user = await getUserById(verify.id)

    if (user === null) {
      return res.sendStatus(400)
    }

    (req as RequestWithUser).user = user

    if (user.rol !== undefined) {
      (req as RequestWithUser).rol = user.rol
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  } catch (error) {
    return handleError(error, res)
  }
}

export const authenticateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.headers['x-refresh-token']

    if (refreshToken === undefined) {
      return res.sendStatus(401)
    }

    const refreshTokenString = Array.isArray(refreshToken) ? refreshToken[0] : refreshToken
    const verify = verifyRefresh(refreshTokenString)

    const user = await getUserById(verify.id)

    if (user === null) {
      return res.sendStatus(400)
    }

    if (user.rememberToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid Remember Token', error: 'Forbidden' })
    }

    (req as RequestWithUser).user = user

    if (user.rol !== undefined) {
      (req as RequestWithUser).rol = user.rol
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  } catch (error) {
    return handleError(error, res)
  }
}
