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

export const facebookLoginSignup = async (request, response) => {
    try {
        const { userID, firstName, lastName, imageURL } = request.body;

        // Check if the user already exists by their Facebook userID
        let existingUser = await User.findOne({ number: userID });

        if (existingUser) {
            // User already exists, return a success response
            let res = {
                status: true,
                message: "Logged in successfully",
                data: existingUser,
            };
            return response.status(200).json(res);
        }

        // User doesn't exist, create a new user with Facebook data
        const newUser = new User({
            fName: firstName,
            lName: lastName,
            number: userID, // Using Facebook userID as the number (you might want to validate this)
            image: imageURL,
            fbUser: true, // Set fbUser to true
        });

        await newUser.save();

        let res = {
            status: true,
            message: "User created and logged in successfully",
            data: newUser,
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
};

export const usersList = async (request, response) => {
    try {
        // Find all questions
        const allUsers = await User.find();

        if (allUsers.length === 0) {
            return response.status(200).json({
                status: false,
                message: "No user exist"
            });
        }

        return response.status(200).json({
            status: true,
            message: "All users retrieved successfully",
            data: allUsers
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};
export const deleteUser = async (request, response) => {
    try {
        const { number } = request.body;

        const deletedUser = await User.findOneAndDelete({ number });

        if (!deletedUser) {
            return response.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        return response.status(200).json({
            status: true,
            message: "User deleted successfully",
            data: deletedUser
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};
