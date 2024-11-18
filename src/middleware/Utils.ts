export interface LoginResponse {
  data: {
    token: string;
    role_id: number;
    id: number;
    employee?: {
      id: number;
      full_name: string;
      headmaster?: any;
      formteachers?: any[];
      formsubjects?: any[];
      formextras?: any[];
      is_asessor?: boolean;
    };
  };
  tokens: {
    access: {
      token: string;
    };
  };
}
