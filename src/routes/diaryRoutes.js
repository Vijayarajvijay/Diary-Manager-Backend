import express from 'express'
import auth from '../common/auth.js'
import diaryControler from '../controllers/diaryControler.js'

const router = express.Router()

router.post('/create',auth.validate,diaryControler.createDiary)
router.put('/edit/:id',auth.validate,diaryControler.editDiary)
router.get('/user',auth.validate,diaryControler.getDiaryByUser)
router.get('/:id',auth.validate,diaryControler.getDiarysById)
router.get('/',auth.validate,diaryControler.getAllDiarys)


export default router

