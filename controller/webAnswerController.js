import webAnswer from "../model/WebAnswers.js";
export const addWebAnswer = async (req, res) => {
    try {
        // Extract data from the request body
        const { type, userId,userName, title, description } = req.body;
    
        // Create a new answer document
        const newAnswer = new webAnswer({ type, userId,userName, title, description });
    
        // Save the answer document to the database
        await newAnswer.save();
    
        return res.status(201).json({
          status: true,
          message: "Answer added successfully",
          answer: newAnswer,
        });
      } catch (error) {
        return res.status(500).json({
          status: false,
          message: "Something went wrong in the backend",
          error: error.message,
        });
      }
}

export const getWebAnswer = async (req, res) => {
    try {
        const { date } = req.body; // Assuming you pass the date as a query parameter
        
        // Convert the date to a JavaScript Date object if needed
        const searchDate = new Date(date);

        const answers = await webAnswer.find({
            createdAt: {
                $gte: searchDate, // Greater than or equal to the specified date
                $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000), // Less than the next day
            }
        });

        if (!answers || answers.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No answers found for the specified date",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Answers fetched successfully for the specified date",
            data: answers,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message,
        });
    }
}
export const deleteWebAnswer = async (req, res) => {
    try {
        const { id } = req.body;
    
        // Attempt to delete the answer by its ObjectId
        const deletedAnswer = await webAnswer.findByIdAndRemove(id);
    
        if (!deletedAnswer) {
          return res.status(404).json({
            status: false,
            message: "Answer not found",
          });
        }
    
        return res.status(200).json({
          status: true,
          message: "Answer deleted successfully",
          deletedAnswer: deletedAnswer,
        });
      } catch (error) {
        return res.status(500).json({
          status: false,
          message: "Something went wrong in the backend",
          error: error.message,
        });
      }
}