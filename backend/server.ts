import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app.js';
import env from './util/validEnv.js';

const { PORT, MONGO_URI } = env;

mongoose.connect(MONGO_URI).catch((error) => console.log(error));

const server = app.listen(PORT, () => console.log('listening on port:', PORT));
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  socket.on('user-data', (userData) => {
    socket.join(userData.id);
  });

  socket.on('disconnect-user', () => {
    socket.disconnect(true);
  });
});

export default io;
