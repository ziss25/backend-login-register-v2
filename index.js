import express from 'express';
import db from './config/database.js';
import Users from './models/UserModel.js';
import router from './routes/index.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import FileUpload from 'express-fileupload';
dotenv.config();

const app = express();

try {
  await db.authenticate();
  console.log('databse connected');

  await db.sync();
  await Users.sync();
} catch (error) {
  console.error(error);
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true); // Jika Anda ingin mengizinkan kredensial (cookie)
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(FileUpload());
app.use(express.static('public'));

app.use(router);

app.listen(5000, () => {
  console.log('server at running');
});

// backend udah selesai
