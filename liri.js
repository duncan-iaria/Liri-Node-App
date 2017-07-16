//=======================
// EXTERNAL LIBRARIES
//=======================
const keys = require( './keys.js' );
const fs = require( 'fs' );
const request = require( 'request' );
const twitter = require( 'twitter' );
const spotify = require( 'node-spotify-api' );
const colors = require( 'colors' );

const twitterKeys = keys.twitterKeys;

//=======================
// USER INPUT
//=======================
const userInputs = process.argv;

//possibe actions
const myTweets = 'my-tweets';
const spotifySong = 'spotify-this-song';
const movieThis = 'moveThis';
const doWhatItSays = 'do-what-is-says';
const help = 'help';

switch( userInputs[2] )
{
    case myTweets:
        getTweets();
        break;

    case spotifySong:
        getSpotifySong();
        break;

    case movieThis:
        getMovie();
        break;

    case doWhatItSays:
        getFile();
        break;

    case help:
        showHelp();
        break;

    default:
        break;
}

//=======================
// ACTIONS
//=======================
function getTweets()
{

}

function getSpotifySong()
{

}

function getMovie()
{

}

function getFile()
{

}

function showHelp()
{
    console.log( '\nPossible commands are:'.green );
    console.log( "\nmy-tweets" );
    console.log( "spotify-this-song" );
    console.log( "movie-this" );
    console.log( "do-what-it-says" );
}

function logHelpCommands()
{

}


//console.log( twitterKeys );