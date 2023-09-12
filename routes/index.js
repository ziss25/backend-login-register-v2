import express from 'express';
import {
  getUser, //
  Register,
  Login,
  Logout,
  updateProfileAvatar,
  updatename,
} from '../controller/Users.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controller/refreshToken.js';

const router = express.Router();

router.get('/users', verifyToken, getUser);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.patch('/users/avatar/:id', updateProfileAvatar);
router.patch('/users/username/:id', updatename);

export default router;
