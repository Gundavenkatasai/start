import { Router } from 'express';
import {
  clientController,
  submitBriefSchema,
  milestoneCheckoutSchema,
  reviewDeliverableSchema,
  createChangeOrderSchema,
} from '../controllers/clientController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

// Apply auth & CLIENT role guard
router.use(authenticate, requireRole(['CLIENT']));

router.get('/dashboard', (req, res) => clientController.getDashboard(req, res));
router.post('/briefs', validateBody(submitBriefSchema), (req, res) =>
  clientController.submitBrief(req, res)
);

router.get('/projects/:id', (req, res) => clientController.getProjectDetail(req, res));
router.post(
  '/projects/:id/milestones/checkout',
  validateBody(milestoneCheckoutSchema),
  (req, res) => clientController.createMilestonePaymentIntent(req, res)
);
router.post('/projects/:id/milestones/confirm', (req, res) =>
  clientController.confirmMilestonePayment(req, res)
);

router.post(
  '/projects/:id/milestones/:milestoneId/review',
  validateBody(reviewDeliverableSchema),
  (req, res) => clientController.reviewDeliverable(req, res)
);

router.post(
  '/projects/:id/change-orders',
  validateBody(createChangeOrderSchema),
  (req, res) => clientController.createChangeOrder(req, res)
);

export default router;
