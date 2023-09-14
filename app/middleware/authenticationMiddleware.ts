import passport from 'passport';
import { OIDCStrategy, IProfile, VerifyCallback } from 'passport-azure-ad';
import { AzureConfig } from '../../config/azureConfig';

// Passport setup
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

const azureADStrategy = new OIDCStrategy(
  {
    identityMetadata: `https://login.microsoftonline.com/${AzureConfig.TENANT_ID}/v2.0/.well-known/openid-configuration`,
    clientID: AzureConfig.CLIENT_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: AzureConfig.APP_REDIRECT_URI,
    allowHttpForRedirectUrl: true,
    clientSecret: AzureConfig.CLIENT_SECRET,
    passReqToCallback: false,
  },
  (iss: string, sub: string, profile: IProfile, accessToken: string, refreshToken: string, done: VerifyCallback) => {
    return done(null, profile);
  }
);

passport.use(azureADStrategy);

export default passport;
