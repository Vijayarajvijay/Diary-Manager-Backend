import mongoose from "mongoose";

const diarySchema = new mongoose.Schema({
    title:{type:String,required:[true,"Title is required"]},
    date:{type:String,required:[true,"date is required"]},
    description:{type:String,required:[true,"Description is Required"]},
    createdBy:{type:String},
   
    createdAt:{type:Date,default:Date.now()},
    editedAt:{type:Date}
},{
    versionKey:false
})

const diaryModel = mongoose.model('diary',diarySchema)
export default diaryModel