import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { getOrCreateMetric } from './activityController.js';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'healthylife_jwt_secret_key_super_secure_2026';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};


export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Mohon isi nama, email, dan password secara lengkap.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.',
      });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: email.toLowerCase(),
      password,
    });

    await getOrCreateMetric(user._id);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil. Selamat datang di HealthyLife!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Mohon masukkan email dan password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password yang Anda masukkan salah.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password yang Anda masukkan salah.',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Berhasil masuk.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
          role: req.user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
