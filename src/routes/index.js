import express from 'express'
import userRoutes from './userRoutes.js'
import diaryRoutes from './diaryRoutes.js'

const router = express.Router()


router.get("/", (req, res) => {
    res.status(200).send(` <h1> Welcome to Diary Manager backend</h1>`);
  });

router.use('/user',userRoutes)
router.use('/diary',diaryRoutes)

export default router