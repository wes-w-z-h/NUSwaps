import express from 'express';
import * as SwapController from '../controllers/swapController';

const swapRouter = express.Router();

swapRouter.get('/', SwapController.getSwaps);

// swapRouter.get("/:id", (_req, res) => {});

swapRouter.post('/', SwapController.createSwap);

// swapRouter.delete("/", (req, res) => {});

export default swapRouter;
