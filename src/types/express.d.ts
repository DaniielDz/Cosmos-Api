import { UserRole } from 'generated/prisma/enums';

declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      role: UserRole;
    }
  }
}
