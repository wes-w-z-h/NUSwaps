import mongoose from 'mongoose';
import app from './app.js';
import 'dotenv/config';
import env from './util/validEnv.js';

const { PORT } = env;

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log('listening on port:', PORT));
  })
  .catch((error) => console.log(error));
