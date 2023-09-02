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
export const getDailyRoutineAnswers = async (req, res) => {
    try {
        const { user, date } = req.body;
    
        // Convert the date string into a Date object (assuming date is in "YYYY-MM-DD" format)
        const selectedDate = new Date(date);
    
        // Find records that match the user and the specified date
        const records = await DailyRoutineAnswers.find({
          user: user,
          createdAt: {
            $gte: selectedDate, // Greater than or equal to the selected date
            $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), // Less than the next day
          },
        });

        if (!records || records.length === 0) {
            let resData = {
              status: false,
              message: "No Result found for the user",
            };
          
            return res.status(200).json(resData); // Use `res` instead of `response`
          }
    
        let resData = {
          status: true,
          message: "Records retrieved successfully",
          records:records.length,
          data: records,
        };
    
        res.status(200).json(resData);
      } catch (error) {
        let resData = {
          status: false,
          message: "Something went wrong in the backend",
          error: error.message,
        };
        res.status(500).json(resData);
      }
};
