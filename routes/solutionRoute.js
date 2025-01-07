import express from 'express';
import authController from '../controllers/authController.js';
import solutionController from '../controllers/solutionController.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.route('/solutions')
.get(solutionController.getAllSolutions)
.delete(solutionController.deleteAllSolutions)

router.route('/solutions/:id')
.get(solutionController.getSolution)
.patch(solutionController.updateSolution);

router.post('/problems/:id/solution',
    upload.single('code'),
    solutionController.sendSolution
);

export default router;