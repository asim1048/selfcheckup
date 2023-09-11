import express from 'express';
//import nodemailer from 'nodemailer'

import dotenv from 'dotenv';
import path from 'path';

//Users
import { signUp, logIn, updatePassword, checkUser, facebookLoginSignup, usersList, deleteUser } from '../controller/user-controller.js';
import { addVitalSign, getVitalSigns } from '../controller/vitalSigns-controller.js';
import { addEmergencyContact, deleteEmergencyContact, updateEmergencyContact, getEmergencyContacts } from '../controller/emergencyContacts-controller.js';
import { addQuestion, getAllQuestions, deleteQuestion, updateQuestionTitle } from '../controller/question-controller.js';
import { storeAnswer } from '../controller/answer-controller.js';
import { isLiveNow, updateStreamingStatus, addAdmin, getAdmin } from '../controller/Streaming-Controller.js';
import { addGeoLocation } from '../controller/geolocation-controller.js';
import { addPersonalInfo, getPersonalInfo, addMedicareInfo, addDoctorInfo } from '../controller/personalInfo-controller.js';
import { addRiskLevel, getRiskLevels, getHighRiskAlerts,updateRiskLevel } from '../controller/riskLevel-controller.js';
import { addDailyRooutineQnA, getDailyRoutineAnswers } from '../controller/dailyRoutineAnswers-controller.js';
import { addSOS } from '../model/sos-controller.js';

//Admin
import { adminSignUp, adminLogIn, updateAdminPassword, getAllAdmins, deleteAdmin, updateAdmin } from '../controller/adminController.js';

import upload from '../middleware/multer.js';
import User from '../model/user.js';
import Articles from '../model/articles.js'
import Videos from '../model/videos.js';
import dailyRoutineUserPics from '../model/DailyRoutineUserPics.js';

import twilio from 'twilio';

const accountSid = process.env.TW_SSD;
const authToken = process.env.TW_TOKEN;
const TWNumber = process.env.TW_NUMBER;
const client = new twilio(accountSid, authToken);

const route = express.Router();

route.post('/signUp', signUp)
route.post('/logIn', logIn)
route.post('/updatePassword', updatePassword)
route.post('/checkUser', checkUser)
route.post('/facebookLoginSignup', facebookLoginSignup)
route.get('/usersList', usersList)
route.post('/deleteUser', deleteUser)

route.post('/sendOTp', async (req, res) => {
    try {

        // Generate a random 6-digit OTP
        const generateOTP = () => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        };

        const { phoneNumber } = req.body;
        const otp = generateOTP();

        // Send the OTP to the user's phone number via SMS
        await client.messages.create({
            body: `Your OTP: ${otp}`,
            from: TWNumber,
            to: phoneNumber
        });

        res.json({
            status: true,
            message: 'OTP sent successfully',
            otp: otp,
        });
    } catch (error) {
        console.error('Error sending OTP: ', error);
        res.status(500).json({
            status: false,
            message: 'Failed to send OTP',
            error: error.message
        });
    }
});
route.post('/sendRistMeterAnswer', async (req, res) => {
    try {
        const { number, answer } = req.body;
        //console.log(number)
        //console.log(answer)

        // Send the OTP to the user's phone number via SMS
        await client.messages.create({
            body: answer,
            from: TWNumber,
            to: number
        });

        res.json({
            status: true,
            message: 'Answer sent successfully',
        });
    } catch (error) {
        console.error('Error sending Answer: ', error);
        res.status(500).json({
            status: false,
            message: 'Failed to send Answer',
            error: error.message
        });
    }
});
route.post('/uploadDP', upload.single('image'), async (request, response) => {
    try {
        const { number } = request.body;
        const user = await User.findOne({ number });

        if (!user) {
            return response.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        // Update the user's image path
        user.image = request.file ? request.file.path : user.image;
        await user.save();

        // Construct the image URL using the base URL and the user's image path
        const imageUrl = `${request.protocol}://${request.get('host')}/${user.image}`;

        return response.status(200).json({
            status: true,
            message: "Profile image uploaded successfully",
            data: {
                ...user.toObject(),
                image: imageUrl
            }
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
});

//Vital Signs
route.post('/addVitalSign', addVitalSign)
route.post('/getVitalSigns', getVitalSigns)

//Emergency Contacts
route.post('/addEmergencyContact', addEmergencyContact)
route.post('/deleteEmergencyContact', deleteEmergencyContact)
route.post('/updateEmergencyContact', updateEmergencyContact)
route.post('/getEmergencyContacts', getEmergencyContacts)

//Questions
route.post('/addQuestion', addQuestion)
route.get('/getAllQuestions', getAllQuestions)
route.post('/deleteQuestion', deleteQuestion)
route.post('/updateQuestionTitle', updateQuestionTitle)

//RiskLevel
route.post('/addRiskLevel', addRiskLevel)
route.post('/getRiskLevels', getRiskLevels)
route.get('/getHighRiskAlerts', getHighRiskAlerts)
route.post('/updateRiskLevel', updateRiskLevel)

//Answers
route.post('/storeAnswer', storeAnswer)

//DailyRoutineAnswers
route.post('/addDailyRooutineQnA', addDailyRooutineQnA)
route.post('/getDailyRoutineAnswers', getDailyRoutineAnswers)

//SOS
route.post('/addSOS', addSOS)

//streaming
route.post('/addAdmin', addAdmin)
route.get('/isLiveNow', isLiveNow)
route.get('/updateStreamingStatus', updateStreamingStatus)
route.get('/getAdmin', getAdmin)


//Geo Location
route.post('/addGeoLocation', addGeoLocation)

//Articles
route.post('/addArticle', upload.single('image'), async (request, response) => {
    try {
        const { title, description, type } = request.body;
        console.log(title)

        if (!title || !description) {
            return response.status(400).json({
                status: false,
                message: "Title and description are required."
            });
        }

        if (!request.file) {
            return response.status(400).json({
                status: false,
                message: "Article image is required."
            });
        }
        const newArticle = new Articles({
            title,
            type,
            description,
            image: request.file.filename
        });

        const savedArticle = await newArticle.save();

        return response.status(201).json({
            status: true,
            message: "Article added successfully.",
            article: savedArticle
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
});
route.get('/getArticles', async (request, response) => {
    try {
        const articles = await Articles.find();

        // Map articles to include full image URLs
        const articlesWithImageUrls = articles.map(article => {
            return {
                _id: article._id,
                title: article.title,
                type: article.type,
                visible: article.visible,
                description: article.description,
                image: `${request.protocol}://${request.get('host')}/uploads/${article.image}`
            };
        });

        return response.status(200).json({
            status: true,
            message: "Articles retrieved successfully.",
            data: articlesWithImageUrls
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
});
route.post('/deleteArticle', async (request, response) => {
    const { id } = request.body;

    try {
        const deletedArticle = await Articles.findByIdAndDelete(id);

        if (!deletedArticle) {
            return response.status(404).json({
                status: false,
                message: 'Article not found.',
            });
        }

        return response.status(200).json({
            status: true,
            message: 'Article deleted successfully.',
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: 'Something went wrong in the backend.',
            error: error.message,
        });
    }
});
route.post('/updateArticle', upload.single('image'), async (request, response) => {
    try {
        const { title, description, type, id } = request.body;

        if (!title || !description) {
            return response.status(400).json({
                status: false,
                message: "Title and description are required."
            });
        }

        const updatedFields = {
            title,
            type,
            description,
        };

        if (request.file) {
            updatedFields.image = request.file.filename;
        }

        const updatedArticle = await Articles.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true } // To get the updated article object
        );

        if (!updatedArticle) {
            return response.status(404).json({
                status: false,
                message: "Article not found."
            });
        }

        return response.status(200).json({
            status: true,
            message: "Article updated successfully.",
            article: updatedArticle
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
});




//Videos
route.post('/uploadVideo', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (request, response) => {
    try {
        const { title, type } = request.body;

        if (!title || !request.files || !request.files.thumbnail || !request.files.video) {
            return response.status(400).json({
                status: false,
                message: "Title, thumbnail, and video are required."
            });
        }

        const thumbnailFilename = request.files.thumbnail[0].filename;
        const videoFilename = request.files.video[0].filename;


        const newVideo = new Videos({
            title,
            type: type,
            thumbnail: thumbnailFilename,
            video: videoFilename
        });

        const savedVideo = await newVideo.save();

        return response.status(201).json({
            status: true,
            message: "Video uploaded successfully.",
            video: savedVideo
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
});
route.get('/getVideos', async (request, response) => {
    try {
        const videos = await Videos.find();

        // Map videos to include full URLs for thumbnail and video
        const videosWithUrls = videos.map(video => {
            return {
                _id: video._id,
                title: video.title,
                type: video.type,
                visible: video.visible,
                thumbnail: `${request.protocol}://${request.get('host')}/uploads/${video.thumbnail}`,
                video: `${request.protocol}://${request.get('host')}/uploads/${video.video}`
            };
        });

        return response.status(200).json({
            status: true,
            message: "Videos retrieved successfully.",
            data: videosWithUrls
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
});
route.post('/deleteVideo', async (request, response) => {
    try {
        const { id } = request.body;

        // Find the video by ID
        const video = await Videos.findByIdAndDelete(id);

        if (!video) {
            return response.status(404).json({
                status: false,
                message: "Video not found."
            });
        }


        return response.status(200).json({
            status: true,
            message: "Video deleted successfully."
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
});
route.post('/updateVideo', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (request, response) => {
    try {
        const { title, type, videoId } = request.body;

        if (!title) {
            return response.status(400).json({
                status: false,
                message: "Title is required."
            });
        }

        const updatedFields = {
            title,
            type,
        };

        // Check if thumbnail and video files are provided
        if (request.files.thumbnail && request.files.video) {
            const thumbnailFilename = request.files.thumbnail[0].filename;
            const videoFilename = request.files.video[0].filename;
            updatedFields.thumbnail = thumbnailFilename;
            updatedFields.video = videoFilename;
        }

        // Find the video by its ID
        const videoToUpdate = await Videos.findByIdAndUpdate(
            videoId,
            { $set: updatedFields },
            { new: true } // To get the updated video object
        );

        if (!videoToUpdate) {
            return response.status(404).json({
                status: false,
                message: "Video not found."
            });
        }

        return response.status(200).json({
            status: true,
            message: "Video updated successfully.",
            video: videoToUpdate
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
});



//Personal Info
route.post('/addPersonalInfo', addPersonalInfo)
route.post('/getPersonalInfo', getPersonalInfo)
route.post('/addMedicareInfo', addMedicareInfo)
route.post('/addDoctorInfo', addDoctorInfo)

//Informating Emergency contacts
//For Selfcheckup Actions
route.post('/sendEmergencyNotification', async (req, res) => {
    try {
        const { emergencyContacts, userName, latitude, longitude, date, time } = req.body;
        const notificationMessage = `${userName} just self-reported some serious conditions at ${date} and ${time} is at https://www.google.com/maps/search/?api=1&query=${parseFloat(
            latitude
        )},${parseFloat(longitude)}`;
        console.log(notificationMessage)
        for (const contact of emergencyContacts) {

            console.log(contact.number)
            await client.messages.create({
                body: notificationMessage,
                from: TWNumber,
                to: contact.number
            });
        }

        res.json({
            status: true,
            message: 'Emergency notifications sent successfully',
        });
    } catch (error) {
        console.error('Error sending emergency notifications: ', error);
        res.status(500).json({
            status: false,
            message: 'Failed to send emergency notifications',
            error: error.message
        });
    }
});
route.post('/informEmergencyContacts', async (req, res) => {
    try {
        const { emergencyContacts, userName, date, time } = req.body;
        const notificationMessage = `${userName} just self-reported some serious conditions at ${date} and ${time}`;
        console.log(notificationMessage)
        for (const contact of emergencyContacts) {

            console.log(contact.number)
            await client.messages.create({
                body: notificationMessage,
                from: TWNumber,
                to: contact.number
            });
        }
        res.json({
            status: true,
            message: 'Emergency notifications sent successfully',
        });
    } catch (error) {
        console.error('Error sending emergency notifications: ', error);
        res.status(500).json({
            status: false,
            message: 'Failed to send emergency notifications',
            error: error.message
        });
    }
});

route.post('/contactAddedMsg', async (req, res) => {
    try {
        const { number, userName, relation } = req.body;
        const notificationMessage = `${userName} is added you in Selfcheckup app as a ${relation}`;
        console.log(notificationMessage)

        await client.messages.create({
            body: notificationMessage,
            from: TWNumber,
            to: number
        });

        res.json({
            status: true,
            message: `${number} is informed successfully.`,
        });
    } catch (error) {
        console.error('Error sending message to inform contact', error);
        res.status(500).json({
            status: false,
            message: 'Failed to send message to inform contact',
            error: error.message
        });
    }
});

//Daily Routine User Images
route.post('/dailyRoutinePics', upload.single('image'), async (request, response) => {
    try {
        const { user } = request.body; // Assuming you're passing the user's ID in the request body
        const newDailyPic = new dailyRoutineUserPics({
            user: user, // Link the image with the specified user ID
            image: request.file ? request.file.path : null
        });

        await newDailyPic.save();

        return response.status(200).json({
            status: true,
            message: "Daily routine picture uploaded successfully",
            data: newDailyPic
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
});


//----------------------------------------------ADMIN
//Login & Signup
route.post('/adminSignUp', adminSignUp);
route.post('/adminLogIn', adminLogIn);
route.post('/updateAdminPassword', updateAdminPassword);
route.get('/getAllAdmins', getAllAdmins);
route.post('/deleteAdmin', deleteAdmin);
route.post('/updateAdmin', updateAdmin);


//Sending Emails
// const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: "asim.sunskilltechs@gmail.com",     // Replace with your email address
//         pass: 'asim2000@'        // Replace with your email password
//     }
// });
// route.post('/sendEmail', async (req, res) => {
//     try {
//         const { to, subject, text } = req.body;

//         // Define email options
//         const mailOptions = {
//             from: 'asim.sunskilltechs@gmail.com',   // Replace with your email address
//             to: "asimm1048@gmail.com",
//             subject: "ki haal ay",
//             text: "yssjjs"
//         };

//         // Send the email
//         await transporter.sendMail(mailOptions);

//         res.json({
//             status: true,
//             message: 'Email sent successfully',
//         });
//     } catch (error) {
//         console.error('Error sending email: ', error);
//         res.status(500).json({
//             status: false,
//             message: 'Failed to send email',
//             error: error.message
//         });
//     }
// });

export default route;