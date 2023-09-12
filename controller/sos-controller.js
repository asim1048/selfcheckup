import SOS from "../model/SOS.js";
export const addSOS = async (req, res) => {
  try {
    // Extract data from the request body
    const { user } = req.body;

    // Create a new SOS document
    const newSOS = new SOS({ user });

    // Save the SOS document to the database
    await newSOS.save();

    return res.status(201).json({
      status: true,
      message: "SOS entry added successfully",
      SOS: newSOS,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong in the backend",
      error: error.message,
    });
  }
}
export const getSOS = async (req, res) => {
  try {
    const { date } = req.body; // Get the date parameter from the query string

    // Convert the date string into a Date object (assuming date is in "YYYY-MM-DD" format)
    const selectedDate = new Date(date);

    // Calculate the start and end of the selected date to cover the entire day
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Find all SOS entries with a createdAt value within the selected date
    const sosEntries = await SOS.find({
      createdAt: {
        $gte: startOfDay, // Greater than or equal to the start of the selected date
        $lte: endOfDay,   // Less than or equal to the end of the selected date
      },
    }).exec();

    if (sosEntries.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No SOS entries found for the specified date',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'SOS entries retrieved successfully',
      data: sosEntries,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Something went wrong in the backend',
      error: error.message,
    });
  }

}
export const closeSOS = async (req, res) => {
  try {
    const { id } = req.body; // Get the SOS entry ID from the URL parameter

    // Find the SOS entry by ID and update the isChecked field to true
    const updatedSOS = await SOS.findByIdAndUpdate(
      id,
      { isChecked: true },
      { new: true } // Return the updated document
    );

    if (!updatedSOS) {
      return res.status(404).json({
        status: false,
        message: 'SOS entry not found',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'SOS entry updated successfully',
      data: updatedSOS,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Something went wrong in the backend',
      error: error.message,
    });
  }
}