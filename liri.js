//=======================
// EXTERNAL LIBRARIES
//=======================
const keys = require( './keys.js' );
const fs = require( 'fs' );
const request = require( 'request' );
const twitter = require( 'twitter' );
const spotify = require( 'node-spotify-api' );
const colors = require( 'colors' );

//KEYS
const twitterKeys = keys.twitterKeys;
const spotifyKeys = keys.spotifyKeys;
const movieKeys = keys.movieKeys

//console.log( spotifyKeys );

//=======================
// USER INPUT
//=======================
const userInputs = process.argv;

//possibe actions
const myTweets = 'my-tweets';
const spotifySong = 'spotify-this-song';
const movieThis = 'movie-this';
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

    let tempQeuryParams = 
    {
        type: 'track',  
        query: buildSearchQuery(),  //builds search query based on inputs
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
    let tempUrl = 'http://www.omdbapi.com/?t=' + buildSearchQuery( true ) + '&apikey=' + movieKeys;

    //console.log( tempUrl );

    request.get( tempUrl, onGetMovieComplete );

    function onGetMovieComplete( tError, tResponse, tBody )
    {
        //console.log( tResponse.statusCode );

        if( tError )
        {
            console.log( "Error when getting movie: " + tError )
        }
        else
        {
            const tData = JSON.parse( tBody );

            //console.log( tData );
            console.log( colors.green( "\n" + tData.Title + " (" + tData.Year + ")" ) );
            console.log( "Filmed in: " + tData.Country );
            console.log( "Actors: " + tData.Actors );
            console.log( "\nPlot: " + tData.Plot );
            console.log( "\nimdb Rating: " + tData.imdbRating );

            for( let i = tData.Ratings.length -1; i >= 0; --i )
            {
                if( tData.Ratings[i].Source === "Rotten Tomatoes" )
                {
                    console.log( "Rotten Tomatoes Rating: " + tData.Ratings[i].Value );
                }
            }
        }
    }
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

function buildSearchQuery( tIsMovie = false )
{
    let tempQuery = "";
    let tempSpacer = " ";
    
    //if it's a movie - use + instead of a space
    if( tIsMovie )
    {
        //if it's a movie and nothing is defined
        if( !userInputs[3] )
        {
            return "Mr.+Nobody";
        }

        tempSpacer = "+";
    }

    for( let i = 3; i < userInputs.length; ++i )
    {
        i == userInputs.length - 1 ? tempQuery += userInputs[i] : tempQuery += userInputs[i] + tempSpacer;
        //tempQuery += userInputs[i] + tempSpacer;
    }

    return tempQuery;
}