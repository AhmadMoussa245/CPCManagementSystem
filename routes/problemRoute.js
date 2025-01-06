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

router.use(authController.restrictTo('admin'));

router.route('/problems')
.post(problemController.createProblem)
.delete(problemController.deleteAllProblems);

router.route('/problems/:id')
.patch(problemController.updateProblem)
.delete(problemController.deleteProblem);

export default router;