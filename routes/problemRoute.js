import express from 'express';
import problemController from '../controllers/problemController.js';
import authController from '../controllers/authController.js';

const router=express.Router();

router.use(authController.protect);

router.get('/problems',
    problemController.getAllProblems
);

router.get('/problems/:id',
    problemController.getProblem
);


router.route('/problems')
.post(
    authController.restrictTo('admin'),
    problemController.createProblem
)
.delete(
    authController.restrictTo('admin'),
    problemController.deleteAllProblems,
);

router.route('/problems/:id')
.patch(
    authController.restrictTo('admin'),
    problemController.updateProblem,
)
.delete(
    authController.restrictTo('admin'),
    problemController.deleteProblem
);

export default router;