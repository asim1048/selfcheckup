import Admin from '../model/admin.js';
import bcrypt from 'bcrypt';

export const adminSignUp = async (request, response) => {
    try {
        const { loginID, password,role } = request.body;

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
            password: hashedPassword,
            role:role
        });

        await newAdmin.save();
        let res = {
            status: true,
            message: `${role} created successfully`,
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
export const getAllAdmins = async (request, response) => {
    try {
        // Find all admins in the database
        const admins = await Admin.find();

        // Check if there are any admins
        if (!admins || admins.length === 0) {
            let res = {
                status: false,
                message: "No admins found",
            };
            return response.status(200).json(res);
        }

        // If admins are found, return them in the response with hashed passwords
        let res = {
            status: true,
            message: "Admins retrieved successfully",
            data: admins,
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
export const deleteAdmin = async (request, response) => {
    try {
      // Parse the object ID from the request parameters
      const { adminId } = request.body;
  
      // Use Mongoose to find and delete the admin document
      const deletedAdmin = await Admin.findByIdAndDelete(adminId);
  
      if (!deletedAdmin) {
        // If the admin document with the given object ID doesn't exist
        let res = {
          status: false,
          message: "Admin not found",
        };
        return response.status(404).json(res);
      }
  
      // If the admin was deleted successfully
      let res = {
        status: true,
        message: "Admin deleted successfully",
        data: deletedAdmin,
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
  export const updateAdmin = async (request, response) => {
    try {
      // Parse the object ID from the request parameters
      const { adminId } = request.body;
  
      // Validate and parse the updated admin data from the request body
      const { loginID, password, role } = request.body;
  
      // Check if the admin document with the given object ID exists
      const existingAdmin = await Admin.findById(adminId);
  
      if (!existingAdmin) {
        // If the admin document doesn't exist
        let res = {
          status: false,
          message: "Admin not found",
        };
        return response.status(404).json(res);
      }
  
      // Update the admin data
      existingAdmin.loginID = loginID;
      
      if (password) {
        // Hash the new password if provided
        const hashedPassword = await bcrypt.hash(password, 10);
        existingAdmin.password = hashedPassword;
      }
  
      existingAdmin.role = role;
  
      // Save the updated admin document
      await existingAdmin.save();
  
      // If the admin was updated successfully
      let res = {
        status: true,
        message: "Admin updated successfully",
        data: existingAdmin,
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