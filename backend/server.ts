import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import env from './util/validEnv.js';

const { PORT, CURR_ENV } = env;
const MONGO_CONNECTION_STRING: string =
  CURR_ENV === 'DEVELOPMENT' ? env.LOCAL_MONGO_URI : env.MONGO_URI;

mongoose.connect(MONGO_CONNECTION_STRING).catch((error) => console.log(error));

const server = app.listen(PORT, () => console.log('listening on port:', PORT));
// eslint-disable-next-line global-require
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket: any) => {
  // console.log('Connection established to ', socket);

  socket.on('ping', () => {
    socket.emit('pong', 'pongggg');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });
});
