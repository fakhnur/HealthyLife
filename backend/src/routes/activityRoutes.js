import express from 'express';
import {
  getActivities,
  createActivity,
  deleteActivity,
  getActivitySummary,
  updateWaterIntake,
  updateSteps,
} from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getActivitySummary);
router.patch('/metrics/water', updateWaterIntake);
router.patch('/metrics/steps', updateSteps);
router.get('/', getActivities);
router.post('/', createActivity);
router.delete('/:id', deleteActivity);

export default router;
