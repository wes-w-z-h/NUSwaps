import express from 'express';
import * as MatchController from '../controllers/match.js';

const matchRouter = express.Router();

matchRouter.get('/', MatchController.getMatch);

export default matchRouter;
