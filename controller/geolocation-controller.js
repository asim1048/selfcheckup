import Geolocation from "../model/geolocation.js"; 

export const addGeoLocation = async (request, response) => {
    try {
        const { user, longitude, latitude } = request.body;

        let existingGeoLocation = await Geolocation.findOne({ user });

        if (existingGeoLocation) {
            // If the user already has a geolocation, update its location.
            existingGeoLocation.longitude = longitude;
            existingGeoLocation.latitude = latitude;
            await existingGeoLocation.save();

            let res = {
                status: true,
                message: "Geolocation updated successfully",
                data: existingGeoLocation,
            };

            return response.status(200).json(res);
        } else {
            // If the user doesn't have a geolocation, create a new one.
            const newGeoLocation = new Geolocation({
                user,
                longitude,
                latitude,
            });

            await newGeoLocation.save();

            let res = {
                status: true,
                message: "Geolocation added successfully",
                data: newGeoLocation,
            };

            return response.status(201).json(res);
        }
    } catch (error) {
        let res = {
            status: false,
            message: "Something went wrong in the backend",
            error: error.message,
        };
        return response.status(500).json(res);
    }
};
