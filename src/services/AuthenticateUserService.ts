import { getCustomRepository } from "typeorm";
import { compare } from "bcryptjs";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { sign } from 'jsonwebtoken';

interface IAuthenticateRequest
{
    email: string;
    password: string;
}

class AuthenticateUserService
{
    async execute({email, password})
    {
        const usersRepositoy = getCustomRepository(UsersRepositories);

        const user = await  usersRepositoy.findOne({email});

        if(!user)
        {
            throw new Error("Email/Password incorrect");
        }

        const passwordMatch = await compare(password, user.password)

        if(!passwordMatch)
        {
            throw new Error("Email/Password incorrect");
        }

        const token = sign(
        {
            email: user.email 
        }, "463374e61b711ac35487055f62b83c43",
        {
            subject:  user.id,
            expiresIn: "1d",
        });

        return token;
    }
};

export { AuthenticateUserService };