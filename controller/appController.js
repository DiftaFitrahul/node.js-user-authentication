import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import UserModel from '../model/user.js';
import bcrypt from 'bcrypt';
import ENV from '../config.js';
import e from 'express';

/**middleware for verify user */
export async function verifyUser(req, res, next) {
  try{
    const {username} = req.method == 'GET' ? req.query : req.body
    await UserModel.findOne({username}).then((user) => {
      if(user === null) {
        return res.status(404).send({error: 'User not found'});
      }else{
        next();
        }  
      })   
  }catch(err){
    return res.status(500).send({error : "Authentication error"})
  }
}

/** POST http://localhost:8080/api/register
 * @param : {
    "username" : "example123",
    "password" : "example123"
    "email" : "example123@gmail.com",
    "firstName" : "abc",
    "lastName" : "cde",
    "phone" : "0812345678"
    "address" : "Jl Magelang-Jogja",
    "profile"  : ""  

}
 */
 export async function register(req, res) {
    try{
      const {username, password, profile, email} = req.body;

      const existUsername =  new Promise( (resolve, reject) => {
         UserModel.findOne({username}).then((data) => {
          if(data === null) resolve();
          if(data !== null)reject(new Error('UserName exist'));
          resolve();
         }).catch((err) => {
          reject(new Error(err));
         })
      });

      const existEmail = new Promise((resolve, reject) => {
        UserModel.findOne({email}).then((data) => {
          if(data === null) resolve();
          if(data !== null)reject(new Error('Email exist'));
         }).catch((err) => {
          reject(new Error(err.message));
         })
      })

      Promise.all([existUsername, existEmail]).then(() => {
        if(password){
          bcrypt.hash(password, 10).then((hash) => {
            const user = new UserModel({
              username,
              password: hash,
              profile: profile || '',
              email
            })
            user.save().then((result) => {
              return res.status(200).send({message : "Succesfully registered"})
            }).catch((error) => {res.status(500).send({error})})

          }).catch((err) => {
            return res.status(500).send({error: "fail to hash password"})
          })
        }
      }).catch((err) => {
        return res.status(500).send({promiseError : err.message + " "})
      })

    }catch(err){
      return res.status(500).send(err.message)
    }
 }

 /** POST http://localhost:8080/api/login
  * @params : {
    "username" : "example123",
    "password" : "example123"
}
  */
export async function login(req, res)  {
    try{
      const {username, password} = req.body;
      

      UserModel.findOne({username}).then((user) => {
        
        bcrypt.compare(password, user.password).then((passwordCheck) => {
          if(!passwordCheck) return res.status(400).send({error : "Password is wrong"})

          const token = jwt.sign({
            userId : user._id,
            username : user.username
          }, ENV.JWT_SECRET , {expiresIn: "24h"})
          return res.status(200).send({
            message : "Login successfully",
            username: user.username,
            token,
          })

        }).catch((error) => {
          
          return res.status(400).send({error, 
        reason : error.message
        })
        })  
      }).catch((err) => {
        return res.status(404).send({error : "Username not found"})
      })
    }catch(error){
      return res.status(500).send({error})
    }
}

/**GET http://localhost:8080/api/user/username */
export async function getUser(req, res)  {
    
    try{
      const {username} = req.params;
      UserModel.findOne({username}).then((user) => {
        if(!user) return res.status(404).send({error : "Username not found"})
        const{password, ...rest} = Object.assign({}, user.toJSON()); 
        return res.status(200).send(rest)
      }).catch((error) => res.send(500).send(error.message))
    }catch(error){
      return res.status(404).send({error : "Username not found"})
    }
}

/**PUT http://localhost:8080/api/updateuser 
 * @param :{ 
   "id" : "<userid>" 
 } 
  body: {
    "firstName" : "",
    "address" : "",
    "profile" : "",
    }
 
*/
export async function updateUser(req, res)  {
  try{
    const {userId} = req.user;
    if(userId){
      const body = req.body;
    UserModel.updateOne({_id : userId}, body).then((user) => {
      
      return res.status(200).send({message : 'update succesfully'})
    }).catch(err => {
      return res.status(500).send({message : err.message})
    })
    }else{
      return res.status(500).send({message : id})
    }
  }catch(err){
    return res.status(404).send(err.message)
  }
}

/**GET http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res)  {
  try{
    req.app.locals.OTP =  await otpGenerator.generate(6, {lowerCaseAlphabets : false, upperCaseAlphabets : false, specialChars: false});
    return res.status(200).send({"OTP code" : req.app.locals.OTP});
  }catch(err) {
    return res.status(404).send(err.message);
  }
}

/**GET http://localhost:8080/api/verifyOTP */
export async function verifyOTP (req, res) {
  try{
    const {code} = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
      req.app.locals.OTP = null;
      req.app.locals.resetSession = true;
      return res.status(200).send({msg : "verify successfully"})
    } else{
      return res.status(400).send({msg : "Invalid OTP"})
    }
  }catch(err){
    return res.status(404).send(err.message);
  }
}

//succesfully redirect user when OTP is valid
/**GET http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  if(req.app.locals.resetSession){
    req.app.locals.resetSession = false; 
    return res.status(201).send({msg : "Access granted"});
  }else{
    return res.status(440).send({msg : "Session expired!"})
  }
}

//reset password when we have valid session
/**PUT http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res)  {
  try{

    if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

    const {username, password} = req.body;

    try{
      UserModel.findOne({username}).then(user =>{
        bcrypt.hash(password, 10)
        .then(hassPassword =>{
          UserModel.updateOne({username : user.username},
            {password: hassPassword}
            )
            .then(data =>{
              req.app.locals.resetSession = false; //reset session
              return res.status(201).send({msg : "succes to reset password"})
            })
            .catch(err =>{
              return res.status(404).send({err})
            })
        })
        .catch(err => {
            return res.status(500).send({error : 'enable to hash password'})});
      }).catch(err =>{
          return res.status(404).send({error: "username is not found"})})
    }catch(err){
      return res.status(500).send({err}) 
    }
  }catch(err){
    return res.status(401).send({err})
  }
}

