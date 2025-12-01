import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
    basePath: "/api/better-auth",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema 
    }),
    emailAndPassword: {
        enabled: true,
        maxPasswordLength: 32,
        minPasswordLength: 8,
    }
});