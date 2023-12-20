import express from 'express'
import auth from '../common/auth.js'
import DiaryController from '../controllers/diaryControler.js'

const router = express.Router()

router.post('/create',auth.validate,DiaryController.createDiary)
router.put('/edit/:id',auth.validate,DiaryController.editDiary)
router.get('/user',auth.validate,DiaryController.getDiaryByUser)
router.get('/:id',auth.validate,DiaryController.getDiarysById)
router.get('/alldiary',auth.validate,DiaryController.getAllDiarys)


export default router

