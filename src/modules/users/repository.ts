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

    async getUserByEmail(email: string): Promise<any> {
        try {
            const user = await UserSchema.findOne({ email: email, isDeleted: false })

            return user
        }
        catch (err) {
            return false
        }
    }

    async getUsers(filter: string, skip: any, limit: any): Promise<any> {
        try {
            filter = filter || ""
            return UserSchema.find({
                $or: [
                    { email: new RegExp('.*' + filter + '.*', 'i') },
                    { name: new RegExp('.*' + filter + '.*', 'i') },
                    { whatsapp: new RegExp('.*' + filter + '.*', 'i') }
                ],
                $and: [
                    { isDeleted: false }
                ]
            })
                .skip(skip || 0)
                .limit(limit || 0)
                .then(
                    (o) => {
                        return o
                    }
                )
                .catch(
                    (e: any) => {
                        console.log("Error Finding Users")
                        return null
                    }
                )
        }
        catch (err) {
            console.log(err)
            return err
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

    async getWorkersByOwner(ownerId: string) {
        try {
            const workers = await UserSchema.find(
                {
                    $and: [
                        { owner: ownerId },
                        { isDeleted: false },
                        { type: "worker" }
                    ]
                }
            )

            return workers
        }
        catch (err) {
            throw new Error("Error Finding Users")
        }
    }
}
