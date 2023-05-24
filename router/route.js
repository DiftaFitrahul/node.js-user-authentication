import { Router } from "express";
const router = Router();

/**GET Method */

router.route('/register').post((req, res) => res.status(200).json({"message" : "register"}));
router.route('/registerMail').post(); // register email
router.route('/authenticate').post(); // authenticate user
router.route('/login').post(); // login user
/**POST Method */
router.route('/user/:username').get(); //user with username
router.route('/generateOTP').get(); // generate OTP
router.route('/verifyOTP').get(); // verify OTP
router.route('/createResetSession').get(); //reset session

/**PUT Method */
router.route('/updateUser').put(); // update user
router.route('/resetPassword').put(); // reset password

export default router;