import UserModel from '../model/user.js';
import bcrypt from 'bcrypt';


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
              res.status(200).send({result})
            }).catch((error) => {res.status(500).send({error})})

          }).catch((err) => {
            res.status(500).send({error: "fail to hash password"})
          })
        }
      }).catch((err) => {
        return res.status(500).send({promiseError : err.message + " "})
      })

    }catch(err){
      res.status(500).send(err.message)
    }
 }

 /** POST http://localhost:8080/api/login
  * @params : {
    "email" : "email@gmail.com",
    "password" : "password"  
}
  */
export async function login(req, res)  {
    res.json({"message" : "login"})
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

