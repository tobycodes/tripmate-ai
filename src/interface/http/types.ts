import { User } from 'src/application/user/user.entity';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
