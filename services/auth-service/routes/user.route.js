import { Router } from 'express';
import {
	login,
	register,
	resendVerificationCode,
	verifyEmail,
} from '../controllers/auth.controler.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification-code', resendVerificationCode);

export default router;
