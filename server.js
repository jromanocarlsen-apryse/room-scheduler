import { RoomList } from "./src/roomList.js";
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
app.post('/meeting', (req, res) => {
    // Extract start and end time from the request body
    const { startTime, endTime } = req.body;
    
    // Validate the input
    if (!startTime || !endTime) {
        return res.status(400).json({ error: 'Start time and end time are required.' });
    }
    if (typeof startTime !== 'number' || typeof endTime !== 'number' || startTime < 0 || endTime <= startTime) {
        return res.status(400).json({ error: 'Invalid input: startTime and endTime must be non-negative numbers, and endTime must be greater than startTime.' });
    }

    // Call the function to schedule the meeting and get the unique meeting id
    const meetingId = roomList.scheduleMeeting(startTime, endTime);
    
    // Return the unique id for the scheduled meeting
    res.status(201).json({ meetingId });
});

// delete endpoint for cancel a meeting via id
app.delete('/meeting', (req, res) => {
    // Extract meeting id from the queryparameters
    const { meetingId } = req.query;
    
    // Validate the input
    if (!meetingId) {
        return res.status(400).json({ error: 'Meeting ID is required.' });
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
    if (!roomId) {
        return res.status(400).json({ error: 'Room ID is required.' });
    }
    if (typeof roomId !== 'string') {
        return res.status(400).json({ error: 'Invalid input: roomId must be a string.' });
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
app.get('/conflicts', (req, res) => {
    // Extract start and end time from the query parameters
    const { startTime, endTime } = req.query;

    // Validate the input
    if (!startTime || !endTime) {
        return res.status(400).json({ error: 'Start time and end time are required.' });
    }
    const startTimeNum = Number(startTime);
    const endTimeNum = Number(endTime);
    if (isNaN(startTimeNum) || isNaN(endTimeNum) || startTimeNum < 0 || endTimeNum <= startTimeNum) {
        return res.status(400).json({ error: 'Invalid input: startTime and endTime must be non-negative numbers, and endTime must be greater than startTime.' });
    }

    const conflicts = roomList.getConflictingMeetings(startTimeNum, endTimeNum);
    
    // Return the list of conflicting meetings
    res.status(200).json({ conflicts });
});

// get endpoint for returning the number of rooms in the room list
app.get('/roomCount', (_, res) => {
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