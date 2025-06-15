import type { Role } from "./auth.type";

export interface IGetAllUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
    status?: "blocked" | "active";
    group?: string;
    sortBy?: "name" | "email" | "role" | "status";
    sortOrder?: "asc" | "desc";
    createdBy?: string;
}

export type User = {
    _id: string;
    name: string;
    email: string;
    role: Role
    group: string | null;
    status: 'active' | 'inactive';
    profilePicture: string;
    createdBy: string | null;
    createdAt: string;
    updatedAt: string;
};

export type GetAllUserResponse = {
    _id: string;
    name: string;
    email: string;
    role: Role;
    group: string | null;
    status: 'active' | 'inactive';
    profilePicture: string;
    createdBy: string | {
        _id: string;
        name: string;
        email: string;
        role: Role;
    } | null;
    createdAt: string;
    updatedAt: string;
};

export type CreateAdminType = {
    name: string;
    email: string;
    password: string;
    role: Role;
    group?: string;
};