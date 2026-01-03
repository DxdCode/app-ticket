import bcrypt from "bcryptjs";

export namespace Password {
    export async function hash(plainPassword: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(plainPassword, saltRounds);
    }

    export async function verify(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}
