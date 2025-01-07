import express from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import upload from '../utils/multer.js';

const router=express.Router();

router.post('/secretAPI/signup',
    authController.signup
);
router.post('/login',
    authController.login
);

router.use(authController.protect);

router.post('/problems/:id/solution',
    upload.single('code'),
    userController.sendSolution
);

router.post('/problems/:id/question',
    userController.sendQuestion
);

router.use(authController.restrictTo('admin'));

router.get('/users',userController.getAllUsers);

router.route('/users/:id')
.patch(userController.updateUser)
.delete(userController.deleteUser);

export default router;