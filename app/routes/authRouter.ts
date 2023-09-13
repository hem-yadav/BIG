import express from 'express';
import passport from '../middleware/authenticationMiddleware';

const router = express.Router();

router.get('/login', passport.authenticate('azuread-openidconnect'));

router.post(
  '/auth/callback',
  passport.authenticate('azuread-openidconnect', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

export default router;
