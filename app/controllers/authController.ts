import { Request, Response } from 'express';
import Auth from '../../utils/auth-handler';
import Users from '../../utils/Users';
import { AuthorizationCodeRequest } from "@azure/msal-node";
import { credentials } from '../../config/azureConfig';
import session from 'express-session';
import { AccountInfo } from "@azure/msal-node";

declare module 'express-session' {
    interface SessionData {
        sessionParams: {
            user: AccountInfo | null;
            idToken: string | null;
        };
    }
}

const APP_STATES = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    PASSWORD_RESET: 'password_reset',
    EDIT_PROFILE: 'update_profile',
};

const auth = new Auth();

export const renderSignIn = (req: Request, res: Response) => {
    res.render("signin", { showSignInButton: true });
};

export const handleSignIn = async (req: Request, res: Response) => {
    try {
        const auth = new Auth();
        const APP_STATES = {
            LOGIN: 'login', 
        };

        const redirectUrl = credentials.SIGN_UP_SIGN_IN_POLICY_AUTHORITY;
        
        auth.getAuthCode(redirectUrl, [], APP_STATES.LOGIN, res);

    } 
    catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).send('An error occurred during sign-in.');
    }
};

export const handlePasswordReset = async (req: Request, res: Response) => {
  try {
      auth.getAuthCode(
          credentials.RESET_PASSWORD_POLICY_AUTHORITY || "",
          [],
          APP_STATES.PASSWORD_RESET,
          res
      );
  } catch (error) {
      console.error('Error during password reset:', error);
      res.status(500).send('An error occurred during password reset.');
  }
};

export const handleProfileUpdate = async (req: Request, res: Response) => {
  try {
      auth.getAuthCode(
          credentials.EDIT_PROFILE_POLICY_AUTHORITY || "",
          [],
          APP_STATES.EDIT_PROFILE,
          res
      );
  } catch (error) {
      console.error('Error during profile update:', error);
      res.status(500).send('An error occurred during profile update.');
  }
};

export const handleSignOut = (req: Request, res: Response) => {
    try {
        const logoutUri = credentials.LOGOUT_ENDPOINT || '';
        req.session?.destroy(() => {
            res.redirect(logoutUri);
        });
    } 
    catch (error) {
        console.error('Error during sign-out:', error);
        res.status(500).send('An error occurred during sign-out.');
    }
};

export const handleRedirect = async (req: Request, res: Response) => {
    if (req.query.state === APP_STATES.LOGIN) {
      const tokenRequest: AuthorizationCodeRequest = {
        scopes: [],
        redirectUri:
          auth.confidentialClientConfig.auth.redirectUri ||
          credentials.APP_REDIRECT_URI ||
          "",
        code: req.query.code as string,
      };
  
      try {
        const response = await auth.confidentialClientApplication.acquireTokenByCode(
          tokenRequest
        );
        req.session!.sessionParams = {
          user: response.account,
          idToken: response.idToken,
        };
        console.log("\nAuthToken: \n" + JSON.stringify(response));
        res.render("signin", {
          showSignInButton: false,
          givenName: response.account?.username || "",
        });
      } catch (error) {
        console.log("\nErrorAtLogin: \n" + error);
      }
    } else if (req.query.state === APP_STATES.PASSWORD_RESET) {
      if (req.query.error) {
        if (
          JSON.stringify(req.query.error_description).includes("AADB2C90091")
        ) {
          res.render("signin", {
            showSignInButton: false,
            givenName:
              req.session?.sessionParams?.user?.username || "",
            message: "User has canceled the operation",
          });
        }
      } else {
        res.render("signin", {
          showSignInButton: false,
          givenName:
            req.session?.sessionParams?.user?.username || "",
        });
      }
    } else if (req.query.state === APP_STATES.EDIT_PROFILE) {
      auth.tokenRequest.scopes = [];
      auth.tokenRequest.code = req.query.code as string;
  
      try {
        const response = await auth.confidentialClientApplication.acquireTokenByCode(
          auth.tokenRequest
        );
        req.session!.sessionParams = {
          user: response.account,
          idToken: response.idToken,
        };
        console.log("AuthToken: \n" + JSON.stringify(response));
        res.render("signin", {
          showSignInButton: false,
          givenName: response.account?.username || "",
        });
      } 
      catch (error) {
      }
    } else {
      res.status(500).send("We do not recognize this response!");
    }
};
  
export const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await new Users().getUsersAll();
        res.json(result);
    } 
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to fetch users from Azure AD B2C" });
    }
};

export const addUser = async (req: Request, res: Response) => {
    try {
        const result = await new Users().createUser();
        res.json(result);
    } 
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to add user in Azure AD B2C" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        await new Users().updateUser();
        res.json("user updated successfully");
    } 
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to update user in Azure AD B2C" });
    }
};
