import DailyRoutineAnswers from "../model/dailyRoutineAnswers.js";
export const addDailyRooutineQnA = async (request, response) => {
  try {
    const { user, QnA } = request.body;
    var temp=false;
    const updatedQnA = QnA.map((question) => {
      // Check if option with id 'a' is selected
      const isOptionASelected = question.options.find((option) => option.id === 'a' && option.isSelected && question.id!='face_photo' );
      if(isOptionASelected?.isSelected && isOptionASelected?.id =='a'){
        temp=true;
      }
    
      // Set isActionRequired based on the condition
     
    });

    // Create a new DailyRoutineAnswers document with updated QnA
    const dailyRoutineAnswers = new DailyRoutineAnswers({
      user,
      isActionRequired:temp,
      QnA: QnA,
    });

    // Save the document to the database
    await dailyRoutineAnswers.save();

    let res = {
      status: true,
      message: "Answers added successfully",
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
export const getAnswersWithActionRequired = async (req, res) => {
  try {
    // Use the `find` method to retrieve records where isActionRequired is true
    const records = await DailyRoutineAnswers.find({ isActionRequired: true, isActionTaken:false });

    if (!records || records.length === 0) {
      let resData = {
        status: false,
        message: "No records found with isActionRequired set to true",
      };

      return res.status(200).json(resData);
    }

    let resData = {
      status: true,
      message: "Records retrieved successfully",
      records: records.length,
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
export const completeDailyCheckupAlert = async (req, res) => {
  try {
    const { id, isActionTaken } = req.body;

    // Use findByIdAndUpdate to update the document
    const updatedRiskLevel = await DailyRoutineAnswers.findByIdAndUpdate(
      id,
      { isActionTaken },
      { new: true }
    );

    if (!updatedRiskLevel) {
      return res.status(404).json({ status: false, message: 'Daily Checkup Alert not found' });
    }

    return res.status(200).json({
      status: true,
      message: 'Daily Checkup Alert updated successfully',
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