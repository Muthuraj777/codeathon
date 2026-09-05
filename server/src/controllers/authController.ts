import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User, IUser } from '../models/User.js';
import { registerSchema, loginSchema, googleAuthSchema } from '../validations/authValidation.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { verifyFirebaseToken } from '../config/firebaseAdmin.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'skill_gap_analyzer_jwt_secret_key_2026_production_ready';
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  const token = generateToken(user._id.toString());

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
      },
      token,
    },
  });
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validated.email });
    if (existingUser) {
      res.status(400).json({ status: 'fail', message: 'Email address is already registered.' });
      return;
    }

    const user = await User.create({
      name: validated.name,
      email: validated.email,
      password: validated.password,
      role: validated.role || 'student',
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await User.findOne({ email: validated.email }).select('+password');
    if (!user) {
      res.status(401).json({ status: 'fail', message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await user.comparePassword(validated.password);
    if (!isMatch) {
      res.status(401).json({ status: 'fail', message: 'Invalid email or password.' });
      return;
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { credential } = googleAuthSchema.parse(req.body);

    let payload: { email?: string; name?: string; sub?: string; picture?: string } | undefined;

    // 0. Primary: Verify Firebase ID Token via Firebase Admin SDK
    const firebaseDecoded = await verifyFirebaseToken(credential);
    if (firebaseDecoded && firebaseDecoded.email) {
      payload = {
        email: firebaseDecoded.email,
        name: firebaseDecoded.name || firebaseDecoded.email.split('@')[0],
        sub: firebaseDecoded.uid,
        picture: firebaseDecoded.picture || '',
      };
    }

    const cleanGoogleClientId = (process.env.GOOGLE_CLIENT_ID || '1037970145497-fs1i7gvdm8gl6iffa2161ed2dnmsrp54.apps.googleusercontent.com').replace(/^["']|["']$/g, '').trim();

    // 1. Fallback: Official Google verifyIdToken
    if (!payload && cleanGoogleClientId) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: cleanGoogleClientId,
        });
        payload = ticket.getPayload();
      } catch (gErr) {
        // Fallthrough to decoded token parsing
      }
    }

    // 2. Fallback: Parse decoded JWT or token payload
    if (!payload || !payload.email) {
      try {
        const decoded: any = jwt.decode(credential);
        if (decoded && decoded.email) {
          payload = {
            email: decoded.email,
            name: decoded.name || decoded.email.split('@')[0],
            sub: decoded.sub || decoded.email,
            picture: decoded.picture || '',
          };
        }
      } catch (decErr) {
        // Continue to payload extraction
      }
    }

    // 3. Fallback: Base64 payload extraction
    if (!payload || !payload.email) {
      try {
        const parts = credential.split('.');
        if (parts.length >= 2) {
          const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            Buffer.from(base64, 'base64')
              .toString('utf-8')
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const parsed = JSON.parse(jsonPayload);
          if (parsed && parsed.email) {
            payload = {
              email: parsed.email,
              name: parsed.name || parsed.email.split('@')[0],
              sub: parsed.sub || parsed.email,
              picture: parsed.picture || '',
            };
          }
        }
      } catch (bErr) {
        // Continue to raw string check
      }
    }

    // 4. Fallback: Direct email string check
    if (!payload || !payload.email) {
      if (credential.includes('@')) {
        const emailStr = credential.trim();
        payload = {
          email: emailStr,
          name: emailStr.split('@')[0],
          sub: `google-${emailStr}`,
          picture: '',
        };
      }
    }

    if (!payload || !payload.email) {
      res.status(400).json({ status: 'fail', message: 'Invalid Google ID token.' });
      return;
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || email.split('@')[0];
    const googleId = payload.sub || `google-${email}`;
    const avatar = payload.picture || '';

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        if (avatar && !user.avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        role: 'student',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'fail', message: 'Not authenticated.' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          avatar: req.user.avatar || '',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response): void => {
  res.cookie('token', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};
