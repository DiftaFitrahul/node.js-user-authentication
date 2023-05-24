import { Router } from "express";
import * as controller from "../controller/appController.js"
const router = Router();

/**GET Method */

router.route('/register').post(controller.register);
// router.route('/registerMail').post(); // register email
router.route('/authenticate').post((req, res) => {res.end()}); // authenticate user
router.route('/login').post(controller.login); // login user
/**POST Method */
router.route('/user/:username').get(controller.getUser); //user with username
router.route('/generateOTP').get(controller.generateOTP); // generate OTP
router.route('/verifyOTP').get(controller.verifyOTP); // verify OTP
router.route('/createResetSession').get(controller.createResetSession); //reset session

/**PUT Method */
router.route('/updateUser').put(controller.updateUser); // update user
router.route('/resetPassword').put(controller.resetPassword); // reset password

export default router;