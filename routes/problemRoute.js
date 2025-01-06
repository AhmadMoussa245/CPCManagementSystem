import express from 'express';
import problemController from '../controllers/problemController.js';

const router=express.Router();

router.route('/problems')
.get(problemController.getAllProblems)
.post(problemController.createProblem)
.delete(problemController.deleteAllProblem);

router.route('/problems/:id')
.get(problemController.getProblem)
.patch(problemController.updateProblem)
.delete(problemController.deleteProblem);

export default router;