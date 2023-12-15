import auth from "../common/auth.js";
import userModel from "../models/users.js";
import randomstring from "randomstring";
import nodemailer from 'nodemailer'

const signup = async(req,res)=>{
try {
    let user = await userModel.findOne({email:req.body.email})
    if (!user)
    {
       req.body.password = await auth.hashPaswoard(req.body.password)
       await userModel.create(req.body)
       res.status(201).send({message:'User Created Successfully'})
    }
    else
    {
      res.status(404).send({message:`user with ${req.body.email} already exists`})
    }
} catch (error) {
    res.status(500).send({message:"Internal Server Error",error:error.message})
}
}

const login = async (req, res) => {
    try {
      let user = await userModel.findOne({ email: req.body.email });
  
      if (user) {
        let hashCompare = await auth.hashCompare(req.body.password, user.password);
  
        if (hashCompare) {
          let token = await auth.createToken({
            id: user._id,
            userName: user.userName,
            email: user.email,
          });
  
          let userData = await userModel.findOne(
            { email: req.body.email },
            { _id: 1, userName: 1, createdAt: 1, email: 1 }
          );
  
          res.status(201).send({
            message: "Login Successfully",
            token,
            userData,
          });
        } else {
          res.status(401).send({
            message: "Invalid Password",
          });
        }
      } else {
        res.status(404).send({
          message: `Account with ${req.body.email} does not exist`,
        });
      }
    } catch (error) {
      res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };
  
const forgetPassword = async(req,res)=>{
    try {
        let user = await userModel.findOne({email:req.body.email})
        if(user){
        const randomString = randomstring.generate({
            length:10,
            charset:"alphanumeric"
        })
        const expirationTimestamp = Date.now() + 2 * 60 * 1000
        console.log(expirationTimestamp)
        const resetLink = `${process.env.ResetUrl}/reset-password/${randomString}/${expirationTimestamp}`
        
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_ID,
                pass:process.env.EMAIL_PASSWORD,
            }
        })
        const mailOptions = {
            forom : process.env.EMAIL_ID,
            to : user.email,
            subject : "Password Reset Link",
            html : ` <p> Dear ${user.userName} , </p>
                
            <p>Sorry to hear you’re having trouble logging into your account. We got a message that you forgot your password. If this was you, you can get right back into your account or reset your password now. </p>
            <p> Click the following Link to reset your password \n ${resetLink} </p>

            <p>If you didn’t request a login link or a password reset, you can ignore this message. </P>

            <p> Only people who know your account password or click the login link in this email can log into your account. </P>
            `
        }
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error)
            {
                console.log(error)
                res.status(500).send({
                    message:"Failed to send the password reset mail"
                })
            }
            else{
                console.log("Password reset email sent" + info.response)
                res.status(201).send({
                    message:"Password Reset Link sent Successfully"
                })
            }
            user.randomString=randomString
            user.save()
            res.status(201).send({
                message:"Reset Password Link sent successfully and random string updated in db"
            })
        })
    }
    else{
        res.status(404).send({
            message:`user with ${req.body.email} is not exists`
         })
    }
    } catch (error) {
        res.status(500).send({
            message:"Internel Server Error"
        })
    }
}

const resetpassword = async(req,res)=>{
    try {
        const {randomString,expirationTimestamp} = req.params
        const user = await userModel.findOne({randomString:randomString})
        if(!user || user.randomString !== randomString)
        {
            res.status(404).send({
                message:"invalid Randomstring"
            })
        }
        else
        {
            if(expirationTimestamp && expirationTimestamp<Date.now())
            {
                res.status(404).send({
                    message:"expirationTimestap toke has experied. please request a new reset link"
                })
            }
            else
            {
                if(req.body.newPassword)
                {
                    const newPassword =await auth.hashPaswoard(req.body.newPassword)
                    user.password = newPassword
                    user.randomString=null
                    await user.save()

                    res.status(201).send({
                        message:"Your new password has been updated"
                    })
                }
                else
                {
                    res.status(404).send({
                        message:"Invalid Password provider"
                    })
                }
            }
        }
    } catch (error) {
        res.status(500).send({
            message:"Internel Server Error"
        })
    }
}

export default {
    signup,
    login,
    forgetPassword,
    resetpassword
}

