//import modules
require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var keys = require('./keys.js');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//filestream to parse data
const fs = require('fs');

switch (process.argv[2]) {
	case 'my-tweets':
		var user;
		client.get('account/settings', function (err,response) {
			user = response.screen_name;
		});
		
		console.log('These are your last 20 tweets:');
		client.get('statuses/user_timeline', {screen_name:user,count:20}, function (error, tweets, response) {
			if (error) {console.log(error)}
			for (i in tweets) {
				console.log(tweets[i].created_at+'\n'+tweets[i].text);
			}
		});
		
		break;
	case 'spotify-this-song':
		spotify.search({type: 'track',query: process.argv[3],limit:1}).then(function (data) {
			console.log('Artist: '+data.tracks.items[0].artists[0].name);
			console.log('Song: '+data.tracks.items[0].name);
			console.log('Album: '+data.tracks.items[0].album.name);
			console.log('Spotify Link: '+data.tracks.items[0].preview_url);
			/*
			var out = JSON.stringify(data);	
			//output spotify data for analysis
			fs.writeFile('no_return.txt', out, 'utf-8');
			*/
		}).catch(function(err) {
			console.log('Artist: Ace of Base');
			console.log('Song: The Sign');
			console.log('Album: The Sign');
		});
		break;
	case 'movie-this':
		break;
	case 'do-what-it-says':
		break;
	default:
		console.log('Please type in a valid command...');
}
