export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  username: string;
  email: string;
  role: string;
  date_joined: string;
  login_histories: [];
}

export interface UserProfileUpdate {
  first_name: string;
  last_name: string;
  phone_number: string;
  role?:string
}

export interface UserProfileUpdate2 {
  user_id: string,
  data: {
    first_name: string;
    last_name: string;
    phone_number: string;
  };
}

export interface CreateUserInterface {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  role: string;
  password: string;
  has_agreed_terms: boolean;
}
