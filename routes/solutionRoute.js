import express from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import solutionController from '../controllers/solutionController.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.use(authController.protect);

router.route('/solutions')
.get(
    authController.restrictTo('admin'),
    solutionController.getAllSolutions
)
.delete(
    authController.restrictTo('admin'),
    solutionController.deleteAllSolutions
)

router.route('/solutions/:id')
.get(
    authController.restrictTo('admin'),
    solutionController.getSolution,
)
.patch(
    authController.restrictTo('admin'),
    solutionController.updateSolution,
);

router.post('/problems/:id/solution',
    upload.single('code'),
    solutionController.sendSolution
);

router.post('/res-question/:id',
    authController.restrictTo('admin'),
    solutionController.questionResponse
);

export default router;