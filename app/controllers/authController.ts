// // authController.ts

// import { Request, Response } from 'express';

// // Controller function for displaying user information after authentication
// export function displayUserInfo(req: Request, res: Response): void {
//   // Check if the user is authenticated
//   if (!req.isAuthenticated()) {
//     res.status(401).json({ error: 'Unauthorized' });
//     return;
//   }

//   // User is authenticated, you can access user information from req.user
//   const user = req.user;

//   // You can customize the response as needed, for example, returning user data
//   res.json({
//     message: 'User information',
//     user: {
//       username: user.displayName || user.userPrincipalName,
//       email: user.emails ? user.emails[0] : '',
//     },
//   });
// }

// // Add more authentication-related controller logic here as needed
