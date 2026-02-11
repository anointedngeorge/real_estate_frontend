export interface userProfile {
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


export interface userProfileUpdate {
  first_name: string;
  last_name: string;
  phone_number: string;
}