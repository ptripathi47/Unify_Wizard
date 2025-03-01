import { Router } from "express";
import { MobileRegisteration, verifyOtp } from "../Controller/authController.js";
const router = Router();

router.post('/signup', MobileRegisteration);
router.post('/signupVerification', verifyOtp);

export default router;