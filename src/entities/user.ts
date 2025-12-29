import bcrypt from 'bcrypt'

export interface IUser {
    id: number
    name: string
    email: string
    role: string
    password: string
    created_at: Date
    updated_at: Date
}

export class User {
    id: number
    name: string
    email: string
    role: string
    password: string
    created_at: Date
    updated_at: Date

    constructor(user: IUser) {
        this.id = user.id
        this.name = user.name
        this.email = user.email
        this.password = user.password
        this.role = user.role
        this.created_at = user.created_at
        this.updated_at = user.updated_at
    }

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    toSafe() {
        const { password, ...rest } = this
        return rest
    }
}