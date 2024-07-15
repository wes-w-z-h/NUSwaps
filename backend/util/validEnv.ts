import dotenv from 'dotenv';
import { cleanEnv } from 'envalid';
import { port, str } from 'envalid/dist/validators.js';
import { fileURLToPath } from 'url';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const __dirname = path.dirname(__filename);
const p = path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`);
// console.log(p);
dotenv.config({ path: p });

export default cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str(),
  JWT_KEY: str(),
  USER_ADDRESS: str(),
  APP_PASSWORD: str(),
  FRONTEND_URL: str(),
  BOT_TOKEN: str(),
  NUS_MODS_BASE_API: str(),
});
