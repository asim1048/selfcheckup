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
export const getRiskLevels = async (request, response) => {
    try {
      const { user } = request.body;
  
      // Find all RiskLevels for the specified user
      const riskLevels = await RiskLevel.find({ user: user });
  
      if (!riskLevels || riskLevels.length === 0) {
        // If there are no RiskLevels for the user, return a custom message
        let res = {
          status: false,
          message: "No RiskLevels found for the user",
          
          
        };
  
        return response.status(200).json(res);
      }
  
      let res = {
        status: true,
        message: "Risk levels retrieved successfully",
        data: riskLevels,
      };
  
      return response.status(200).json(res);
    } catch (error) {
      let res = {
        status: false,
        message: "Something went wrong in the backend",
        error: error.message,
      };
      return response.status(500).json(res);
    }
  };

export const getHighRiskAlerts = async (request, response) => {
    try {
      // Find all RiskLevels
      const riskLevels = await RiskLevel.find({});
      //console.log(riskLevels);
  
      // Filter the riskLevels array to include only items that match the condition
      const filteredRiskLevels = riskLevels.filter((riskLevel) => {
        return riskLevel.isChecked === false && ["High", "Very High"].includes(riskLevel.riskLevel);
      });
  
      if (!filteredRiskLevels || filteredRiskLevels.length === 0) {
        // If there are no matching RiskLevels, return a custom message
        let res = {
          status: false,
          message: "No high-risk alerts found",
        };
  
        return response.status(200).json(res);
      }
  
      let res = {
        status: true,
        message: "High-risk alerts retrieved successfully",
        data: filteredRiskLevels,
      };
  
      return response.status(200).json(res);
    } catch (error) {
      let res = {
        status: false,
        message: "Something went wrong in the backend",
        error: error.message,
      };
      return response.status(500).json(res);
    }
};
  