import express from 'express';
import * as MatchController from '../controllers/matchController.js';

// TODO: Remove this after testing
const matchRouter = express.Router();

matchRouter.get('/', MatchController.getAllMatches);

export default matchRouter;
