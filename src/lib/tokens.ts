import { v4 as uuidv4 } from "uuid";
import { date } from "zod";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import db from "@/lib/db";

export const generateVerificationToken = async (email: string) => {
    //generate actual token using uuid
    const token = uuidv4();
    const expires = new Date(new Date().getTime()+3600*1000); // 1 hour from now

    const existingToken = await getVerificationTokenByEmail(email);
    if(existingToken){
        await db.verificationToken.delete({
            where:{
                id: existingToken.id
            },
        })
    }
    const verificationToken = await db.verificationToken.create({
        data: {
            token,
            email,
            expires,
        },
    });

    return verificationToken;
}