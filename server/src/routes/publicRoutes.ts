import { Router } from 'express';
import {
  publicController,
  liveCalculateSchema,
  confirmAvailabilityTokenSchema,
} from '../controllers/publicController.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

router.get('/stats', (req, res) => publicController.getPublicStats(req, res));
router.post('/calculate-split', validateBody(liveCalculateSchema), (req, res) =>
  publicController.calculateLiveSplit(req, res)
);

router.get('/availability/:token', (req, res) =>
  publicController.getAvailabilityByToken(req, res)
);
router.post(
  '/availability/:token',
  validateBody(confirmAvailabilityTokenSchema),
  (req, res) => publicController.confirmAvailabilityToken(req, res)
);

export default router;
