import User from "../model/user.js"
import bcrypt from 'bcrypt';

export const signUp = async (request, response) => {
    try {
        const { number, password } = request.body;

        let exist = await User.findOne({ number });
        if (exist) {
            let res = {
                status: false,
                message: "User already exists"
            };
            return response.status(200).json(res);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        // Create a new user with hashed password
        const newUser = new User({
            ...request.body,
            password: hashedPassword
        });

        await newUser.save();
        let res = {
            status: true,
            message: "User created successfully",
            data: newUser
        };
        return response.status(200).json(res);
    } catch (error) {
        let res = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return response.status(500).json(res);
    }
}

export const logIn = async (request, response) => {
    try {
        const { number, password } = request.body;

        const user = await User.findOne({ number });

        if (!user) {
            let res = {
                status: false,
                message: "User not found against this number"
            };
            return response.status(404).json(res);
        }

        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            let res = {
                status: false,
                message: "Invalid password"
            };
            return response.status(401).json(res);
        }

        let res = {
            status: true,
            message: "Login successful",
            data: user
        };
        return response.status(200).json(res);
    } catch (error) {
        let res = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return response.status(500).json(res);
    }
}
export const checkUser = async (request, response) => {
    try {
        const { number } = request.body;

        const user = await User.findOne({ number });

        if (user) {
            return response.status(200).json({
                status: true,
                message: "User exists",
                data: user
            });
        } else {
            return response.status(404).json({
                status: false,
                message: "User does not exist"
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
}
export const updatePassword = async (request, response) => {
    try {
        const { number, password } = request.body;
        const user = await User.findOne({ number });

        if (!user) {
            let res = {
                status: false,
                message: "User not found"
            };
            return response.status(404).json(res);
        }

        const hashedNewPassword = await bcrypt.hash(password, 10);

        user.password = hashedNewPassword;
        await user.save();

        let res = {
            status: true,
            message: "Password updated successfully",
        };
        return response.status(200).json(res);
    } catch (error) {
        let res = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return response.status(500).json(res);
    }
}
