import { RoomList } from "./src/core/roomList.js";
import { validateMeetingTimeInput, validateMeetingIdInput, validateRoomIdInput } from "./src/api/validators.js";
import express from 'express';

const app = express();
const PORT = 3000;

const roomList = new RoomList();

app.use(express.json()); 

app.get('/', (_, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

// post endpoint for scheduling a meeting, passing in a 2-element array with start and end time, and return a unique id for the meeting
app.post('/meetings', (req, res) => {
    const { startTime, endTime } = req.body;
    const validationResult = validateMeetingTimeInput(startTime, endTime);
    if (!validationResult.valid) {
        return res.status(400).json({ error: validationResult.error });
    }
    const meetingId = roomList.scheduleMeeting(startTime, endTime);
    res.status(201).json({ meetingId });
});

// delete endpoint for cancel a meeting via id
app.delete('/meetings/:meetingId', (req, res) => {
    const { meetingId } = req.params;
    const validationResult = validateMeetingIdInput(meetingId);
    if (!validationResult.valid) {
        return res.status(400).json({ error: validationResult.error });
    }
    const success = roomList.cancelMeeting(meetingId);
    if (success) {
        res.status(200).json({ message: 'Meeting cancelled successfully.' });
    } else {
        res.status(404).json({ error: 'Meeting not found.' });
    }
});


// get endpoint for getting all of the meetings of a particular room, passing in the room id as a route parameter
app.get('/rooms/:roomId/meetings', (req, res) => {
    const { roomId } = req.params;
    const validationResult = validateRoomIdInput(roomId);
    if (!validationResult.valid) {
        return res.status(400).json({ error: validationResult.error });
    }
    const meetings = roomList.getRoomSchedule(roomId);
    if (meetings) {
        res.status(200).json({ meetings });
    } else {
        res.status(404).json({ error: 'Room not found.' });
    }
});

// get endpoint for getting all of the rooms which currently exist in the room list
app.get('/rooms', (_, res) => {
    const rooms = roomList.getAllRooms();
    res.status(200).json({ rooms });
});


// get endpoint for returning a list of meetings which would conflict with a given meeting (2-element array with start and end time) along with the room id the conflicting meeting belongs to
app.get('/meetings/conflicts', (req, res) => {
    const { startTime, endTime } = req.query;
    const startTimeNum = Number(startTime);
    const endTimeNum = Number(endTime);
    const validationResult = validateMeetingTimeInput(startTimeNum, endTimeNum);
    if (!validationResult.valid) {
        return res.status(400).json({ error: validationResult.error });
    }
    const conflicts = roomList.getConflictingMeetings(startTimeNum, endTimeNum);
    res.status(200).json({ conflicts });
});

// get endpoint for returning the number of rooms in the room list
app.get('/rooms/count', (_, res) => {
    const roomCount = roomList.getRoomCounter();
    res.status(200).json({ roomCount });
});


app.listen(PORT, (error) => {
    if(!error) {
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    } else {
        console.log("Error occurred, server can't start", error);
    }
});