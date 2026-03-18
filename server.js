import { RoomList } from "./src/core/roomList.js";
import { validateMeetingTimeInput, validateMeetingIdInput, validateRoomIdInput } from "./src/api/validators.js";
import express from 'express';

const app = express();
const PORT = 3000;

const roomList = new RoomList(); // Initialize the RoomList instance

app.use(express.json()); 

app.get('/', (_, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

// post endpoint for scheduling a meeting, passing in a 2-element array with start and end time, and return a unique id for the meeting
app.post('/meetings', (req, res) => {
    // Extract start and end time from the request body
    const { startTime, endTime } = req.body;
    
    // Validate the input
    const validationResult = validateMeetingTimeInput(startTime, endTime);
    if (!validationResult.valid) {
        return res.status(400).json({ error: validationResult.error });
    }

    // Call the function to schedule the meeting and get the unique meeting id
    const meetingId = roomList.scheduleMeeting(startTime, endTime);
    
    // Return the unique id for the scheduled meeting
    res.status(201).json({ meetingId });
});

// delete endpoint for cancel a meeting via id
app.delete('/meetings/:meetingId', (req, res) => {
    // Extract meeting id from the route parameters
    const { meetingId } = req.params;
    
    // Validate the input
    const validationResult = validateMeetingIdInput(meetingId);
    if (!validationResult.valid) {
        return res.status(400).json({ error: validationResult.error });
    }

    // Call the function to cancel the meeting and get the result
    const success = roomList.cancelMeeting(meetingId);

    // if the meeting was successfully cancelled, return a success message, otherwise return an error message
    if (success) {
        res.status(200).json({ message: 'Meeting cancelled successfully.' });
    } else {
        res.status(404).json({ error: 'Meeting not found.' });
    }
});


// get endpoint for getting all of the meetings of a particular room, passing in the room id as a route parameter
app.get('/rooms/:roomId/meetings', (req, res) => {
    // Extract room id from the route parameters
    const { roomId } = req.params;

    // Validate the input
    const validationResult = validateRoomIdInput(roomId);
    if (!validationResult.valid) {
        return res.status(400).json({ error: validationResult.error });
    }

    // Call the function to get all meetings for the specified room
    const meetings = roomList.getRoomSchedule(roomId);
    
    // if the room exists, return the meetings for the room, otherwise return an error message
    if (meetings) {
        res.status(200).json({ meetings });
    } else {
        res.status(404).json({ error: 'Room not found.' });
    }
});

// get endpoint for getting all of the rooms which currently exist in the room list
app.get('/rooms', (_, res) => {
    // Call the function to get all rooms in the room list
    const rooms = roomList.getAllRooms();

    // Return the list of rooms
    res.status(200).json({ rooms });
});


// get endpoint for returning a list of meetings which would conflict with a given meeting (2-element array with start and end time) along with the room id the conflicting meeting belongs to
app.get('/meetings/conflicts', (req, res) => {
    // Extract start and end time from the query parameters
    const { startTime, endTime } = req.query;

    // Validate the input
    const startTimeNum = Number(startTime);
    const endTimeNum = Number(endTime);
    const validationResult = validateMeetingTimeInput(startTimeNum, endTimeNum);
    if (!validationResult.valid) {
        return res.status(400).json({ error: validationResult.error });
    }

    const conflicts = roomList.getConflictingMeetings(startTimeNum, endTimeNum);
    
    // Return the list of conflicting meetings
    res.status(200).json({ conflicts });
});

// get endpoint for returning the number of rooms in the room list
app.get('/rooms/count', (_, res) => {
    const roomCount = roomList.getRoomCounter();
    
    // Return the number of rooms in the room list
    res.status(200).json({ roomCount });
});


app.listen(PORT, (error) => {
    if(!error) {
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    } else {
        console.log("Error occurred, server can't start", error);
    }
});