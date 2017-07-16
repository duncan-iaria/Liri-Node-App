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
const spotifyKeys = keys.spotifyKeys;

//console.log( spotifyKeys );

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
    const twitterClient = new twitter( twitterKeys );

    twitterClient.get( 'statuses/user_timeline', onTwitterComplete )
    //console.log( twitterClient );

    function onTwitterComplete( tError, tData )
    {
        if( !tError )
        {
            console.log( colors.bold( '\nMY LATEST TWEETS:\n' ) );
            
            for( let i = 0; i < tData.length; ++i )
            {
                console.log( tData[i].text );    
            }
        }
        else
        {
            console.log( "There was an error with Twitter: " + tError );
        }
    }
}

function getSpotifySong()
{
    spotifyClient = new spotify( spotifyKeys );

    let tempQuery = ""; 

    //build query string
    for( let i = 3; i < userInputs.length; ++i )
    {
        tempQuery += userInputs[i] + " ";
    }

    //build the params object
    let tempQeuryParams = 
    {
        type: 'track',  
        query: tempQuery,      
    };
    
    spotifyClient.search( tempQeuryParams, onSpotifyComplete );

    //callback when spotify request is complete
    function onSpotifyComplete( tError, tData )
    {
        if( tError )
        {
            console.log( "there was an error with Spotify: " +tError );
        }
        else
        {
            //console.log( tData.tracks.items[0] );
            console.log( tData.tracks.items[0].name );
            console.log( tData.tracks.items[0].album.name );
            console.log( tData.tracks.items[0].artists[0].name );
            console.log( tData.tracks.items[0].preview_url );
        }
    }
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