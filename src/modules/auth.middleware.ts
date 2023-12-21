import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const decodedToken = this.authService.verifyToken(token);
    if (!decodedToken) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    req['user'] = decodedToken;
    next();
  }
}
