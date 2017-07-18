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
const randomFilePath = "./random.txt";

//possibe actions
const myTweets = 'my-tweets';
const spotifySong = 'spotify-this-song';
const movieThis = 'movie-this';
const doWhatItSays = 'do-what-it-says';
const help = 'help';

processInput();

function processInput( tCommand = null, tParams = null )
{   
    let tempCommand = null;

    if( tCommand )
    {
        tempCommand = tCommand;
    }
    else
    {
        tempCommand = userInputs[2];
    }

    switch( tempCommand )
    {
        case myTweets:
            getTweets( tParams );
            break;

        case spotifySong:
            getSpotifySong( tParams );
            break;

        case movieThis:
            getMovie( tParams );
            break;

        case doWhatItSays:
            getFile();
            break;

        case help:
            showHelp();
            break;

        default:
            showHelp();
            break;
    }
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

function getSpotifySong( tParams )
{
    spotifyClient = new spotify( spotifyKeys );

    let tempQuery = "";

    //if tParams is passed, use that - otherwise use the user unputs
    tParams ? tempQuery = tParams : tempQuery = buildSearchQuery();

    let tempQeuryParams = 
    {
        type: 'track',  
        query: tempQuery,  //builds search query based on inputs
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

function getMovie( tRequest )
{
    let tMovieTitle = "";

    //if the movie was passed in, then use it otherwise use user inputs
    tRequest ? tMovieTitle = tRequest : tMovieTitle = buildSearchQuery( true );

    let tempUrl = 'http://www.omdbapi.com/?t=' + tMovieTitle + '&apikey=' + movieKeys;

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
    fs.readFile( randomFilePath, 'utf8', onReadFileComplete );

    function onReadFileComplete( tError, tData )
    {
        if( tError )
        {
            console.log( "Error reading file: " + tError );
        }
        else
        {
            tempData = tData.split( "," );
            processInput( tempData[0], tempData[1] );
        }
    }
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