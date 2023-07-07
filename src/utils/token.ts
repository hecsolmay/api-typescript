import jwt from 'jsonwebtoken'
import { secret, expires, refreshSecret, refreshExpired } from '../config'

export const tokenSign = (data: any) => jwt.sign(data, secret, { expiresIn: expires })

export const tokenVerify = (token: string) => jwt.verify(token, secret)

export const tokenRefreshSign = (data: any) => jwt.sign(data, refreshSecret, { expiresIn: refreshExpired })

export const verifyRefresh = (token: string) => jwt.verify(token, refreshSecret)
