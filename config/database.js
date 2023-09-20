import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// di intregasikan lewat cloud mysql -- FreeSQLdatabase
// more detail -- acount survingtesting@gmail.com
dotenv.config();
const db = new Sequelize('bapu8xktpif6wk3hyqdu', 'u78nlyfyynasja4h', 'qTYCEXrOLtWUGP9sIH2g', {
  host: 'bapu8xktpif6wk3hyqdu-mysql.services.clever-cloud.com',
  dialect: 'mysql',
  port: 3306,
});

// const db = new Sequelize('auth_db', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
//   port: 3306,
// });
export default db;
