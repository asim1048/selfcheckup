import questions from "../model/questions.js";
export const addQuestion = async (request, response) => {
    try {
        const { title } = request.body;

        // Check if the user already has an emergency contact with the given number
        const question = await questions.findOne({ title });

        if (question) {
            return response.status(400).json({
                status: false,
                message: "Question already exists against title"
            });
        }

        const questin = new questions(request.body);
        await questin.save();

        let res = {
            status: true,
            message: "Question added successfully",
            data: questin
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
};
export const getAllQuestions = async (request, response) => {
    try {
        // Find all questions
        const allQuestions = await questions.find();

        if (allQuestions.length === 0) {
            return response.status(200).json({
                status: true,
                message: "No questions found"
            });
        }

        return response.status(200).json({
            status: true,
            message: "All questions retrieved successfully",
            data: allQuestions
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};

export const deleteQuestion = async (request, response) => {
    try {
        const { id } = request.body;
       

        // Check if the question exists
        const question = await questions.findById(id);
        

        if (!question) {
            return response.status(404).json({
                status: false,
                message: "Question not found"
            });
        }

        // Delete the question
        await question.deleteOne();

        return response.status(200).json({
            status: true,
            message: "Question deleted successfully"
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};

export const updateQuestionTitle = async (request, response) => {
    try {
        const { id, title } = request.body;

        // Check if the question exists
        const question = await questions.findById(id);

        if (!question) {
            return response.status(404).json({
                status: false,
                message: "Question not found"
            });
        }

        // Update the question title
        question.title = title;
        await question.save();

        return response.status(200).json({
            status: true,
            message: "Question title updated successfully",
            data: question
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};


