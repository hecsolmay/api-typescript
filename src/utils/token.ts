import jwt from 'jsonwebtoken'
import { secret, expires, refreshSecret, refreshExpired } from '../config'

interface TokenInfo {
  id: string
}

export const tokenSign = (data: TokenInfo) => jwt.sign(data, secret, { expiresIn: expires })

export const tokenVerify = (token: string) => jwt.verify(token, secret) as TokenInfo

export const tokenRefreshSign = (data: TokenInfo) => jwt.sign(data, refreshSecret, { expiresIn: refreshExpired })

export const verifyRefresh = (token: string) => jwt.verify(token, refreshSecret) as TokenInfo
