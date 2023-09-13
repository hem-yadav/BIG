"use strict";
// authenticationMiddleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_azure_ad_1 = require("passport-azure-ad");
const azureConfig_1 = require("../../config/azureConfig");
// Passport setup
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((obj, done) => {
    done(null, obj);
});
// Azure AD Strategy (OIDCStrategy)
const azureADStrategy = new passport_azure_ad_1.OIDCStrategy({
    identityMetadata: `https://login.microsoftonline.com/${azureConfig_1.AzureConfig.TENANT_ID}/v2.0/.well-known/openid-configuration`,
    clientID: azureConfig_1.AzureConfig.CLIENT_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: azureConfig_1.AzureConfig.APP_REDIRECT_URI,
    allowHttpForRedirectUrl: true,
    clientSecret: azureConfig_1.AzureConfig.CLIENT_SECRET,
    passReqToCallback: false,
    useCookieInsteadOfSession: true,
    cookieEncryptionKeys: [
        {
            key: 'your-encryption-key',
            iv: 'your-encryption-iv',
        },
    ],
}, (iss, sub, profile, accessToken, refreshToken, done) => {
    return done(null, profile);
});
passport_1.default.use(azureADStrategy);
exports.default = passport_1.default;
