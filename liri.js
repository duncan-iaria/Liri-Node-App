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
const log = 'log-stuff';
const help = 'help';


//=======================
// PROGRAM RUN
//=======================
processInput();

//=======================
// INPUT PROCESSING
//=======================
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

        case log:
            logger( 'test', 'green' );
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

    function onTwitterComplete( tError, tData )
    {
        if( !tError )
        {
            logger( '\nMY LATEST TWEETS:\n', 'blue' );
            //console.log( colors.blue( '\nMY LATEST TWEETS:\n' ) );
            
            for( let i = 0; i < tData.length; ++i )
            {
                logger( tData[i].text );    
            }
        }
        else
        {
            logger( "There was an error with Twitter: " + tError );
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
            logger( "there was an error with Spotify: " + tError );
        }
        else
        {
            logger( '\n"' + tData.tracks.items[0].name + '"', 'green' );
            logger( tData.tracks.items[0].album.name );

            for( let i = 0; i < tData.tracks.items[0].artists.length; ++i )
            {
               logger( tData.tracks.items[0].artists[i].name );
            }

            if( tData.tracks.items[0].preview_url )
            {
                logger( tData.tracks.items[0].preview_url, 'blue' );   
            }
            else
            {
                logger( 'no preview url available :(', 'red' );
            }
        }
    }
}

function getMovie( tRequest )
{
    let tMovieTitle = "";

    //if the movie was passed in, then use it otherwise use user inputs
    tRequest ? tMovieTitle = tRequest : tMovieTitle = buildSearchQuery( true );

    let tempUrl = 'http://www.omdbapi.com/?t=' + tMovieTitle + '&apikey=' + movieKeys;

    request.get( tempUrl, onGetMovieComplete );

    function onGetMovieComplete( tError, tResponse, tBody )
    {
        if( tError || tResponse.statusCode !== 200 )
        {
            logger( "Response status code: " + tResponse.statusCode, 'red' );
            logger( "Error when getting movie: " + tError, 'red' )
        }
        else
        {
            const tData = JSON.parse( tBody );
            
            logger(  "\n" + tData.Title + " (" + tData.Year + ")", 'green'  );
            logger( "Filmed in: " + tData.Country );
            logger( "Actors: " + tData.Actors );
            logger( "\nPlot: " + tData.Plot );
            logger( "\nimdb Rating: " + tData.imdbRating, 'blue' );

            for( let i = tData.Ratings.length -1; i >= 0; --i )
            {
                if( tData.Ratings[i].Source === "Rotten Tomatoes" )
                {
                    logger( "Rotten Tomatoes Rating: " + tData.Ratings[i].Value, 'red' );
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
            logger( "Error reading file: " + tError, 'red' );
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
    logger( '\nNeed help? Possible commands are:'.green );
    logger( "\nmy-tweets" );
    logger( "spotify-this-song \<song name\>" );
    logger( "movie-this \<movie name\>" );
    logger( "do-what-it-says" );
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
    }

    return tempQuery;
}

function logger( tLog, tColor )
{
    if( tColor != null )
    {
        console.log( colors[tColor]( tLog ) );
    }
    else
    {
        console.log( tLog );
    }
}