import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from server directory or root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback to current cwd .env

const envSchema = z.object({
  COGNODB_URI: z.string().transform((s) => s.trim()).default('bolt://localhost:7687'),
  COGNODB_USERNAME: z.string().transform((s) => s.trim()).default('cognodb'),
  COGNODB_PASSWORD: z.string().transform((s) => s.trim()).default(''),
  PORT: z.union([z.string(), z.number()]).transform((s) => typeof s === 'number' ? s : (Number(String(s).trim()) || 5000)).default(5000),
  NODE_ENV: z.string().default('production'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
