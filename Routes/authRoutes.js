import { Router } from "express";
import { authenticateToken } from "../Middlewares/verifyToken.js";
import { MobileRegisteration,
      verifyOtp ,
      aadharOtpGenerate, 
      aadhaarVerification, 
      panVerification } from "../Controller/authController.js";
const router = Router();

router.post('/signup', MobileRegisteration);
router.post('/signupVerification', verifyOtp);
router.post('/aadharOtpGenerate' , aadharOtpGenerate)
router.post('/aadharVerification', authenticateToken,  aadhaarVerification);
router.post('/panVerification', authenticateToken, panVerification);

export default router;