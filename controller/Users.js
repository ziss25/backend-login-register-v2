import Users from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const uploadImage = (img) => {
  let body = new FormData();
  body.set('key', '96e33ee020bf1e5bf73c9463e965823e');
  body.append('image', img.data.toString('base64'));

  return axios({
    method: 'post',
    url: 'https://api.imgbb.com/1/upload',
    data: body,
  });
};

export const getUser = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['id', 'name', 'email', 'role', 'avatar_url'],
    });
    res.json(users);
  } catch (error) {
    console.log(erorr);
  }
};

export const Register = async (req, res) => {
  const { name, username, password, confPassword, role, avatar_image, avatar_url } = req.body;
  if (password !== confPassword) return res.status(400).json({ msg: 'password dan confirmPassword tidak cocok' });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await Users.create({
      name,
      username,
      role,
      avatar_image,
      avatar_url,
      password: hashPassword,
    });
    res.json({ msg: 'register berhasil' });
  } catch (err) {
    console.log(err);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        username: req.body.username,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: 'wrong password' });
    const userId = user[0].id;
    const name = user[0].name;
    const username = user[0].username;
    const role = user[0].role;
    const avatar_image = user[0].avatar_image;
    const avatar_url = user[0].avatar_url;
    console.log(avatar_image);
    const accessToken = jwt.sign(
      {
        userId,
        name,
        username, //
        role,
        avatar_image,
        avatar_url,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '15s',
      }
    );
    const refreshToken = jwt.sign(
      {
        userId,
        name, //
        username,
        role,
        avatar_image,
        avatar_url,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'None', // Mengizinkan cookie lintas situs
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: 'username tidak ditemukan' });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );

  res.clearCookie('refreshtoken');
  return res.sendStatus(200);
};

export const updateProfileAvatar = async (req, res) => {
  try {
    // get data from api kita
    const imageFile = req.files.file;

    // cek jika tidak ada file di dalam nya
    if (!imageFile) {
      return res.status(400).json({ message: 'Gambar tidak ditemukan dalam form data.' });
    }

    // Kirim gambar ke Imgbb
    const imgbbResponse = await uploadImage(imageFile);
    const { title, url } = imgbbResponse.data.data;
    await Users.update(
      { avatar_image: title, avatar_url: url },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.json({ msg: 'image berhasil di upload', url: url });
    console.log(url);
  } catch (error) {
    console.error('Gagal mengunggah gambar ke Imgbb:', error.message);
  }
};

export const updatename = async (req, res) => {
  const user = await Users.findOne({
    where: {
      id: req.params.id,
    },
  });

  const newName = req.body.newname;
  try {
    await Users.update(
      { name: newName },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: 'username success update' });
  } catch (error) {
    console.log(error.message);
  }
};
