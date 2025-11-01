import z from "zod";

export const loginDto = z.object({
    email: z.email(),
    password: z.string().min(8).transform(val => val.trim()),
});

export type LoginDto = z.infer<typeof loginDto>;