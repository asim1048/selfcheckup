import SOS from "./SOS.js";
export const addSOS = async (req, res) => {
    try {
        // Extract data from the request body
        const { user } = req.body;
    
        // Create a new SOS document
        const newSOS = new SOS({ user });
    
        // Save the SOS document to the database
        await newSOS.save();
    
        return res.status(201).json({
          status: true,
          message: "SOS entry added successfully",
          SOS: newSOS,
        });
      } catch (error) {
        return res.status(500).json({
          status: false,
          message: "Something went wrong in the backend",
          error: error.message,
        });
      }
}