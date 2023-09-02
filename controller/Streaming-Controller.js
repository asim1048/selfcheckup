import Streaming from "../model/streaming.js";
export const addAdmin = async (request, response) => {
  try {
      const { admin } = request.body;

      // Find the existing admin record
      const existingAdmin = await Streaming.findOne({});

      if (existingAdmin) {
          // Update the existing admin record with the new admin
          existingAdmin.admin = admin;
          await existingAdmin.save();
          let res = {
              status: true,
              message: "Admin updated successfully",
              data: existingAdmin
          };
          return response.status(200).json(res);
      } else {
          // If no admin record exists, create a new one
          const streaming = new Streaming({ admin: admin });
          await streaming.save();
          let res = {
              status: true,
              message: "Admin added successfully",
              data: streaming
          };
          return response.status(200).json(res);
      }
  } catch (error) {
      let res = {
          status: false,
          message: "Something went wrong in the backend",
          error: error,
      };
      return response.status(500).json(res);
  }
}
export const getAdmin = async (request, response) => {
  try {
    // Find the admin record
    const adminRecord = await Streaming.findOne({});
    
    if (!adminRecord) {
      // If no admin record exists, return a response indicating that it's not found
      let res = {
        status: false,
        message: "Admin not found",
      };
      return response.status(404).json(res);
    }

    // Return the admin data in the response
    let res = {
      status: true,
      message: "Admin data retrieved successfully",
      data: adminRecord.admin, // Assuming 'admin' is the field containing the admin data
    };
    return response.status(200).json(res);
  } catch (error) {
    let res = {
      status: false,
      message: "Something went wrong in the backend",
      error: error,
    };
    return response.status(500).json(res);
  }
};
export const isLiveNow = async (req, response) => {
  try {
    const userStreamingStatus = await Streaming.findOne({}, 'isLiveNow admin');
    if (userStreamingStatus) {
      return response.status(200).json({
        status: true,
        data: {
          isLiveNow: userStreamingStatus.isLiveNow,
          admin: userStreamingStatus.admin
        }
      });
    } else {
      return response.status(200).json({
        status: false,
        message: "Admin is not live",
      });
    }
  } catch (error) {
    response.status(500).json({ message: 'Server error' });
  }

}
export const updateStreamingStatus = async (req, response) => {
  try {
    const userStreamingStatus = await Streaming.findOne();

    if (!userStreamingStatus) {
      return response.status(404).json({ message: 'Admin not exists' });
    }

    // Toggle the isLiveNow value
    userStreamingStatus.isLiveNow = !userStreamingStatus.isLiveNow;
    await userStreamingStatus.save();

    return response.status(200).json({
      status: true,
      message: "Status updated successfully",
      isLiveNow: userStreamingStatus.isLiveNow
    });
  } catch (error) {
    response.status(500).json({ message: 'Server error' });
  }

}