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
 exports.register = async (req, res) => {
    try{
      const {username, password, profile, email} = req.body;

      const existUsername = new Promise((resolve, reject) => {
        UserModel.findOne({username}, (err, user) => {
          if(err) reject(new Error(err));
          if(user) reject({error: 'Username exist, please use unique username'})

          resolve();
        })
      });

      const existEmail = new Promise((resolve, reject) => {
        UserModel.findOne({email}, (err, user) => {
          if(err) reject(new Error(err));
          if(user) reject({error: 'Email exist, please use unique email'})

          resolve();
        })
      })

      Promise.all([existUsername, existEmail]).then(() => {
        
      }).catch((err) => {
        return res.status(500).send({error : 'Enable to hashed password'})
      })

    } catch(e){
      res.status(500).send()
    }
 }

 /** POST http://localhost:8080/api/login
  * @params : {
    "email" : "email@gmail.com",
    "password" : "password"  
}
  */
exports.login = async (req, res) => {
    res.json({"message" : "login"})
}

/**GET http://localhost:8080/api/user/username */
exports.getUser = async (req, res) => {
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
exports.updateUser = async (req, res) => {
  res.json({"message" : "updateUser"})
}

/**GET http://localhost:8080/api/generateOTP */
exports.generateOTP = async (req, res) => {
  res.json({"message" : "generateOTP"})
}

/**GET http://localhost:8080/api/verifyOTP */
exports.verifyOTP = async (req, res) => {
  res.json({"message" : "verifyOTP"})
}

//succesfully redirect user when OTP is valid
/**GET http://localhost:8080/api/createResetSession */
exports.createResetSession = async (req, res) => {
  res.json({"message" : "createResetSession"})
}

//reset password when we have valid session
/**PUT http://localhost:8080/api/resetPassword */
exports.resetPassword = async (req, res) => {
  res.json({"message" : "resetPassword"})
}

