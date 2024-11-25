import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  emailVerified: z.boolean().default(false),
  verificationToken: z.string().optional(),
  verificationExpires: z.date().optional(),
  userType: z.enum(["buyer", "seller"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;