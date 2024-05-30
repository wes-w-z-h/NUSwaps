import { cleanEnv } from 'envalid';
import { port, str } from 'envalid/dist/validators.js';

export default cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str(),
  JWT_KEY: str(),
});
