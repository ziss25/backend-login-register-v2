import express from 'express';
import db from './config/database.js';
import Users from './models/UserModel.js';
import router from './routes/index.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import FileUpload from 'express-fileupload';
dotenv.config();

const domain = process.env.ORIGIN_DOMAIN == 'production;' ? 'https://anime-list-app-five.vercel.app' : 'http://localhost:5173';

const app = express();

try {
  await db.authenticate();
  console.log('databse connected');

  await db.sync();
  await Users.sync();
} catch (error) {
  console.error(error);
}

console.log(domain);
app.use(cors({ origin: domain, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(FileUpload());
app.use(router);

app.listen(5000, () => {
  console.log('server at running');
});
