import { Router } from "express";
import { MobileRegisteration,
      verifyOtp ,
      aadharOtpGenerate, 
      aadhaarVerification, 
      panNumber } from "../Controller/authController.js";
const router = Router();

router.post('/signup', MobileRegisteration);
router.post('/signupVerification', verifyOtp);
router.post('/aadharOtpGenerate' , aadharOtpGenerate)
router.post('/aadharVerification', aadhaarVerification);
router.post('/panVerification', panNumber);

export default router;