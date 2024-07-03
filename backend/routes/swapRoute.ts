import express from 'express';
import * as SwapController from '../controllers/swapController.js';
import verifyAuth from '../middleware/verifyAuth.js';
import verifySwap from '../middleware/verifySwap.js';

const swapRouter = express.Router();

// verify auth for all routes below
swapRouter.use(verifyAuth);

swapRouter.get('/userswaps', SwapController.getUserSwaps);

swapRouter.get('/:id', SwapController.getSwap);

swapRouter.delete('/:id', SwapController.deleteSwap);

swapRouter.patch('/confirm/:id', SwapController.confirmSwap);

swapRouter.patch('/reject/:id', SwapController.rejectSwap);

swapRouter.use(verifySwap);

swapRouter.post('/', SwapController.createSwap);

swapRouter.patch('/:id', SwapController.updateSwap);

export default swapRouter;
