import express from 'express';
import * as MatchController from '../controllers/matchController.js';
import verifyAuth from '../middleware/verifyAuth.js';

const matchRouter = express.Router();

// TODO: Uncomment this after testing
// verify auth for all routes below
// matchRouter.use(verifyAuth);

matchRouter.get('/', MatchController.getAllMatches);

matchRouter.get('/:id', MatchController.getMatch);

export default matchRouter;
