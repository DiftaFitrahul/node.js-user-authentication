import ENV from '../config.js'
import jwt from 'jsonwebtoken';

export async function Auth(req, res, next){
    try{
        //access authorize header to validate request
        const token = req.headers.authorization.split(' ')[1];

        // retrieve the user details for the logged in user
        const decodedToken = jwt.verify(token, ENV.JWT_SECRET)

        req.user = decodedToken;
        console.log('============================================================');
        console.log(req.user);

        next();
    }catch(err){
        return res.status(404).send({message : "Update user is decline " + err.message})
    }
}

export function localVariables(req, res, next) {
    req.app.locals = {
        OTP : null,
        resetSession : false,
    }
    next();
}