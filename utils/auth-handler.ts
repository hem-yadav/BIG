import * as msal from "@azure/msal-node";
import { credentials } from "../config/azureConfig";

class AuthorizationHandler {
  confidentialClientConfig: msal.Configuration = {
    auth: {
      clientId: credentials.CLIENT_ID || "",
      authority: credentials.SIGN_UP_SIGN_IN_POLICY_AUTHORITY || "",
      clientSecret: credentials.CLIENT_SECRET || "",
      knownAuthorities: [credentials.AUTHORITY_DOMAIN || ""], 
      redirectUri: credentials.APP_REDIRECT_URI || "",
    },
    system: {
      loggerOptions: {
        loggerCallback(loglevel, message, containsPii) {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Verbose,
      },
    },
  };
  
  confidentialClientApplication = new msal.ConfidentialClientApplication(
    this.confidentialClientConfig
  );

  authCodeRequest: msal.AuthorizationCodeRequest = {
    scopes: [], 
    redirectUri: this.confidentialClientConfig.auth.redirectUri,
    code: "", 
  };

  tokenRequest: msal.AuthorizationCodeRequest = {
    scopes: [], 
    redirectUri: this.confidentialClientConfig.auth.redirectUri,
    code: "", 
  };

  getAuthCode(authority: string, scopes: string[], state: string, res: any) {
    
    console.log("Fetching Authorization code");
    this.authCodeRequest.authority = authority;
    this.authCodeRequest.scopes = scopes;
    this.authCodeRequest.state = state;    
    this.tokenRequest.authority = authority;
    
    return this.confidentialClientApplication
      .getAuthCodeUrl(this.authCodeRequest)
      .then((response) => {
        console.log("\nAuthCodeURL: \n" + response);
        
        res.redirect(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  }
}

export default AuthorizationHandler;
