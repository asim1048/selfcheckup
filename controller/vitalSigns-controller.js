import vitalSigns from "../model/vitalSigns.js";

export const addVitalSign = async (request, response) => {
    try {
        const { number, bloodPressure, sugarLevel, pulse, temperature } = request.body;

        // Check if a record already exists for the user
        let existingRecord = await vitalSigns.findOne({ number });

        if (!existingRecord) {
            // If no record exists, create a new one
            const newVitalSign = new vitalSigns({
                number,
                bloodPressure,
                sugarLevel,
                pulse,
                temperature
            });
            await newVitalSign.save();
            let res = {
                status: true,
                message: "Vital signs added successfully",
                data: newVitalSign
            };
            return response.status(200).json(res);
        } else {
            // If a record exists, update it
            existingRecord.bloodPressure = bloodPressure || existingRecord.bloodPressure;
            existingRecord.sugarLevel = sugarLevel || existingRecord.sugarLevel;
            existingRecord.pulse = pulse || existingRecord.pulse;
            existingRecord.temperature = temperature || existingRecord.temperature;
            
            await existingRecord.save();

            let res = {
                status: true,
                message: "Vital signs updated successfully",
                data: existingRecord
            };
            return response.status(200).json(res);
        }
    } catch (error) {
        let res = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return response.status(500).json(res);
    }
}

export const getVitalSigns = async (request, response) => {
    try {
        const { number } = request.body;

        // Find the vital sign record for the provided number
        const vitalSign = await vitalSigns.findOne({ number });
        if (!vitalSign) {
            let res = {
                status: false,
                message: "Vital signs not found for the this user",
                data: null
            };
            return response.status(404).json(res);
        }

        let res = {
            status: true,
            message: "Vital signs retrieved successfully",
            data: vitalSign
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
}