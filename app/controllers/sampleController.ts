// import { Request, Response } from 'express';
// import { createUser, findUserByEmail } from '../services/sampleServices';

// Controller function for user registration
// export async function registerUser(req: Request, res: Response): Promise<void> {
//   const { username, email, password } = req.body;

//   try {
    // Check if the email is already in use
    // const existingUser = await findUserByEmail(email);
    // if (existingUser) {
    //   res.status(400).json({ error: 'Email is already in use' });
    //   return;
    // }

    // Create a new user
//     const newUser = await createUser({ username, email, password });
//     res.status(201).json(newUser);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to register user' });
//   }
// }
