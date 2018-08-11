require("dotenv").config();
// fs to read and write files
const fs = require("fs");
// Javascript file holding my authentification keys
var keys = require("./keys");
// Downloaded packages
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
// setting the process.argv object as a variable so I can access any user input
var nodeArgs = process.argv
// Setting variables for the spotify song search and the omdb movie search
var spotifyInput = "";
var movieInput = ""
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////
//////////// TWITTER FUNCTIONALITY //////////////////
/////////////////////////////////////////////////////

// Created a variable to store the parameters required for the Twitter API. Fills in the request later.
var params = { screen_name: 'ugurungsus' };

// Conditional that checks if the user is asking for tweets by grabbing it from the process.argv object
if (nodeArgs[2] === "my-tweets") {

    // Using the syntax from the Twitter API, requests the 
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            // For loop to grab the index of each tweet
            for (let i in tweets)
                console.log(
                    `
Created on: ${[tweets[i].created_at]}
@ugurungsus: ${tweets[i].text}
`)
        }
    });

}
// Else conditional that reminds the user what the commands are, in case they input the wrong one.
else { };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////
//////////// SPOTIFY FUNCTIONALITY //////////////////
/////////////////////////////////////////////////////

// Conditional that checks if the user inputs "spotify-this-song"
if (nodeArgs[2] === "spotify-this-song") {

    // Create a for-in loop that grabs the user's input via the process.env and then concatonates the title of the song
    for (let i in nodeArgs) {

        if (i > 2 && i < nodeArgs.length) {

            spotifyInput = spotifyInput + " " + nodeArgs[i];

        }

    };

    // Calling the Spotify package syntax to search for a track
    spotify
        .search({ type: 'track', query: spotifyInput, limit: 1 })
        .then(function (response) {

            // Create a variable because the Artists are objects stored within an array
            let artistArray = response.tracks.items[0].artists;

            // Loop through the artist array (which holds all the artists as objects) and then console logs the ".name" value of each of those objects.
            for (let i in artistArray) {

                console.log(`Artist name: ${artistArray[i].name}`)

            };

            // Console logs the name of the track
            console.log(`Track Name: ${response.tracks.items[0].name}`);
            // Console logs the preview_url
            console.log(`Preview Url: ${response.tracks.items[0].preview_url}`)
            // Console logs the album's name
            console.log(`Album Name: ${response.tracks.items[0].album.name}`)

        })
        .catch(function (err) {
            console.log(err);
        });

}
else { };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////
//////////// OMDB FUNCTIONALITY /////////////////////
/////////////////////////////////////////////////////


if (nodeArgs[2] === "movie-this") {


    // Loop to find add user's input.
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 2 && i < nodeArgs.length) {

            movieInput = movieInput + "+" + nodeArgs[i];

        }

        else {

            movieInput += nodeArgs[i];

        }
    }

    // add the user's search into the API's queryURL syntax
    var queryUrl = "http://www.omdbapi.com/?t=" + movieInput + "&y=&plot=short&apikey=trilogy";

    // Helps look @ the url in case of errors.
    console.log(queryUrl);

    // request package syntax to pull data from OMDB API.
    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log(
                `
Title: ${JSON.parse(body).Title}

Year Released: ${JSON.parse(body).Year}

Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}

Produced In: ${JSON.parse(body).Country}

Language: ${JSON.parse(body).Language}

Plot: ${JSON.parse(body).Plot}

Actors/Actresses: ${JSON.parse(body).Actors}
`
            );
        }
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////
/////////// DO-WHAT-IT-SAYS /////////////////////////
/////////////////////////////////////////////////////

if (nodeArgs[2] === "do-what-it-says") {

    // Using fs (built into NODE), reads the command and input from the random.txt file
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {throw err}
            
        dataArray = data.split(",")
        // dataArray.push(dataFromText);
        console.log(dataArray);

        spotify
            .search({ type: 'track', query: dataArray[1], limit: 1 })
            .then(function (response) {

                // Create a variable because the Artists are objects stored within an array
                let artistArray = response.tracks.items[0].artists;

                // Loop through the artist array (which holds all the artists as objects) and then console logs the ".name" value of each of those objects.
                for (let i in artistArray) {

                    console.log(`Artist name: ${artistArray[i].name}`)

                };

                // Console logs the name of the track
                console.log(`Track Name: ${response.tracks.items[0].name}`);
                // Console logs the preview_url
                console.log(`Preview Url: ${response.tracks.items[0].preview_url}`)
                // Console logs the album's name
                console.log(`Album Name: ${response.tracks.items[0].album.name}`)

            })
            .catch(function (err) {
                console.log(err);
            });
    })

}
// // Else conditional that reminds the user what the commands are, in case they input the wrong one.
else {
    console.log(`
//////////////////////////////////////////////////////
                Try again!
                Here's a list of valid commands

                1. my-tweets
                2. spotify-this-song
                3. movie-this
                4. do-what-it-says
//////////////////////////////////////////////////////                
                `)
}












