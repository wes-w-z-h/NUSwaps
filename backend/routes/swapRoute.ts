import express from 'express';
import * as SwapController from '../controllers/swapController';

const swapRouter = express.Router();

swapRouter.get('/', SwapController.getSwaps);

swapRouter.get('/:id', SwapController.getSwap);

swapRouter.post('/', SwapController.createSwap);

swapRouter.delete('/:id', SwapController.deleteSwap);

swapRouter.patch('/:id', SwapController.updateSwap);

export default swapRouter;
