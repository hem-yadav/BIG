import express, { Request, Response } from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import cors from 'cors';
import passport from './app/middleware/authenticationMiddleware'; // Update the path to your authenticationMiddleware file
import authRoutes from './app/routes/authRouter'; // Update the path to your authRoutes file
import { AzureConfig } from './config/azureConfig';
// import { generateEncryptionKeys } from './utils/crypto'; // Import encryption config

// const { encryptionKeyBase64, ivBase64 } = generateEncryptionKeys();

const app = express();
const port = 3000;

app.use(
  session({
    secret: AzureConfig.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
app.use('/auth', authRoutes);


app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
