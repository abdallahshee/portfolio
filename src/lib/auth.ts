import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from '../db/index';
import 'better-auth'; // or 'next-auth'



export const auth = betterAuth({
   database: drizzleAdapter(db, { 
    provider: "pg", // or "pg" or "mysql"
  }), 
   user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false, // users can't set their own role
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
})

