import express from 'express';
import authController from '../controllers/authController.js';

const router=express.Router();

router.post(
    '/GraduationProject/signup',
    authController.signup
);

export default router;