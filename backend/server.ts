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
  console.log('Connection established to ', socket.id);
  // console.log('io', io.sockets.sockets);

  socket.on('ping', () => {
    socket.emit('pong', 'pongggg');
  });

  socket.on('user-data', (userData) => {
    socket.join(userData.id);
    socket.emit('pong', `user joined room ${userData.id}`);
    console.log('user joined room', userData.id);
  });

  socket.on('disconnect-user', () => {
    socket.disconnect(true);
    console.log('Disconnected', socket.id);
  });
});

setInterval(() => {
  console.log(io.sockets.sockets.keys());
  io.emit('pong', 'hehehehhe');
}, 5000);
export default io;
