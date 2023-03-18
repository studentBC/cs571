const express = require('express');
const app = express();
const apikey = 'uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ';
var SpotifyWebApi = require('spotify-web-api-node');
var client_id = 'e3d4c9a4a4e44b0d83df98d6b6c2571d';
var client_secret = '6ef0289ae08b466194c47a693661ff46';
app.use(express.json());
//https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
//https://stackoverflow.com/questions/23751914/how-can-i-set-response-header-on-express-js-assets
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret
});

function SendRequest(datatosend) {
  function OnResponse(response) {
    var data = '';

    response.on('data', function (chunk) {
      data += chunk; //Append each chunk of data received to this variable.
    });
    response.on('end', function () {
      console.log(data); //Display the server's response, if any.
    });
  }

  var request = http.request(urlparams, OnResponse); //Create a request object.

  request.write(datatosend); //Send off the request.
  request.end(); //End the request.
}
async function callAPI(url) {
  let res;
  console.log('we are going to fetch ' + url);
  await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(response => {
      res = response;
      // console.log(response);
      //console.log(JSON.stringify(response));
      // return response;
    });
  return res;
}

// async function getSpotifyToken() {
//   var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: {
//       'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//     },
//     form: {
//       grant_type: 'client_credentials'
//     },
//     json: true
//   };
//   let ans=''
//   await request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       ans = body.access_token;
//     }
//   });
//   return ans;
// }


//search for events
app.get('/getEvents', async function (request, response) {
  console.log('getEvents was called ...');
  console.log('node JS was called ...');
  let url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=' + apikey + '&';
  console.log("-----------------------");
  console.log(request.query.url);
  console.log("-----------------------");
  url += request.query.url;
  console.log(url);
  console.log('the url we are going to send is ' + url);
  let jbody = await callAPI(url);
  //console.log(jbody);
  //we only need to send necessary property of event object
  const responseData = [];
  for (let i = 0; i < jbody.page.totalElements; i++) {
    if (!jbody._embedded.events[i] ?.dates.start.localDate) break;
    let tmp = [];
    //date column
    tmp.push(jbody._embedded.events[i] ?.dates.start.localDate);
    if (jbody._embedded.events[i] ?.dates.start.localTime) tmp.push(jbody._embedded.events[i] ?.dates.start.localTime);
    else tmp.push('lol');
    //Icon
    tmp.push(jbody._embedded.events[i] ?.images[2].url);
    //Event
    tmp.push(jbody._embedded.events[i] ?.name);
    //Genre
    if (jbody._embedded.events[i] ?.classifications) {
      tmp.push(jbody._embedded.events[i] ?.classifications[0].segment.name);
    } else tmp.push("lol")
    //Venue
    let venue = '';
    for (let k = 0; k < jbody._embedded.events[i]?._embedded?.venues?.length; k++) {
      //tmp.push(jbody._embedded.events[i] ?._embedded.venues[k].name);
      venue += jbody._embedded.events[i] ?._embedded.venues[k].name;
      venue += '|';
    }
    //venue
    tmp.push(venue);
    //event id
    tmp.push(jbody._embedded.events[i]?.id ?? "lol");
    //seat map
    tmp.push(jbody._embedded.events[i]?.seatmap?.staticUrl ?? "lol")
    //ticket status
    tmp.push(jbody._embedded.events[i]?.dates?.status?.code ?? "lol")
    //buy ticket url
    tmp.push(jbody._embedded.events[i]?.url ?? "lol")
    if (jbody._embedded.events[i]?.priceRanges) {
      //price min
      tmp.push((jbody._embedded.events[i]?.priceRanges[0]?.min).toString())
      //price max
      tmp.push((jbody._embedded.events[i]?.priceRanges[0]?.max).toString())
      //currency
      tmp.push(jbody._embedded.events[i]?.priceRanges[0]?.currency ??"USD")
    } else {
      for (let a = 0; a < 3; a++) tmp.push("lol")
    }
    //venue id
    if (jbody?._embedded?.events[i]?._embedded?.venues) {
      tmp.push(jbody._embedded.events[i]?._embedded?.venues[0]?.id)
    } else tmp.push("lol");
    //console.log(tmp);
    //for artist name connect by comma
    let artistName = ""
    console.log(jbody._embedded.events[i])
    for (let a = 0; a < jbody._embedded.events[i]?._embedded.attractions.length; a++) {
      artistName+= jbody._embedded.events[i]?._embedded.attractions[a].name 
      artistName+=","
    }
    console.log(artistName)
    tmp.push(artistName);
    responseData.push(tmp);
  }

  const jsonContent = JSON.stringify(responseData);
  //console.log(jsonContent);
  response.send(jsonContent);
})
//get event detail
app.get('/getEventsDetails', async function (request, response) {
  console.log('getEventsDetails was called ...');
  //let url = 'https://app.ticketmaster.com/discovery/v2/events/'+ +'?apikey='+apikey+'&';
  let url = request.query.url;
  console.log(url);
  let jobj = await callAPI(url);
  console.log(jobj);
  //we only need to send necessary property of event object
  const responseData = new Map();
  //let tmp = new Map();
  if (jobj._embedded.attractions) {
    responseData.set("artistHref", jobj._embedded.attractions[0] ?.url);
    //Genre
    let name = ""
    for (let a = 0; a < jobj._embedded.attractions.length; a++) {
      name += jobj._embedded.attractions[a].name
      name += " | "
    }
    name = name.substring(0, name.length - 2);
    responseData.set("genreName", name);
  }
  let tc = jobj.classifications[0] ?.segment ?.name + " | " + jobj.classifications[0]?.genre?.name +
    " | " + jobj.classifications[0].subGenre ?.name
  tc = tc.replace('undefined', '');
  responseData.set("genre", tc);
  //responseData.push(tmp);
  const jsonContent = Object.fromEntries(responseData);
  response.send(jsonContent);
})
//get Venues for venue LOGO
app.get('/getVenues', async function (request, response) {
  console.log('getVenues was called ...');
  let url = request.query.url;
  console.log(url);
  let jbody = await callAPI(url);
  console.log(jbody);
  //we only need to send necessary property of event object
  const responseData = [];
  for (let i = 0; i < jbody._embedded.venues.length; i++) {
    if (jbody._embedded.venues[i].images) {
        ans =  jbody._embedded.venues[i].images[0].url;
        responseData.push(ans)
    }
}  
  const jsonContent = JSON.stringify(responseData);
  response.send(jsonContent);
})
//get venue details
//https://stackoverflow.com/questions/46634449/json-stringify-of-object-of-map-return-empty?fbclid=IwAR1BahqjZ-DGi3_e82hSFsHDrgjPysHrGf-G_QLG3SSP1mGQ4Pqe8UiWGDc
app.get('/getVenuesDetails', async function (request, response) {
  console.log('getVenues was called ...');
  let url = request.query.url;
  console.log(url);
  let jobj = await callAPI(url);
  console.log(jobj);
  //we only need to send necessary property of event object
  // const outter = [];
  const responseData = new Map();

  if (jobj._embedded?.venues[0]?.address.line1) {
    // add+=jobj.address.line1 +"<br>";
    responseData.set("vdaddr", String(jobj._embedded?.venues[0]?.address.line1 +", "
    + jobj._embedded?.venues[0]?.city.name + ", " + jobj._embedded?.venues[0]?.state.name))
  } else {
    console.log('enter man!!!');
    responseData.set("vdaddr", String( jobj._embedded?.venues[0]?.city.name + ", " + jobj._embedded?.venues[0]?.state.name))
  }
  if (jobj._embedded?.venues[0]?.name) responseData.set("vname", jobj._embedded?.venues[0]?.name);
  else responseData.set("vname", 'fuck');

  let vdphone  = jobj._embedded?.venues[0]?.boxOfficeInfo?.phoneNumberDetail;
  if (vdphone) responseData.set('vdphone', vdphone);
  else responseData.set('vdphone', "no phone number");
  //open hour
  if (jobj._embedded?.venues[0]?.boxOfficeInfo?.openHoursDetail) {
    responseData.set('vdoh', jobj._embedded?.venues[0]?.boxOfficeInfo?.openHoursDetail);
  } else responseData.set('vdoh', "");
  //general rule
  if (jobj._embedded?.venues[0]?.generalInfo?.generalRule) {
    responseData.set('vdgr', jobj._embedded?.venues[0]?.generalInfo?.generalRule);
  } else responseData.set('vdgr', "");
  //children rule
  if (jobj._embedded?.venues[0]?.generalInfo?.childRule) {
    responseData.set('vdcr', jobj._embedded?.venues[0]?.generalInfo?.childRule);
  } else responseData.set('vdcr', '');
  // console.log(responseData.get('vname'));
  // console.log(responseData);
  // response.send(responseData);
  const jsonContent = Object.fromEntries(responseData);
  console.log('------------------------#########----------------------')
  console.log(jsonContent);
  response.send(jsonContent);
})

// for dealing with 
app.get('/getTicketMasterSearch', async function (request, response) {
  console.log('node JS was called ...');
  let url = request.query.url;
  console.log(url);
  let jbody = await callAPI(url);
  console.log(jbody);
  response.send(jbody);
})

// app.get('/getSpotifyAlbums', async function (request, response) {
async function getAlbums(aid){
  let ans = []
  let jobj;
  await spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );

  await spotifyApi
  .getArtistAlbums(aid, { limit: 3, offset: 5 })
  .then(
    function(data) {
      console.log('Album information', data.body);
      jobj = data.body;
    },
    function(err) {
      console.error(err);
    }
  );
  for (let i = 0; i < jobj.items.length; i++) {
    ans.push(jobj.items[i]?.images[0]?.url)
  }
  return ans 
}
  // console.log(ans)
  // const jsonContent = JSON.stringify(ans);
  // response.send(jsonContent);
// })
app.get('/getMobileSpotifyArtist', async function (request, response) {
  console.log('node JS was called ...');
  let artist = request.query.artist;
  console.log('artist is ' + artist)
  // credentials are optional
  
  // Retrieve an access token.
  await spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );
  var jbody
  // for plugin
  await spotifyApi.searchArtists(artist)
  .then(function(data) {
    console.log('Search artists: ' + artist, data.body);
    jbody = data.body
  }, function(err) {
    console.error(err);
  });
  const responseData = new Map();
  console.log('we got ', jbody)
  for (let i = 0; i < jbody.artists.items.length; i++) {
    let temp = []
    //artist id, Followers, Popularity, Spotify Link, artist icon
    temp.push(jbody.artists.items[i].id)
    responseData.set('asid', jbody.artists.items[i].id)
    temp.push(jbody.artists.items[i].followers.total)
    responseData.set('astotal', jbody.artists.items[i].followers.total)
    temp.push(jbody.artists.items[i].popularity)
    responseData.set('aspop', jbody.artists.items[i].popularity)
    temp.push(jbody.artists.items[i].external_urls.spotify)
    responseData.set('asurl', jbody.artists.items[i].external_urls.spotify)
    if (jbody.artists.items[i].images && jbody.artists.items[i].images[0]?.url) {
      temp.push(jbody.artists.items[i].images[0].url)
      responseData.set('asICON', jbody.artists.items[i].images[0].url)
    }
    let tmp = await getAlbums(jbody.artists.items[i].id);
    for (let j = 0; j < 3; j++) {
      if (j < tmp.length) {
        temp.push(tmp[j]);
        responseData.set('album'+j, tmp[j])
      } else {
        responseData.set('album'+j, '')
      }
      
    }
    
    break;
  }
  console.log("---------  the response data is ----------")
  console.log(responseData)
  const jsonContent = Object.fromEntries(responseData);
  //console.log(jsonContent);
  response.send(jsonContent);
  

})


app.get('/getSpotifyArtist', async function (request, response) {
  console.log('node JS was called ...');
  let artist = request.query.artist;
  console.log('artist is ' + artist)
  // credentials are optional
  
  // Retrieve an access token.
  await spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );
  var jbody
  // for plugin
  await spotifyApi.searchArtists(artist)
  .then(function(data) {
    console.log('Search artists: ' + artist, data.body);
    jbody = data.body
  }, function(err) {
    console.error(err);
  });
  const responseData = new Map();
  for (let i = 0; i < jbody.artists.items.length; i++) {
    let temp = []
    //artist id, Followers, Popularity, Spotify Link, artist icon
    temp.push(jbody.artists.items[i].id)
    temp.push(jbody.artists.items[i].followers.total)
    temp.push(jbody.artists.items[i].popularity)
    temp.push(jbody.artists.items[i].external_urls.spotify)
    if (jbody.artists.items[i].images && jbody.artists.items[i].images[0]?.url) {
      temp.push(jbody.artists.items[i].images[0].url)
    }
    let tmp = await getAlbums(jbody.artists.items[i].id);
    for (let j = 0; j < tmp.length; j++) {
      temp.push(tmp[j]);
    }
    responseData.set(jbody.artists.items[i].name, temp)
  }
  console.log("---------  the response data is ----------")
  console.log(responseData)
  const jsonContent = Object.fromEntries(responseData);
  //console.log(jsonContent);
  response.send(jsonContent);
  
  // let token = await getSpotifyToken();
  // https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/
  // await fetch('', {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': 'Bearer ' + token
  //   }
  // })
  // .then(response => response.json())
  // .then(response => {
  //   res = response;
  //   console.log(response);
  //   console.log(JSON.stringify(response));
  //   return response;
  // });
})

app.get('/', (req, res) => {
  console.log(req.body);
  res.send('<h1> Hola !</h1>');
})

app.get('/lol', (req, res) => {
  console.log(req.body);
  res.send('<h1> Hola !</h1>');
})

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`backend server: listening on port ${port}`);
});

// var listener = app.listen(3000, function() {
//   console.log("Listening on port " + listener.address().port);
// });