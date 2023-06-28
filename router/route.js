import { Router } from "express";
import {Auth, localVariables} from '../middleware/auth.js';
import * as controller from "../controller/appController.js"
const router = Router();


/**POST Method */
router.route('/register').post(controller.register);
// router.route('/registerMail').post(); // register email
router.route('/authenticate').post((req, res) => {res.end()}); // authenticate user
router.route('/login').post(controller.verifyUser ,controller.login); // login user
/**GET Method */
router.route('/user/:username').get(controller.getUser); //user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP); // generate OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); // verify OTP
router.route('/createResetSession').get(controller.createResetSession); //reset session

/**PUT Method */
router.route('/updateuser').put(Auth, controller.updateUser); // update user
router.route('/resetPassword').put(controller.resetPassword); // reset password

export default router;
