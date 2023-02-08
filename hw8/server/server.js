const fetch = require('node-fetch');
const express = require('express');
const app = express();
const apikey = 'uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ';
app.use(express.json());
//https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
//https://stackoverflow.com/questions/23751914/how-can-i-set-response-header-on-express-js-assets
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
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
      console.log(JSON.stringify(response));
      // return response;
    });
  return res;
}
//search for events
app.post('/getEvents', async function (request, response) {
  console.log('getEvents was called ...');
  let jObj = request.body;
  console.log('node JS was called ...');
  console.log(jObj);
  let url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=' + apikey + '&';
  url += jObj.url;
  console.log(url);
  let jbody = await callAPI(url);
  //console.log(jbody);
  //we only need to send necessary property of event object
  const responseData = [];
  for (let i = 0; i < jbody.page.totalElements; i++) {
    if (!jbody._embedded.events[i] ?.dates.start.localDate) break;
    let tmp = [];
    //date column
    tmp.push(jbody._embedded.events[i] ?.dates.start.localDate);
    tmp.push(jbody._embedded.events[i] ?.dates.start.localTime);
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
      tmp.push(jbody._embedded.events[i] ?._embedded.venues[k].name);
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
      tmp.push(jbody._embedded.events[i]?.priceRanges[0]?.min)
      //price max
      tmp.push(jbody._embedded.events[i]?.priceRanges[0]?.max)
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
    responseData.push(tmp);
  }

  const jsonContent = JSON.stringify(responseData);
  console.log(jsonContent);
  response.send(jsonContent);
})
//get event detail
app.post('/getEventsDetails', async function (request, response) {
  console.log('getEventsDetails was called ...');
  let jObj = request.body;
  //let url = 'https://app.ticketmaster.com/discovery/v2/events/'+ +'?apikey='+apikey+'&';
  let url = jObj.url;
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
app.post('/getVenues', async function (request, response) {
  console.log('getVenues was called ...');
  let jObj = request.body;
  let url = jObj.url;
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
app.post('/getVenuesDetails', async function (request, response) {
  console.log('getVenues was called ...');
  let jObj = request.body;
  let url = jObj.url;
  console.log(url);
  let jobj = await callAPI(url);
  console.log(jobj);
  //we only need to send necessary property of event object
  // const outter = [];
  const responseData = new Map();
  if (jobj.address.line1) {
    // add+=jobj.address.line1 +"<br>";
    responseData.set("vdaddr", String(jobj.address.line1 +"<br>"+
                                                  jobj.state.name +", "+ jobj.state.stateCode+"<br>"+ jobj.postalCode))
  } else {
    console.log('enter man!!!');
    responseData.set("vdaddr", String( jobj.state.name+", " +jobj.state.stateCode+"<br>"+jobj.postalCode))
  }
  if (jobj.url) responseData.set('vdmehref', jobj.url);
  if (jobj.name) responseData.set("vname", jobj.name);
  // console.log(responseData.get('vname'));
  // console.log(responseData);
  // response.send(responseData);
  const jsonContent = Object.fromEntries(responseData);
  // console.log(jsonContent);
  response.send(jsonContent);
})

// for dealing with 
app.post('/getTicketMasterSearch', async function (request, response) {
  console.log('node JS was called ...');
  let jObj = request.body;
  console.log('node JS was called ...');
  console.log(jObj);
  let url = jObj.url;
  console.log(url);
  let jbody = await callAPI(url);
  console.log(jbody);
  response.send(jbody);
})

app.get('/', (req, res) => {
  console.log(req.body);
  res.send('<h1> Hola !</h1>');
})
app.listen(3000);
