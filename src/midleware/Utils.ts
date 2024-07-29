export interface LoginResponse {
  data: {
    token: string;
    role_id: number;
    employee?: {
      id: number
      full_name: string
      headmaster?: any
      formteachers?: any[]
      formsubjects?: any[]
      formextras?: any[]
    }
  };
  tokens: {
    access: {
      token: string;
    };
  };
}
