import { store } from "@/redux/store";
import { Role } from "./contants";

export const getCurrentUserRole = () => {
  const state = store.getState();
  return state.auth.currentUser?.role;
};

export const getCurrentUserId = () => {
  const state = store.getState();
  return state.auth.currentUser?._id;
};
export const getCreatedRole = (creatorRole?: Role): Role => {
  switch (creatorRole) {
    case Role.SUPER_ADMIN:
      return Role.ADMIN;
    case Role.ADMIN:
      return Role.UNIT_MANAGER;
    case Role.UNIT_MANAGER:
      return Role.USER;
    default:
      throw new Error("Invalid or missing creator role");
  }
};

