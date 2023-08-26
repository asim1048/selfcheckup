import emergencyContacts from "../model/emergencyContacts.js";
export const addEmergencyContact = async (request, response) => {
    try {
        const { user, number } = request.body;

        // Check if the user already has an emergency contact with the given number
        const existingContact = await emergencyContacts.findOne({ user, number });

        if (existingContact) {
            return response.status(400).json({
                status: false,
                message: "Emergency contact with the same number already exists for this user"
            });
        }

        const emergencyContact = new emergencyContacts(request.body);
        await emergencyContact.save();

        let res = {
            status: true,
            message: "Contact added successfully",
            data: emergencyContact
        };
        return response.status(200).json(res);
    } catch (error) {
        let res = {
            status: false,
            message: "Something went wrong in the backend",
            error: error
        };
        return response.status(500).json(res);
    }
};

export const deleteEmergencyContact = async (request, response) => {
    try {
        const { user, number } = request.body;

        const deletedContact = await emergencyContacts.findOneAndDelete({ user, number });

        if (!deletedContact) {
            return response.status(404).json({
                status: false,
                message: "Emergency contact not found",
                
            });
        }

        return response.status(200).json({
            status: true,
            message: "Emergency contact deleted successfully",
            data: deletedContact
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};
export const updateEmergencyContact = async (request, response) => {
    try {
        const { _id, user, fName, lName, number, relation } = request.body;

        // Update criteria: match _id
        const filter = { _id };

        // Update fields: fName, lName, number, relation, user
        const updateFields = {
            $set: {
                user,
                fName,
                lName,
                number,
                relation
            }
        };

        // Perform the update operation
        const result = await emergencyContacts.updateOne(filter, updateFields);

        if (result.modifiedCount > 0) {
            // Fetch the updated emergency contact data after the update
            const updatedEmergencyContact = await emergencyContacts.findOne({ _id });

            return response.status(200).json({
                status: true,
                message: "Emergency contact updated successfully",
                data: updatedEmergencyContact // Send the updated data
            });
        } else {
            return response.status(404).json({
                status: false,
                message: "No matching emergency contact found"
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};
export const getEmergencyContacts = async (request, response) => {
    try {
        const { user } = request.body;

        // Find all emergency contacts for the given user
        const contacts = await emergencyContacts.find({ user });
        console.log(contacts)

        if (contacts.length === 0) {
            return response.status(200).json({
                status: false,
                message: "No emergency contacts found for the user",
                data: contacts
            });
        }

        return response.status(200).json({
            status: true,
            message: "Emergency contacts retrieved successfully",
            data: contacts
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};


