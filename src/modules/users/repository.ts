import UserSchema from "./schema"
import CreateUserInterface from "./Interfaces/create-user.interface"

export default class UserRepository {

    async createUser(user: CreateUserInterface) {
        try {
            const createdUser = await UserSchema.create(user)

            return createdUser
        }
        catch (err) {
            throw new Error("Error on Create User")
        }
    }

    async updateUser(update: Partial<CreateUserInterface>, userId: any) {
        try {
            const updatedUser = await UserSchema.findByIdAndUpdate(userId, update)

            return updatedUser
        }
        catch (err) {
            throw new Error("Error on Update User")
        }
    }

    async getUserById(userId: string) {
        try {
            const user = await UserSchema.findById(userId)

            return user
        }
        catch (err) {
            throw new Error("Error Finding User at Bank")

        }
    }

    async getAllUsers() {
        try {
            const users = await UserSchema.find()

            return users
        }
        catch (err) {
            throw new Error("Error Finding Users")
        }
    }
}
