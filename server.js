const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

// TODO post endpoint for scheduling a meeting, passing in a 2-element array with start and end time, and return a unique id for the meeting

// TODO post endpoint for cancel a meeting via id


// TODO get endpoint for getting all of the meetings of a particular room, passing in the room id as a query parameter

// TODO get endpoint for getting all of the rooms which currently exist in the room list


// TODO get endpoint for returning a list of meetings which would conflict with a given meeting (2-element array with start and end time) along with the room id the conflicting meeting belongs to

// TODO get endpoint for returning the number of rooms in the room list

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);