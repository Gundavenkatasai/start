import { Router } from 'express';
import {
  authController,
  loginSchema,
  talentRegisterSchema,
  clientRegisterSchema,
} from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', authRateLimiter, validateBody(loginSchema), (req, res) =>
  authController.login(req, res)
);

router.post('/register/talent', authRateLimiter, validateBody(talentRegisterSchema), (req, res) =>
  authController.registerTalent(req, res)
);

router.post('/register/client', authRateLimiter, validateBody(clientRegisterSchema), (req, res) =>
  authController.registerClient(req, res)
);

router.get('/me', authenticate, (req, res) => authController.getMe(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;
