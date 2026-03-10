import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";

export const auth = () => getServerSession(authOptions);
