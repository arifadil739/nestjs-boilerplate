import { IsUserEmailAlreadyExistConstraint } from "src/user/constraints/user_email_already_exists.constraint";

export const ValidationModule = [IsUserEmailAlreadyExistConstraint];
