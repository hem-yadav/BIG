// import express, { Request, Response } from "express";
// import session from "express-session";
// import { engine } from "express-handlebars";
// import Auth from "./utils/auth-handler";
// import Users from "./utils/Users";
// import {
//   Configuration,
//   ConfidentialClientApplication,
//   AuthorizationCodeRequest,
//   AccountInfo,
//   AuthenticationResult,
// } from "@azure/msal-node";

// require("dotenv").config();

// const APP_STATES = {
//   LOGIN: "login",
//   LOGOUT: "logout",
//   PASSWORD_RESET: "password_reset",
//   EDIT_PROFILE: "update_profile",
// };

// type SessionParams = {
//   user: AccountInfo | null; // Update type to allow for null
//   idToken: string | null; // Update type to allow for null
// };

// declare module "express-session" {
//   interface SessionData {
//     sessionParams: SessionParams;
//   }
// }

// const app = express();
// const auth = new Auth();

// const sessionConfig: session.SessionOptions = {
//   secret: process.env.SESSION_SECRET || "",
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false, // set this to true on production
//   },
// };

// app.engine(".hbs", engine({ extname: ".hbs" }));
// app.set("view engine", ".hbs");
// app.set("views", "./views");

// app.use(session(sessionConfig));

// app.get("/", (req: Request, res: Response) => {
//   res.render("signin", { showSignInButton: true });
// });

// app.get("/signin", (req: Request, res: Response) => {
//   auth.getAuthCode(
//     process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY || "",
//     [],
//     APP_STATES.LOGIN,
//     res
//   );
// });

// app.get("/password", (req: Request, res: Response) => {
//   auth.getAuthCode(
//     process.env.RESET_PASSWORD_POLICY_AUTHORITY || "",
//     [],
//     APP_STATES.PASSWORD_RESET,
//     res
//   );
// });

// app.get("/profile", (req: Request, res: Response) => {
//   auth.getAuthCode(
//     process.env.EDIT_PROFILE_POLICY_AUTHORITY || "",
//     [],
//     APP_STATES.EDIT_PROFILE,
//     res
//   );
// });

// app.get("/signout", async (req: Request, res: Response) => {
//   const logoutUri = process.env.LOGOUT_ENDPOINT || "";
//   req.session?.destroy(() => {
//     res.redirect(logoutUri);
//   });
// });

// app.get("/redirect", async (req: Request, res: Response) => {
//     if (req.query.state === APP_STATES.LOGIN) {
//       const tokenRequest: AuthorizationCodeRequest = {
//         scopes: [], // Add your desired scopes here
//         redirectUri:
//           auth.confidentialClientConfig.auth.redirectUri ||
//           process.env.APP_REDIRECT_URI ||
//           "",
//         code: req.query.code as string,
//       };
  
//       try {
//         const response = await auth.confidentialClientApplication.acquireTokenByCode(tokenRequest);
//         req.session!.sessionParams = {
//           user: response.account,
//           idToken: response.idToken,
//         };
//         console.log("\nAuthToken: \n" + JSON.stringify(response));
//         res.render("signin", {
//           showSignInButton: false,
//           givenName: response.account?.username || "", // Update to use optional chaining
//         });
//       } catch (error) {
//         console.log("\nErrorAtLogin: \n" + error);
//       }
//     } else if (req.query.state === APP_STATES.PASSWORD_RESET) {
//       if (req.query.error) {
//         if (JSON.stringify(req.query.error_description).includes("AADB2C90091")) {
//           res.render("signin", {
//             showSignInButton: false,
//             givenName:
//               req.session?.sessionParams?.user?.username || "", // Update to use optional chaining
//             message: "User has canceled the operation",
//           });
//         }
//       } else {
//         res.render("signin", {
//           showSignInButton: false,
//           givenName:
//             req.session?.sessionParams?.user?.username || "", // Update to use optional chaining
//         });
//       }
//     } else if (req.query.state === APP_STATES.EDIT_PROFILE) {
//       auth.tokenRequest.scopes = [];
//       auth.tokenRequest.code = req.query.code as string;
  
//       try {
//         const response = await auth.confidentialClientApplication.acquireTokenByCode(auth.tokenRequest);
//         req.session!.sessionParams = {
//           user: response.account,
//           idToken: response.idToken,
//         };
//         console.log("AuthToken: \n" + JSON.stringify(response));
//         res.render("signin", {
//           showSignInButton: false,
//           givenName: response.account?.username || "", // Update to use optional chaining
//         });
//       } catch (error) {
//         // Handle error
//       }
//     } else {
//       res.status(500).send("We do not recognize this response!");
//     }
//   });
  
  
// app.get("/users/get", async (req: Request, res: Response) => {
//   try {
//     const result = await new Users().getUsersAll();
//     res.json(result);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Failed to fetch users from Azure AD B2C" });
//   }
// });

// app.get("/users/add", async (req: Request, res: Response) => {
//   try {
//     const result = await new Users().createUser();
//     res.json(result);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Failed to add user in Azure AD B2C" });
//   }
// });

// app.get("/users/update", async (req: Request, res: Response) => {
//   try {
//     await new Users().updateUser();
//     res.json("user updated successfully");
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Failed to update user in Azure AD B2C" });
//   }
// });

// const port = process.env.SERVER_PORT || 3000;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


// index.ts
import * as dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
import authRouter from './app/routes/authRouter';
import { credentials } from './config/azureConfig';

dotenv.config();

const app = express();

const sessionConfig: session.SessionOptions = {
    secret: credentials.SESSION_SECRET || 'your-secret-here', // Provide a secret or use a default value
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set this to true on production
    },
  };

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(session(sessionConfig));
app.use('/', authRouter);

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
