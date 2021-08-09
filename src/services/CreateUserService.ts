import { UsersRepositories } from "../repositories/UsersRepositories";
import { getCustomRepository } from "typeorm";
import { hash } from 'bcryptjs';

interface IUserRequest 
{
    name: string;
    email: string;
    admin?: boolean;
    password: string; 
} 

class CreateUserService 
{
    async execute({name, email, admin = false, password} : IUserRequest) 
    {
        const userRepositoy = getCustomRepository(UsersRepositories);

        if(!email) 
        {
            throw new Error("Email incorrect");
        }

        const userAlreadyExists = await userRepositoy.findOne({email});

        if(userAlreadyExists)
        {
            throw new Error("User already exists");
        }

        const passwordHash = await hash(password, 8);

        const user = userRepositoy.create(
        {
            name,
            email,
            admin,
            password: passwordHash
        })

        await userRepositoy.save(user);

        return user;
    }
}

export { CreateUserService };