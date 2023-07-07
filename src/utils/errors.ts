import { type Response } from 'express'

export class ValidationRequestError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export function handleError (error: unknown, res: Response): Response<any, Record<string, any>> {
  console.error(error)

  if (error instanceof ValidationRequestError) {
    return res.status(400).json({ message: 'Bad Request', error: error.message })
  }

  if (error instanceof Error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message })
  }

  return res.status(500).json({ message: 'Internal Server Error' })
}
