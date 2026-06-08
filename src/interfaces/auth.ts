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
  is_active: boolean;
  account_name?: string,
  bank_name?: string,
  bank_type?: string,
  bank_number?:string,
  referral_code?:string,
  permissions: Record<string, { id: string, name: string }[]>;
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
    account_name?: string,
    bank_name?: string,
    bank_type?: string,
    bank_number?:string
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
