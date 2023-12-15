import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Approutes from './src/routes/index.js'
import mongoose from 'mongoose'



dotenv.config()
try {
    mongoose.connect(`${process.env.dbUrl}/${process.env.dbName}`)
   console.log("mongooDB coneccted")
    
} catch (error) {
    console.log(error)
}


const PORT = process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use('/',Approutes)


app.listen(PORT,()=>console.log(`App is listening ${PORT}`))