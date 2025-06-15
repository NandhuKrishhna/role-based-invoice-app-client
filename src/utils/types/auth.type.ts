export type Role = "SUPER_ADMIN" | "ADMIN" | "UNIT_MANAGER" | "USER";

export interface Auth_User {
    _id?: string;
    name?: string;
    email?: string;
    role?: Role;
    profilePicture?: string;
    accessToken?: string;
};

export interface Auth_State {
    currentUser: Auth_User | null;
};
