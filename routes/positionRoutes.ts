import { Router } from 'express';

const router = Router();
import * as positionController from "../controllers/position/positionController.ts";


router.post('/', positionController.createPosition);
router.get('/', positionController.getAllPositions);
router.get('/:id', positionController.getPositionById);
router.put('/:id', positionController.updatePosition);
router.delete('/:id', positionController.deletePosition);

export default router;
