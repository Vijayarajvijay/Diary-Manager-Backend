import mongoose from "mongoose";


const validateEmail = (e)=>{
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(e); 
}

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:[true,"User Name Required"]},

        email :{
            type:String,
        required:[true,"Email required"],
        validate:validateEmail},

        password : {
            type:String,
            required:[true,'password is Required']

        },
        randomString:{
            type:String
         },

        createdAt :{
            type:Date,
            default:Date.now()
        },


},{
   
    versionKey:false
})

const userModel = mongoose.model("user",userSchema)

export default userModel