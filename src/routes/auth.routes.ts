import { Router } from 'express'
import * as AuthController from '../controllers/auth.controller'
import { authenticateRefreshToken } from '../middlewares/token'
import { validate } from '../middlewares/validations'
import { checkDuplicateEmail } from '../middlewares/verify'

const signInFields = ['email', 'password']
const singUpFields = ['name', 'lastname', 'email', 'password']
const restorePasswordFields = ['email']

const router = Router()

router.post('/signin', [validate(signInFields)], AuthController.signIn)
router.post('/signup', [validate(singUpFields), checkDuplicateEmail], AuthController.singUp)
router.post('/restore-password', [validate(restorePasswordFields)], AuthController.restorePassword)
router.post('/refresh-token', [authenticateRefreshToken], AuthController.refreshToken)

export default router
