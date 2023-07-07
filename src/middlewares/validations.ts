import { type Request, type Response, type NextFunction } from 'express'

export const validate = (params: string[]) => {
  const middleware = (req: Request, res: Response, next: NextFunction) => {
    for (let i = 0; i < params.length; i++) {
      const param = params[i]

      if (!(param in req.body)) {
        return res.status(400).json({ message: `Bad Request field ${param} required` })
      }
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  }

  return middleware
}
