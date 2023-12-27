import CreateUserInterface from "./Interfaces/create-user.interface";
import UserRepository from "./repository";
import UserSchema from "./schema"
import encodePassword from "../../infra/utils/encodePassword";

export default class UserService {

    private userRepository: UserRepository

    constructor() {
        this.userRepository = new UserRepository();
    }

    async upSert(user: CreateUserInterface) {

        const userExists = await UserSchema.findOne({ email: user.email })

        if (!userExists) {

            const userToCreate = {
                name: user.name,
                email: user.email,
                password: encodePassword(user.password),
                whatsapp: user.whatsapp,
                type: user.type
            }

            const created = await this.userRepository.createUser(userToCreate)
            if (!created)
                throw new Error("Error on Create User")

            return created
        }
        const userId = userExists?._id
        user.password = encodePassword(user.password)
        const updated = await this.userRepository.updateUser(user, userId)

        if (!updated)
            throw new Error("Error on Update User")

        return updated
    }

    async getUserById(id: string) {

        const userFound = await this.userRepository.getUserById(id)

        if (!userFound)
            throw new Error("Error Finding User")

        return userFound
    }

    async getAllUsers() {
        const users = await this.userRepository.getAllUsers()

        if (!users)
            throw new Error("Error Finding Users")


        return users
    }
}

