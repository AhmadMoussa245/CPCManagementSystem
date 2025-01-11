import express from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';

const router=express.Router();

router.post('/secretAPI/signup',
    authController.signup
);
router.post('/login',
    authController.login
);

router.use(authController.protect);

router.post('/problems/:id/sendQuestion',
    userController.sendQuestion
);

router.get('/users',
    authController.restrictTo('admin'),
    userController.getAllUsers,
);

router.route('/users/:id')
.patch(
    authController.restrictTo('admin'),
    userController.updateUser,
)
.delete(
    authController.restrictTo('admin'),
    userController.deleteUser,
);

export default router;