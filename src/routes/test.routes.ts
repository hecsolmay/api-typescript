import { Router } from 'express'
import * as testCtrl from '../controllers/test.controller'
import { authenticateToken } from '../middlewares/token'
import { validate } from '../middlewares/validations'

// const { verifyTestUser } = require('../middlewares/user')
// const { verifyTestStatus } = require('../middlewares/test')

const router = Router()

const requiredTestCreateFields = ['name', 'ISI', 'SOA', 'pause', 'questions']

router.get('/', [authenticateToken], testCtrl.getNotDeletedTest)
// router.get('/game/:id', [authenticateToken, verifyTestUser, verifyTestStatus], testCtrl.getTestGame)
router.get('/all', [authenticateToken], testCtrl.getAllTest)
router.put('/restore/:id', testCtrl.restore)
router.post('/', [authenticateToken, validate(requiredTestCreateFields)], testCtrl.createTest)
router.get('/:id', testCtrl.getTest)
router.get('/details/:id', testCtrl.getDetailsTest)
router.delete('/:id', testCtrl.deleteTest)
router.put('/:id', [authenticateToken], testCtrl.updatedTest)

export default router
