import * as dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
import authRouter from './app/routes/authRouter';
import { credentials } from './config/azureConfig';

dotenv.config();

const app = express();

const sessionConfig: session.SessionOptions = {
    secret: credentials.SESSION_SECRET || 'your-secret-here', 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
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
