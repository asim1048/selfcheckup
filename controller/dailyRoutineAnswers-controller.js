import DailyRoutineAnswers from "../model/dailyRoutineAnswers.js";
export const addDailyRooutineQnA = async (request, response) => {
    try {
        // Extract data from the request body
        const { user, QnA } = request.body;
    
        // Create a new RiskLevel document
        const dailyRoutineAnswers = new DailyRoutineAnswers({
          user,
          QnA,
        });
    
        // Save the document to the database
        await dailyRoutineAnswers.save();

        let res = {
            status: true,
            message: "Ansers added successfully",
            
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