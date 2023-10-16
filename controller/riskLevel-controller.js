import RiskLevel from "../model/RiskLevel.js";
import User from "../model/user.js";
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
      // Find all RiskLevels with riskLevel 'High' or 'Very High' and isChecked is false
      const filteredRiskLevels = await RiskLevel.find({
        isChecked: false,
        riskLevel: { $in: ["High", "Very High"] },
      }).populate('user'); // Populate the 'user' field to get user details
  
      if (!filteredRiskLevels || filteredRiskLevels.length === 0) {
        // If there are no matching RiskLevels, return a custom message
        let res = {
          status: false,
          message: "No high-risk alerts found",
        };
  
        return response.status(200).json(res);
      }
  
      // Create an array to store the results with user details
      const resultsWithUserDetails = [];
  
      // Iterate through filteredRiskLevels and add user details to each alert object
      for (const riskLevel of filteredRiskLevels) {
        const user = await User.findOne({number:riskLevel.user}); // Find the user by ObjectId
        if (user) {
          // Add user details to the alert object
          const alertWithUserDetails = {
            _id: riskLevel._id,
            riskLevel: riskLevel.riskLevel,
            isChecked: riskLevel.isChecked,
            user:User.number,
            userDetail: {
              _id: user._id,
              fName: user.fName,
              lName: user.lName,
              email: user.email,
            },
            createdAt: riskLevel.createdAt,
            updatedAt: riskLevel.updatedAt,
          };
  
          // Push the alert with user details to the results array
          resultsWithUserDetails.push(alertWithUserDetails);
        }
      }
  
      let res = {
        status: true,
        message: "High-risk alerts retrieved successfully",
        data: resultsWithUserDetails,
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
export const updateRiskLevel = async (req, res) => {
  try {
    const { id, isChecked } = req.body;

    // Use findByIdAndUpdate to update the document
    const updatedRiskLevel = await RiskLevel.findByIdAndUpdate(
      id,
      { isChecked },
      { new: true }
    );

    if (!updatedRiskLevel) {
      return res.status(404).json({ status: false, message: 'Risk Level not found' });
    }

    return res.status(200).json({
      status: true,
      message: 'Risk Level updated successfully',
      updatedRiskLevel,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Something went wrong in the backend',
      error: error.message,
    });
  }
};
  
