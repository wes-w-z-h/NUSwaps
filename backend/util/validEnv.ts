import { cleanEnv } from 'envalid';
import { port, str } from 'envalid/dist/validators.js';

export default cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str(),
  LOCAL_MONGO_URI: str(),
  JWT_KEY: str(),
  USER_ADDRESS: str(),
  APP_PASSWORD: str(),
  CURR_ENV: str(),
  FRONTEND_URL_LOCAL: str(),
  FRONTEND_URL_PROD: str(),
});
