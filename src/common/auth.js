import bcrypt from 'bcryptjs'
import Jwt  from 'jsonwebtoken'

const hashPaswoard = async(password)=>{
    let salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
    let hash = await bcrypt.hash(password,salt)
    return hash
}

const hashCompare = async(password,hash)=>{
    return await bcrypt.compare(password,hash)
}

const createToken = async(payload)=>{
    const token = await Jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
   return token

}

const decodeToken = async(token)=>{
const payload = await Jwt.decode(token)
return payload
}

const validate = async(req,res,next)=>{
let token = req.headers.authorization?.split(" ")[1]
if(token)
{   
    let payload = await decodeToken(token)
    req.headers.userId = payload.id 
    let currentTime = (+new Date())/1000
    if(currentTime<payload.exp){
        next()
    } 
    else{
        res.status(400).send({message:"Token Expired"})
    }
}
else
{
    res.status(401).send({message:"Token Not Foud"})
}

}
export default {
    hashPaswoard,
    hashCompare,
    createToken,
    validate
}