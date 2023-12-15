import  express from "express";
import userController from "../controllers/userController.js";


const router = express.Router()

router.post('/signup', userController.signup)

router.post('/login', userController.login)

router.post('/forgetpassword', userController.forgetPassword)

router.post('/reset-password/:randomString/:expirationTimestamp',userController.resetpassword)

export default router