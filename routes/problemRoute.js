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
.post(problemController.createProblem,
    authController.restrictTo('admin')
)
.delete(problemController.deleteAllProblems,
    authController.restrictTo('admin')
);

router.route('/problems/:id')
.patch(problemController.updateProblem,
    authController.restrictTo('admin')
)
.delete(problemController.deleteProblem,
    authController.restrictTo('admin')
);

export default router;