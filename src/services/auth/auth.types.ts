export type TUser = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  email_verified_at: null | string;
  created_at: string;
  updated_at: string;
};

export type TLoginResponse = {
  user: TUser;
  token: string;
};

export type TLoginRequest = {
  email: string;
  password: string;
};
