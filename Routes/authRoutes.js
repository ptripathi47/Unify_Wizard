import { Router } from "express";
import { MobileRegisteration, verifyOtp , aadharAuthentication , panNumber } from "../Controller/authController.js";
const router = Router();

router.post('/signup', MobileRegisteration);
router.post('/signupVerification', verifyOtp);
router.post('/aadharVerification', aadharAuthentication);
router.post('/panVerification', panNumber);

export default router;