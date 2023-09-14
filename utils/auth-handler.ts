import * as msal from "@azure/msal-node";
import { credentials } from "../config/azureConfig";

class AuthorizationHandler {
  /**
   * Confidential Client Application Configuration
   */
  confidentialClientConfig: msal.Configuration = {
    auth: {
      clientId: credentials.CLIENT_ID || "",
      authority: credentials.SIGN_UP_SIGN_IN_POLICY_AUTHORITY || "",
      clientSecret: credentials.CLIENT_SECRET || "",
      knownAuthorities: [credentials.AUTHORITY_DOMAIN || ""], // This must be an array
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

  // Initialize MSAL Node
  confidentialClientApplication = new msal.ConfidentialClientApplication(
    this.confidentialClientConfig
  );

  /**
   * Request Configuration
   * We manipulate these two request objects below
   * to acquire a token with the appropriate claims.
   */
  authCodeRequest: msal.AuthorizationCodeRequest = {
    scopes: [], // Add your desired scopes here
    redirectUri: this.confidentialClientConfig.auth.redirectUri,
    code: "", // You can initialize this with an empty string or provide a default value
  };

  tokenRequest: msal.AuthorizationCodeRequest = {
    scopes: [], // Add your desired scopes here
    redirectUri: this.confidentialClientConfig.auth.redirectUri,
    code: "", // You can initialize this with an empty string or provide a default value
  };

  getAuthCode(authority: string, scopes: string[], state: string, res: any) {
    // prepare the request
    console.log("Fetching Authorization code");
    this.authCodeRequest.authority = authority;
    this.authCodeRequest.scopes = scopes;
    this.authCodeRequest.state = state;

    // Each time you fetch Authorization code, update the relevant authority in the tokenRequest configuration
    this.tokenRequest.authority = authority;

    // request an authorization code to exchange for a token
    return this.confidentialClientApplication
      .getAuthCodeUrl(this.authCodeRequest)
      .then((response) => {
        console.log("\nAuthCodeURL: \n" + response);
        // redirect to the auth code URL/send code to
        res.redirect(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  }
}

export default AuthorizationHandler;
