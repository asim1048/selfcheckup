import answerr from "../model/answer.js";
export const storeAnswer = async (request, response) => {
    try {
        const { user, questionId, answer } = request.body;

        // Check if an answer exists for the given user and question
        const existingAnswer = await answerr.findOne({ user, questionId });

        if (existingAnswer) {
            // Update the existing answer
            existingAnswer.answer = answer;
            await existingAnswer.save();

            return response.status(200).json({
                status: true,
                message: "Answer updated successfully",
                data: existingAnswer
            });
        }

        // Create a new answer instance
        const newAnswer = new answerr({
            user,
            questionId,
            answer
        });

        await newAnswer.save();

        return response.status(200).json({
            status: true,
            message: "Answer stored successfully",
            data: newAnswer
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};
