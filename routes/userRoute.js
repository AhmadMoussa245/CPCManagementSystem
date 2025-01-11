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

router.post('/problems/:id/question',
    userController.sendQuestion
);

router.use(authController.restrictTo('admin'));

router.get('/users',
    userController.getAllUsers,
    authController.restrictTo('admin')
);

router.route('/users/:id')
.patch(userController.updateUser,
    authController.restrictTo('admin')
)
.delete(userController.deleteUser,
    authController.restrictTo('admin')
);

export default router;