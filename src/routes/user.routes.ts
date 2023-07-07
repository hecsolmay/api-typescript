import { Router } from 'express'
import * as UserController from '../controllers/user.controller'
import { authenticateToken } from '../middlewares/token'
import { checkUpdateEmailNotConfic } from '../middlewares/verify'

const router = Router()

router.get('/', [authenticateToken], UserController.getUsers)
router.get('/experiment', [authenticateToken], UserController.getUsersNotDeleted)
router.put('/restore/:id', UserController.restore)
router.get('/:id', UserController.getById)
router.delete('/:id', UserController.deleteById)
router.put('/:id', [checkUpdateEmailNotConfic], UserController.updateById)

export default router
