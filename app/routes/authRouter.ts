import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

router.get('/', authController.renderSignIn);
router.get("/redirect", authController.handleRedirect);
router.get('/signin', authController.handleSignIn);
router.get('/password', authController.handlePasswordReset);
router.get('/profile', authController.handleProfileUpdate);
router.get('/signout', authController.handleSignOut);

export default router;
