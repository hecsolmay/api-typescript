import { Router } from 'express'
import * as objectiveCtrl from '../controllers/objective.controller'
import { validate } from '../middlewares/validations'
import { uploadFile } from '../middlewares/multer'

// const { checkValidContentType } = require('../middlewares/verifyFK')
// const { uploadFile } = require('../middlewares/multer')

const router = Router()

const createObjectiveFields = ['label', 'contentType']

router.get('/', objectiveCtrl.getObjectivesNotDeleted)
router.get('/all', objectiveCtrl.getAllObjectives)
router.put('/restore/:id', objectiveCtrl.restoreObjective)
router.post('/', [uploadFile, validate(createObjectiveFields)], objectiveCtrl.createObjective)
router.get('/:id', objectiveCtrl.getObjectiveById)
router.delete('/:id', objectiveCtrl.deleteObjective)
// router.put('/:id', [uploadFile, checkValidContentType], objectiveCtrl.updateObjective)

export default router
