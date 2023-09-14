import express from 'express';
import passport from '../middleware/authenticationMiddleware';

const router = express.Router();

router.get('/protected', passport.authenticate('azuread-openidconnect', { session: false }), (req, res) => {
  // If the user is authenticated, this route handler will be executed.
  res.send('Authenticated');
});

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
