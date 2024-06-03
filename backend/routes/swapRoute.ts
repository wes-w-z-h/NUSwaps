import express from 'express';
import * as SwapController from '../controllers/swapController.js';
import verifyAuth from '../middleware/verifyAuth.js';

const swapRouter = express.Router();

// verify auth for all routes below
swapRouter.use(verifyAuth);

swapRouter.get('/', SwapController.getSwaps);

swapRouter.get('/:id', SwapController.getSwap);

swapRouter.post('/', SwapController.createSwap);

swapRouter.delete('/:id', SwapController.deleteSwap);

swapRouter.patch('/:id', SwapController.updateSwap);

export default swapRouter;
