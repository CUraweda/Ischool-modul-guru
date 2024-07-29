export interface LoginResponse {
  data: {
    token: string;
    role_id: number;
    id: number;
  };
  tokens: {
    access: {
      token: string;
    };
  };
}
