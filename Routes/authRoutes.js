import { Router } from "express";
import { MobileRegisteration,
      verifyOtp ,
      aadharOtpGenerate, 
      aadhaarVerification, 
      panVerification } from "../Controller/authController.js";
const router = Router();

router.post('/signup', MobileRegisteration);
router.post('/signupVerification', verifyOtp);
router.post('/aadharOtpGenerate' , aadharOtpGenerate)
router.post('/aadharVerification', aadhaarVerification);
router.post('/panVerification', panVerification);

export default router;