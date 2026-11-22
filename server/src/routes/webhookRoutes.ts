import { Router, Request, Response } from 'express';
import { paymentService } from '../services/paymentService.js';

const router = Router();

router.post('/stripe', async (req: Request, res: Response) => {
  const eventId = req.headers['stripe-event-id'] as string || req.body.id || `stripe_evt_${Date.now()}`;
  const eventType = req.body.type || 'payment_intent.succeeded';

  try {
    await paymentService.processWebhookEvent(eventId, 'STRIPE', eventType, req.body);
    res.json({ received: true });
  } catch (err: any) {
    console.error('Stripe webhook processing error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/razorpay', async (req: Request, res: Response) => {
  const eventId = req.headers['x-razorpay-event-id'] as string || req.body.event_id || `rzp_evt_${Date.now()}`;
  const eventType = req.body.event || 'order.paid';

  try {
    await paymentService.processWebhookEvent(eventId, 'RAZORPAY', eventType, req.body);
    res.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Razorpay webhook processing error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
