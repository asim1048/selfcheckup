import RiskLevel from "../model/RiskLevel.js";
export const addRiskLevel = async (request, response) => {
    try {
        // Extract data from the request body
        const { user, riskLevel } = request.body;
    
        // Create a new RiskLevel document
        const newRiskLevel = new RiskLevel({
          user,
          riskLevel,
        });
    
        // Save the document to the database
        await newRiskLevel.save();

        let res = {
            status: true,
            message: "Risk level added successfully",
            
        };
    
        return response.status(201).json(res);
    } catch (error) {
        let res = {
            status: false,
            message: "Something went wrong in the backend",
            error: error.message,
        };
        return response.status(500).json(res);
      }
    
};