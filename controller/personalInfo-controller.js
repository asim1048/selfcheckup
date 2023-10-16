import PersonalInfo from "../model/personalInfo.js";
export const addPersonalInfo = async (request, response) => {
    const { user, dob, gender,defaultCountryCode,number,email, address } = request.body;

    try {
        let existingInfo = await PersonalInfo.findOne({ user });

        if (!existingInfo) {
            existingInfo = new PersonalInfo({ user });
        }

        // Update the personal information fields
        existingInfo.dob = dob || existingInfo.dob;
        existingInfo.number = number || existingInfo.number;
        existingInfo.defaultCountryCode = defaultCountryCode || existingInfo.defaultCountryCode;
        existingInfo.email = email || existingInfo.email;
        existingInfo.gender = gender || existingInfo.gender;

        // Update the home address fields
        existingInfo.address = address || existingInfo.address;

        await existingInfo.save();

        response.status(200).json({
            status: true,
            message: 'Personal info saved/updated successfully',
            data: existingInfo
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            status: false,
            message: 'An error occurred while saving/updating personal info',
            data: null
        });
    }
}

export const getPersonalInfo = async (request, response) => {
    const { user } = request.body;

    try {
        const personalInfo = await PersonalInfo.findOne({ user });
        if (!personalInfo) {
            response.status(404).json({
                status: false,
                message: 'Personal info not found for the specified user',
                data: null
            });
        } else {
            response.status(200).json({
                status: true,
                message: 'Personal info retrieved successfully',
                data: personalInfo
            });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({
            status: false,
            message: 'An error occurred while retrieving personal info',
            data: null
        });
    }
}

export const addMedicareInfo = async (request, response) => {
    const { user, medicare_medicaid, medicare_ID, insurance_company, insurance_ID } = request.body;

    try {
        let existingInfo = await PersonalInfo.findOne({ user });

        if (!existingInfo) {
            existingInfo = new PersonalInfo({ user });
        }

        existingInfo.medicare_medicaid = medicare_medicaid || existingInfo.medicare_medicaid;
        existingInfo.medicare_ID = medicare_ID || existingInfo.medicare_ID;
        existingInfo.insurance_company = insurance_company || existingInfo.insurance_company;
        existingInfo.insurance_ID = insurance_ID || existingInfo.insurance_ID;

        await existingInfo.save();

        response.status(200).json({
            status: true,
            message: 'Medicare info saved/updated successfully',
            data: existingInfo
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            status: false,
            message: 'An error occurred while saving/updating medicare info',
            data: null
        });
    }
}
// personalController.js
export const addDoctorInfo = async (request, response) => {
    const { user, doctorsInfo } = request.body;

    try {
        let existingInfo = await PersonalInfo.findOne({ user });

        if (!existingInfo) {
            existingInfo = new PersonalInfo({ user });
        }

        existingInfo.doctorsInfo = doctorsInfo || existingInfo.doctorsInfo;
        // existingInfo.doctorLName = doctorLName || existingInfo.doctorLName;
        // existingInfo.doctorPhone = doctorPhone || existingInfo.doctorPhone;

        await existingInfo.save();

        response.status(200).json({
            status: true,
            message: 'Doctor info saved/updated successfully',
            data: existingInfo
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            status: false,
            message: 'An error occurred while saving/updating doctor info',
            data: null
        });
    }
}

