import jwt from 'jsonwebtoken';
import UserModel from '../model/user.js';
import bcrypt from 'bcrypt';
import ENV from '../config.js';

/**middleware for verify user */
export async function verifyUser(req, res, next) {
  try{
    const {username} = req.method == 'GET' ? req.query : req.body

    const exist = UserModel.findOne({username})
    if(!exist) return res.status(404).send({error: 'User not found'})

    next();
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
          if(!passwordCheck) return res.status(400).send({error : "Dont Have Password"})

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
          
          return res.status(400).send({error : "Password doesn't match",
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
    res.json({"message" : "getUser"})
}

/**PUT http://localhost:8080/api/updateUser 
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
  res.json({"message" : "updateUser"})
}

/**GET http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res)  {
  res.json({"message" : "generateOTP"})
}

/**GET http://localhost:8080/api/verifyOTP */
export async function verifyOTP (req, res) {
  res.json({"message" : "verifyOTP"})
}

//succesfully redirect user when OTP is valid
/**GET http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  res.json({"message" : "createResetSession"})
}

//reset password when we have valid session
/**PUT http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res)  {
  res.json({"message" : "resetPassword"})
}

