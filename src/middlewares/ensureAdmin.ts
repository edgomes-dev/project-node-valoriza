import { Request, Response, NextFunction, request } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepositories } from '../repositories/UsersRepositories';

export async function ensureAdmin(req:Request, res:Response, next: NextFunction)
{
    const { user_id } = request;
    console.log(user_id)

    const usersRepositories = getCustomRepository(UsersRepositories);

    const { admin } = await usersRepositories.findOne(user_id);

    if(admin)
    {
        return next()
    }

    return res.status(401).json({error: "Unauthorized"});
}