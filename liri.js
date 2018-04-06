//import modules
require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');

var keys = require('./keys.js');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//filestream to parse data
const fs = require('fs');

switch (process.argv[2]) {
	case 'my-tweets':
		myTweets();	
		break;
	case 'spotify-this-song':
		spotifyThisSong(process.argv[3]);
		break;
	case 'movie-this':
		movieThis(process.argv[3]);
		break;
	case 'do-what-it-says':
		fs.readFile('random.txt', 'utf-8',function (err,data) {
			data = data.split(',');
			switch (data[0]) {
				case 'my-tweets':
					myTweets();	
					break;
				case 'spotify-this-song':
					spotifyThisSong(data[1]);
					break;
				case 'movie-this':
					movieThis(data[1]);
					break;
				default:
					console.log('Please type in a valid command...');
			}
		});
		break;
	default:
		console.log('Please type in a valid command...');
}

function myTweets() {
	//Grab user screen_name based on .env tokens
	var user;
	client.get('account/settings', function (err,response) {
		user = response.screen_name;
	});
	
	//Output user's last 20 tweets	
	console.log('These are your last 20 tweets:');
	client.get('statuses/user_timeline', {screen_name:user,count:20}, function (error, tweets, response) {
		if (error) {console.log(error)}
		for (i in tweets) {
			console.log(tweets[i].created_at+'\n'+tweets[i].text);
		}
	});
}

function spotifyThisSong(name) {
	spotify.search({type: 'track',query: name,limit:1}).then(function (data) {
		console.log('Artist: '+data.tracks.items[0].artists[0].name);
		console.log('Song: '+data.tracks.items[0].name);
		console.log('Album: '+data.tracks.items[0].album.name);
		console.log('Spotify Link: '+data.tracks.items[0].preview_url);
		/* // Used to dissect JSON 
		var out = JSON.stringify(data);	
		fs.writeFile('no_return.txt', out, 'utf-8');
		*/
	}).catch(function(err) {
		console.log('Artist: Ace of Base');
		console.log('Song: The Sign');
		console.log('Album: The Sign');
	});
}

function movieThis(name) {
	var url ="http://www.omdbapi.com/?apikey=trilogy"
	//If user doesn't give valid name, use Mr. Nobody
	process.argv[3] ? url += '&t='+process.argv[3] : url += '&t=Mr. Nobody';
	url += '&type=movie';
	request(url, function (err,resp,body) {
		//Used for development
		//fs.writeFile('omdb.txt',body,'utf-8');
		body = JSON.parse(body);
		console.log('Title: '+body.Title);
		console.log('Year: '+body.Year);
		console.log('IMDB Rating: '+body.Ratings[0].Value);
		console.log('Rotten Tomatoes Rating: '+body.Ratings[1].Value);
		console.log('Countries Produced: '+body.Country);
		console.log('Languages: '+body.Language);
		console.log(body.Plot);
		console.log('Actors: '+body.Actors);
	});
}
