export type UserRoleType = "admin" | "user";

export type UserType = {
  _id: string;
  name: string;
  password: string;
  email: string;
  role: UserRoleType;
};
export type UsersType = UserType[];
