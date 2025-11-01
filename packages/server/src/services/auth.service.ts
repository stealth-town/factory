import { generateToken } from "../auth"
import { LoginDto } from "../dto";

export const login = async (data: LoginDto) => {
    return generateToken({ userId: data.email + ":" + data.password });
}