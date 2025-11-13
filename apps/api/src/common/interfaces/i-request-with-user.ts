import { Request } from 'express';
export interface IRequestWithUser extends Request {
  clerkUserId: string;
}