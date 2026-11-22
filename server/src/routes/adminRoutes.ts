import { Router } from 'express';
import {
  adminController,
  updateTalentStatusSchema,
  scopeProjectSchema,
  assemblePodSchema,
  qaReviewDeliverableSchema,
  releasePayoutSchema,
} from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

// Apply auth & ADMIN role guard (2 Founders)
router.use(authenticate, requireRole(['ADMIN']));

router.get('/dashboard', (req, res) => adminController.getDashboard(req, res));

// Talent CRM
router.get('/talent', (req, res) => adminController.getTalentList(req, res));
router.patch('/talent/:id', validateBody(updateTalentStatusSchema), (req, res) =>
  adminController.updateTalent(req, res)
);
router.post('/talent/:id/ping', (req, res) => adminController.sendAvailabilityPing(req, res));

// Project Pipeline & Scoping
router.get('/projects', (req, res) => adminController.getProjectsList(req, res));
router.post('/projects/:id/scope', validateBody(scopeProjectSchema), (req, res) =>
  adminController.scopeProject(req, res)
);

// Pod Assembler
router.post('/projects/:id/pod', validateBody(assemblePodSchema), (req, res) =>
  adminController.assemblePod(req, res)
);

// Founder QA Gate
router.post(
  '/projects/:id/submissions/:submissionId/qa',
  validateBody(qaReviewDeliverableSchema),
  (req, res) => adminController.reviewDeliverableQA(req, res)
);

// Payouts Ledger & CSV Export
router.post('/payouts/release', validateBody(releasePayoutSchema), (req, res) =>
  adminController.releasePayout(req, res)
);
router.get('/payouts/export-csv', (req, res) => adminController.exportPayoutLedgerCsv(req, res));

export default router;
