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
        const answers = await webAnswer.find();
    
        if (!answers || answers.length === 0) {
          return res.status(404).json({
            status: false,
            message: "No answers found in the database",
          });
        }
    
        return res.status(200).json({
          status: true,
          message: "Answers fetched successfully",
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