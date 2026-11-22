import { Router } from 'express';
import {
  talentController,
  updateAvailabilitySchema,
  acceptInviteSchema,
  declineInviteSchema,
  submitDeliverableSchema,
  updateTaxPayoutSchema,
} from '../controllers/talentController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

// Apply auth & TALENT role guard to all routes
router.use(authenticate, requireRole(['TALENT']));

router.get('/dashboard', (req, res) => talentController.getDashboard(req, res));
router.post('/availability', validateBody(updateAvailabilitySchema), (req, res) =>
  talentController.updateAvailability(req, res)
);

router.get('/invitations/:id', (req, res) => talentController.getInvitationDetail(req, res));
router.post('/invitations/:id/accept', validateBody(acceptInviteSchema), (req, res) =>
  talentController.acceptInvitation(req, res)
);
router.post('/invitations/:id/decline', validateBody(declineInviteSchema), (req, res) =>
  talentController.declineInvitation(req, res)
);

router.get('/projects/:id', (req, res) => talentController.getProjectWorkspace(req, res));
router.post('/deliverables', validateBody(submitDeliverableSchema), (req, res) =>
  talentController.submitDeliverable(req, res)
);

router.get('/payouts', (req, res) => talentController.getPayoutsLedger(req, res));
router.put('/tax-payout', validateBody(updateTaxPayoutSchema), (req, res) =>
  talentController.updateTaxAndPayout(req, res)
);

export default router;
