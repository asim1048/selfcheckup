import Admin from '../model/admin.js';
import bcrypt from 'bcrypt';

export const adminSignUp = async (request, response) => {
    try {
        const { loginID, password } = request.body;

        let exist = await Admin.findOne({ loginID });
        if (exist) {
            let res = {
                status: false,
                message: "Admin already exists against this Login ID"
            };
            return response.status(200).json(res);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        // Create a new admin with hashed password
        const newAdmin = new Admin({
            loginID,
            password: hashedPassword
        });

        await newAdmin.save();
        let res = {
            status: true,
            message: "Admin created successfully",
            data: newAdmin
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

export const adminLogIn = async (request, response) => {
    try {
        const { loginID, password } = request.body;

        const admin = await Admin.findOne({ loginID });

        if (!admin) {
            let res = {
                status: false,
                message: "Admin not found with this loginID"
            };
            return response.status(404).json(res);
        }

        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            let res = {
                status: false,
                message: "Invalid password"
            };
            return response.status(401).json(res);
        }

        let res = {
            status: true,
            message: "Admin login successful",
            data: admin
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
export const updateAdminPassword = async (request, response) => {
    try {
        const { loginID, newPassword } = request.body;

        // Find the admin by loginID
        let admin = await Admin.findOne({ loginID });
        if (!admin) {
            let res = {
                status: false,
                message: "Admin not found for this Login ID"
            };
            return response.status(404).json(res);
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the number of salt rounds

        // Update the admin's password
        admin.password = hashedPassword;
        await admin.save();

        let res = {
            status: true,
            message: "Admin password updated successfully",
            data: admin
        };
        return response.status(200).json(res);
    } catch (error) {
        console.log(error)
        let res = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return response.status(500).json(res);
    }
}