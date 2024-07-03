import mongoose from 'mongoose';
import app from './app.js';
import env from './util/validEnv.js';

const { PORT, MONGO_URI } = env;

mongoose.connect(MONGO_URI).catch((error) => console.log(error));

app.listen(PORT, () => console.log('listening on port:', PORT));

/** 
// const server = app.listen(PORT, () => console.log('listening on port:', PORT));
// eslint-disable-next-line global-require
const io = require('socket.io')(server, {
  cors: {
    origin:
      CURR_ENV === 'DEVELOPMENT'
        ? env.FRONTEND_URL_LOCAL
        : env.FRONTEND_URL_PROD,
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
*/
