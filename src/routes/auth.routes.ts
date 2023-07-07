import { Router } from 'express'
import * as AuthController from '../controllers/auth.controller'
import { authenticateRefreshToken } from '../middlewares/token'
import { validate } from '../middlewares/validations'
import { checkDuplicateEmail } from '../middlewares/verify'
// import { checkLoginFields } from '../middlewares/verifyLogin'
// import { checkValidRol } from '../middlewares/verifyFK'
// import { authenticateRefreshToken } from '../middlewares/token'

const signInFields = ['email', 'password']
const singUpFields = ['name', 'lastname', 'email', 'password']
const restorePasswordFields = ['email']

const router = Router()

// router.post('/signin', [checkLoginFields], AuthController.signIn)
router.post('/signin', [validate(signInFields)], AuthController.signIn)

// router.post('/signup', [checkCorrectFields, checkValidRol, checkDuplicateEmail], AuthController.singUp)
router.post('/signup', [validate(singUpFields), checkDuplicateEmail], AuthController.singUp)

// router.post('/restore-password', AuthController.restorePassword)
router.post('/restore-password', [validate(restorePasswordFields)], AuthController.restorePassword)

// router.post('/refresh-token', [authenticateRefreshToken], AuthController.refreshToken)
router.post('/refresh-token', [authenticateRefreshToken], AuthController.refreshToken)

export default router
