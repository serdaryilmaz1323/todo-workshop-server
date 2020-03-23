export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  imageURL?: string;
  provider: 'mail' | 'gmail';
  isVerified: boolean;
}
