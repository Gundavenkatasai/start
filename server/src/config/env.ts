import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load .env from server directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform((v) => parseInt(v, 10)).default('5000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().min(16, 'REFRESH_TOKEN_SECRET must be at least 16 chars'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  STRIPE_SECRET_KEY: z.string().optional().default('sk_test_sandbox'),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default('whsec_sandbox'),
  RAZORPAY_KEY_ID: z.string().optional().default('rzp_test_sandbox'),
  RAZORPAY_KEY_SECRET: z.string().optional().default('rzp_secret_sandbox'),
  RESEND_API_KEY: z.string().optional().default(''),
  STORAGE_DRIVER: z.enum(['local', 's3', 'r2']).default('local'),
  STORAGE_LOCAL_DIR: z.string().default('./uploads'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
