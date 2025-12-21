export namespace Password {
    export async function hash(plainPassword: string): Promise<string> {
        return await Bun.password.hash(plainPassword, {
            algorithm: "bcrypt",
            cost: 10,
        });
    }

    export async function verify(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await Bun.password.verify(plainPassword, hashedPassword);
    }
}
