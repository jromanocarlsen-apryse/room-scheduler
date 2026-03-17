const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json()); 

app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

// TODO post endpoint for scheduling a meeting, passing in a 2-element array with start and end time, and return a unique id for the meeting
app.post('/schedule', (req, res) => {
    // Extract start and end time from the request body
    const { startTime, endTime } = req.body;
    
    // Validate the input (you can add more validation as needed)
    if (!startTime || !endTime) {
        return res.status(400).json({ error: 'Start time and end time are required.' });
    }

    // call the function to schedule the meeting and get the unique id (this function needs to be implemented)
    // const meetingId = scheduleMeeting(startTime, endTime);

    // FOR NOW, we will just return a dummy meeting id. You need to implement the logic to generate a unique id for each scheduled meeting.
    const meetingId = 'dummy-meeting-id'; // Replace this with actual logic to generate a unique id
    
    // Return the unique id for the scheduled meeting
    res.status(200).json({ meetingId });
});

// TODO post endpoint for cancel a meeting via id
app.post('/cancel', (req, res) => {
    // Extract meeting id from the request body
    const { meetingId } = req.body;

    // TODO consider also accepting the meeting id as a query parameter instead of in the body, and if both are provided, prioritize the one in the body
    
    // Validate the input
    if (!meetingId) {
        return res.status(400).json({ error: 'Meeting ID is required.' });
    }

    // TODO call the function to cancel the meeting (this function needs to be implemented)
    // cancelMeeting(meetingId);

    // TODO FOR NOW, we will just return a success message
    
    // Return a success message for the canceled meeting
    res.status(200).json({ message: `Meeting with ID ${meetingId} has been canceled.` });
});


// TODO get endpoint for getting all of the meetings of a particular room, passing in the room id as a query parameter
app.get('/meetings', (req, res) => {
    // Extract room id from the query parameters
    const { roomId } = req.query;

    // Validate the input
    if (!roomId) {
        return res.status(400).json({ error: 'Room ID is required.' });
    }

    // TODO call the function to get all meetings for the specified room (this function needs to be implemented)
    // const meetings = getMeetingsForRoom(roomId);

    // TODO FOR NOW, we will just return a dummy list of meetings. You need to implement the logic to retrieve the actual meetings for the specified room.
    const meetings = [
        { meetingId: 'meeting1', startTime: '100', endTime: '200' },
        { meetingId: 'meeting2', startTime: '400', endTime: '500' }
    ]; // Replace this with actual logic to retrieve meetings for the specified room
    
    // Return the list of meetings for the specified room
    res.status(200).json({ meetings });
});

// TODO get endpoint for getting all of the rooms which currently exist in the room list
app.get('/rooms', (_, res) => {
    // TODO call the function to get all rooms (this function needs to be implemented)
    // const rooms = getAllRooms();

    // TODO FOR NOW, we will just return a dummy list of rooms. You need to implement the logic to retrieve the actual list of rooms.
    const rooms = [
        { 
            roomId: '1', 
            meetings: [
                { meetingId: 'meeting1', startTime: '100', endTime: '200' },
                { meetingId: 'meeting2', startTime: '400', endTime: '500' }
            ],
        },
        {
            roomId: '2',
            meetings: [
                { meetingId: 'meeting3', startTime: '150', endTime: '250' },
                { meetingId: 'meeting4', startTime: '300', endTime: '400' }
            ],
        }
    ]; // Replace this with actual logic to retrieve the list of rooms

    // Return the list of rooms
    res.status(200).json({ rooms });
});


// TODO get endpoint for returning a list of meetings which would conflict with a given meeting (2-element array with start and end time) along with the room id the conflicting meeting belongs to
app.get('/conflicts', (req, res) => {
    // Extract start and end time from the query parameters
    const { startTime, endTime } = req.query;

    // Validate the input
    if (!startTime || !endTime) {
        return res.status(400).json({ error: 'Start time and end time are required.' });
    }

    // TODO call the function to get conflicting meetings (this function needs to be implemented)
    // const conflicts = getConflictingMeetings(startTime, endTime);

    // TODO FOR NOW, we will just return a dummy list of conflicting meetings. You need to implement the logic to retrieve the actual conflicting meetings based on the provided start and end time.
    const conflicts = [
        { meetingId: 'meeting1', roomId: '1', startTime: '100', endTime: '200' },
        { meetingId: 'meeting3', roomId: '2', startTime: '150', endTime: '250' }
    ]; // Replace this with actual logic to retrieve conflicting meetings based on the provided start and end time
    
    // Return the list of conflicting meetings along with their room ids
    res.status(200).json({ conflicts });
});

// TODO get endpoint for returning the number of rooms in the room list
app.get('/roomCount', (_, res) => {
    // TODO call the function to get the number of rooms (this function needs to be implemented)
    // const roomCount = getRoomCount();
    
    // TODO FOR NOW, we will just return a dummy room count. You need to implement the logic to retrieve the actual number of rooms.
    const roomCount = 2; // Replace this with actual logic to retrieve the number of rooms
    // Return the number of rooms in the room list
    res.status(200).json({ roomCount });
});


app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);