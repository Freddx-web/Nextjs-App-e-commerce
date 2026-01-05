/**
 * File: /home/ubuntu/ecommerce_app/nextjs_space/app/api/auth/[...nextauth]/route.ts
 * Description: Endpoint para autenticar usuarios
 * Author: Danny Lopez 
 * Date: 2026-01-05
 * Version: 1.0.0
 * License: MIT
 * Copyright: 2026
 */
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
