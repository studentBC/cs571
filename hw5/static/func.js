// document.getElementsByClassName("clickMe").onclick = submitlol;
let lat = 0,
    long = 0,
    res, jsobj, ascending = true,
    prevCol = -1;
let jsonObjArray = [];
let selectedName=''
var logoIMG = 'lol'
let tmKey = 'uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ';

//key: name
//value: venue id, artist team, venue, genre, ticket status, buy website, photo, event id
const idMapping = new Map();
//key: venue id
//value: images url
// const venueMapping = new Map();

function httpGet(theUrl) {
    let xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", theUrl, false);
    xmlHttpReq.send(null);
    return xmlHttpReq.responseText;
}

function initial(jojo) {
    jsobj = jojo;
    jsonObjArray.push(jojo);
}
async function searchVenue(url) {
    console.log('enter searchVenue')
    var ans = 'lol'
    await fetch('/getTicketMasterSearch', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "url": url
        })
    })
    .then(response => response.json())
    .then(response => {
        console.log('we got venue length ' + response._embedded.venues.length);
        //console.log(response);
        for (let i = 0; i < response._embedded.venues.length; i++) {
            if (response._embedded.venues[i].images) {
                console.log(response._embedded.venues[i].id);
                console.log(response._embedded.venues[i].images[0].url);
                ans =  response._embedded.venues[i].images[0].url;
                console.log('answer is ' + ans)
                return ans
            }
        }  
    })
    console.log('exit searchVenue ans is ' + ans)
    return ans
}
async function callAPI(url, mixedKeyWord) {
    console.log('enter callAPI');
    await fetch('/getTicketMasterSearch', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "url": url
            })
        })
        .then(response => response.json())
        .then(response => {
            //console.log(JSON.stringify(response));
            return response;
        })
        .then(response => initial(response))
    // .then(response => createAPIresultTable(response))
    // .then(response => {
    // console.log(jsobj.total);
    // console.log(jsonObjArray[0].total);
    let totalPage = jsobj.page.totalPages;
    console.log('we got ' + totalPage + ' pages');
    for (let i = 1; i < totalPage; i++) {
        let p = (i + 1).toString()
        await fetch('/getTicketMasterSearch', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "url": url + '&page=' + p
                })
            })
            .then(response => response.json())
            .then(response => initial(response));
            // .then(response => {
            //     start += jsobj.businesses.length;
            //     left -= jsobj.businesses.length;
            // });
    }
    console.log('######################');
    console.log(jsonObjArray.length);
    console.log('######################');
    if (jsonObjArray[0].page.totalElements === 0) {
        document.getElementById('notfound').style.display = 'block';
        console.log(jsonObjArray[0]);
        console.log('######################');
        document.getElementById("APIresult").innerHTML = '';
        return;
    } else createAPIresultTable();

    // let Url = 'https://app.ticketmaster.com/discovery/v2/venues?apikey='+ tmKey + '&keyword=' + mixedKeyWord;
    // searchVenue(Url);
}

async function submitlol(event) {
    idMapping.clear();
    jsonObjArray = [];
    document.getElementById('notfound').style.display = 'none';
    console.log('---- not show elems ---');
    console.log(event);
    // document.getElementById("APIresult").style.display = "none";
    document.getElementById("outerMargin").style.display = "none";
    document.getElementById("searchResult").style.display = "none";
    // for (let i = 0; i < a.length; i++) a[i].style.display = "none";
    // for (let i = 0; i < b.length; i++) b[i].style.display = "none";
    // for (let i = 0; i < b.length; i++) c[i].style.display = "none";
    // const ele = document.getElementsByClassName("outerMargin");
    // for (let i = 0; i < ele.length; i++) ele[i].style.display = "none";
    // const el = document.getElementById("venueDetails");
    // for (let i = 0; i < el.length; i++) el[i].style.display = "none";
    console.log('---- not show elems ---');
    //form submit will refresh my page and clear log
    event.preventDefault();
    console.log('---- go here -----');
    var kw = "",
        loc = "Taipei",
        selfLocate = false,
        fc = "Default",
        dist = 10;
    kw = document.forms["partOne"]["kw"].value;
    loc = '';
    if (document.getElementById('inputLoc').style.display != 'none') {
        loc = document.forms["partOne"]["location"].value;
    }
    console.log('-------   ' + loc + '   --------');
    selfLocate = document.forms["partOne"]["autoDetect"].checked;
    fc = document.forms["partOne"]["fc"].value;
    dist = document.forms["partOne"]["dm"].value;
    let dd = '';
    let latlng = '&latlong=';
    let lat=""
    let lng=""
    if (dist) dd = '&radius=' + dist + '&unit=miles'
    if (!selfLocate && loc != "") {
        //use google geoapi to get lat lng
        let location = loc.replace(/\s+/g, '+');
        let gkey = 'AIzaSyBdSh29p_B93XTLF7qB0XtnfnjxQudHCA8';
        let gr = httpGet('https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=' + gkey);
        //call python get method to get the address
        let res = JSON.parse(gr);
        console.log(res);
        latlng+=res.results[0].geometry.location.lat + ','+res.results[0].geometry.location.lng;
        lat = res.results[0].geometry.location.lat;
        lng = res.results[0].geometry.location.lng;
    }
    const geohash = Geohash.encode(lat, lng, 7);
    if (loc === "" && selfLocate) {
        await fetch('https://ipinfo.io', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer c74fd8c3b95806'
            }
        })
        .then(response => response.json())
        .then(response => {
            //console.log(response);
            loc = response.region + ' '+ response.city;
            latlng+=response.loc
            console.log(loc);
        });
    }
    console.log('our lat lng is ' + latlng);
    let mixedKeyWord = kw + ' ' + loc;
    mixedKeyWord = mixedKeyWord.replace(/\s+/g, '%20');
    //https://app.ticketmaster.com/discovery/v2/venues?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ&keyword=Los%20Angeles%20Memorial%20Coliseum
    let url = '';
    if (fc == 'default') {
        fc = 'KZFzniwnSyZfZ7v7nJ,%20KZFzniwnSyZfZ7v7nE,%20KZFzniwnSyZfZ7v7na,%20KZFzniwnSyZfZ7v7nn,%20KZFzniwnSyZfZ7v7n1'
    }
    console.log(fc);
    url = 'https://app.ticketmaster.com/discovery/v2/events?apikey=' + tmKey + '&keyword=' + mixedKeyWord + '&segmentId=' + fc + '&size=200' + dd + latlng;
    console.log("-----------------");
    console.log(url);
    console.log("-----------------");
    jsonObjArray = [];
    callAPI(url, mixedKeyWord);
}
function hideLocInput() {
    let cb = document.getElementById('cbox');
    if (cb.checked == true) {
        document.getElementById("inputLoc").removeAttribute("required");
        document.getElementById('inputLoc').style.display = 'none';
    } else {
        document.getElementById('inputLoc').style.display = 'block';
    }
}
async function showVenue() {
    console.log('=== enter showVenue ===')
    const elems = document.getElementsByClassName("venueBut");
    for (let i = 0; i < elems.length; i++) elems[i].style.display = 'none';
    
    let eid = idMapping.get(selectedName)[0];
    //Z7r9jZ1AdbxAM
    console.log('the eid we got is '+ eid);
    //document.getElementById("vdIMG").src = ;
    //we need to get address through the api link:
    let jobj;
    let url = 'https://app.ticketmaster.com/discovery/v2/venues/'+eid+'.json?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ&id=KovZpZA7AAEA';
    await fetch('/getTicketMasterSearch', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "url": url
            })
        })
        .then(response => response.json())
        .then(response => {
            jobj = response;
            console.log(JSON.stringify(response));
            return response;
        })
    //we will start from here
    if (logoIMG!='lol') {
        document.getElementById('vdIMG').style.display = 'block';
        document.getElementById('vdIMG').src = logoIMG;//idMapping.get(selectedName)[9]; //jobj.venues[0].images[0].url;
    } else {
        // console.log("lets go man!!!")
        // for (let a = 0; a < idMapping.get(selectedName).length; a++) {
        //     console.log(idMapping.get(selectedName)[a]);
        // }
        document.getElementById('vdIMG').style.display = 'none';
    }
    // let add = 'Address: ';
    if (jobj.address.line1) {
        // add+=jobj.address.line1 +"<br>";
        document.getElementById('vdaddr').innerHTML = jobj.address.line1 +"<br>"+
                                                    jobj.state.name +", "+ jobj.state.stateCode+"<br>"+ jobj.postalCode
    } else {
        document.getElementById('vdaddr').innerHTML = jobj.state.name+", " +jobj.state.stateCode+"<br>"+jobj.postalCode
    }
    if (jobj.url) document.getElementById('vdme').href = jobj.url;
    //for google map URL
    //it will encouner repeat state or city name especially new york ...
    //let kw = jobj.state.name +'+'+ jobj.city.name + '+' + jobj.name;
    let kw = jobj.name + '+' + jobj.postalCode;
    kw = kw.replace(/\s/g, '+')
    document.getElementById('vdgm').href = 'https://www.google.com/maps/search/'+kw;
    console.log('=============');
    console.log(document.getElementById('vdgm').href);
    console.log('=============');
    document.getElementById("vdHeader").innerHTML = jobj.name;

    const ele = document.getElementsByClassName("outerMargin");
    for (let i = 0; i < ele.length; i++) ele[i].style.display = "block";
    const elem = document.getElementById("venueDetails");
    elem.style.display = 'block';
    console.log(elem.style.display);
    for (let i = 0; i < elem.length; i++) elem[i].style.display = 'block';
    
}
function sortColumn(array, col) {
    if (prevCol == col) ascending = !ascending;
    if (ascending) {
        array.sort(function (a, b) {
            var x = a[col];
            var y = b[col];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    } else {
        array.sort(function (a, b) {
            var x = a[col];
            var y = b[col];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    }
    let table = document.getElementById("APIresultTable");
    for (let i = 1; i < array.length; i++) {
        table.rows[i].cells[0].innerText = array[i][0] + '\n' + array[i][1];
        //the image is not inner text so we need to change it!
        //table.rows[i].cells[1].innerText = array[i][1];
        table.rows[i].cells[1].innerText = "";
        let img = document.createElement('img');
        img.style.width = "50%";
        img.style.objectFit = 'scale-down';
        img.style.maxWidth = '150px';
        img.style.marginBottom =  '10px';
        img.style.marginTop =  '10px';
        img.src = array[i][2];
        table.rows[i].cells[1].appendChild(img);
        //the business name still need to show its link
        table.rows[i].cells[2].innerText = array[i][3];
        table.rows[i].cells[3].innerText = array[i][4];
        table.rows[i].cells[4].innerText = array[i][5];
    }
    prevCol = col;
}

function createAPIresultTable() {
    console.log('enter to createAPIresultTable');
    //store json obj into data array
    var len = jsonObjArray.length;
    console.log(len);
    let data = [];
    data = [];
    if (len > 0) {
        console.log('enter to creat !!!');
        const elems = document.getElementsByClassName("APIresult");
        console.log('=== go remove table ===');
        document.getElementById("APIresult").innerHTML = "";
        // const elem = document.getElementById("APIresult").innerHTML = "";
        // while(elem.firstChild){
        //     elem.removeChild(elem.firstChild);
        // }
        console.log('=== empty the table ===');
        for (let i = 0; i < elems.length; i++) elems[i].style.display = 'block';
        // elems.innerHTML = "";
        for (let j = 0; j < len; j++) {
            let jsonObj = jsonObjArray[j];
            console.log('jsonObj length is ' + jsonObj.page.totalElements);
            for (let i = 0; i < jsonObj.page.totalElements; i++) {
                let tmp = [];
                let temp = [];
                //date column
                tmp.push(jsonObj._embedded.events[i] ?.dates.start.localDate);
                tmp.push(jsonObj._embedded.events[i] ?.dates.start.localTime);
                //Icon
                tmp.push(jsonObj._embedded.events[i] ?.images[2].url);
                //Event
                tmp.push(jsonObj._embedded.events[i] ?.name);
                //Genre
                if (jsonObj._embedded.events[i] ?.classifications) {
                    tmp.push(jsonObj._embedded.events[i] ?.classifications[0].segment.name);
                } else tmp.push("lol")
                //Venue
                let venue = '';
                for (let k = 0; k < jsonObj._embedded.events[i] ?._embedded.venues.length; k++) {
                    tmp.push(jsonObj._embedded.events[i] ?._embedded.venues[k].name);
                    venue += jsonObj._embedded.events[i] ?._embedded.venues[k].name;
                    venue += '|';
                }
                data.push(tmp);
                //value: venue id, artist team, venue, genre, ticket range, ticket status, buy website, photo
                //console.log(jsonObj._embedded.events[i].venues[0]?.id);
                if (jsonObj._embedded.events[i]._embedded.venues[0].id) temp.push(jsonObj._embedded.events[i]._embedded.venues[0]?.id);//venues.id = venue's id eg: ZFr9jZAFkF
                else temp.push('ZFr9jZAFkF');

                // artist team should be changed again for search for event/id 
                if (jsonObj._embedded.events[i] ?._embedded.attractions) temp.push(jsonObj._embedded.events[i] ?._embedded.attractions[0].name);
                else temp.push('lol');
                //
                venue = venue.substring(0, venue.length - 1);
                temp.push(venue);
                //
                temp.push(jsonObj._embedded.events[i] ?.classifications[0].segment.name);
                let prange = '???';
                //console.log(jsonObj._embedded.events[i] ?.priceRanges);
                if (jsonObj._embedded.events[i].priceRanges && jsonObj._embedded.events[i] ?.priceRanges?.length > 0) {
                    prange = jsonObj._embedded.events[i] ?.priceRanges[0].min + '-' + jsonObj._embedded.events[i] ?.priceRanges[0].max 
                    if (jsonObj._embedded.events[i] ?.priceRanges.currency) prange+=jsonObj._embedded.events[i] ?.priceRanges.currency;
                    else prange+= ' USD'
                }
                //
                temp.push(prange);
                //
                temp.push(jsonObj._embedded.events[i] ?.dates.status.code);
                //
                temp.push(jsonObj._embedded.events[i] ?.url);
                //console.log(jsonObj._embedded.events[i] ?.seatmap.staticUrl);
                if (jsonObj._embedded.events[i] ?.seatmap?.staticUrl) temp.push(jsonObj._embedded.events[i] ?.seatmap.staticUrl);
                else temp.push(jsonObj._embedded.events[i] ?.url);
                //artist url need event id to find it
                temp.push(jsonObj._embedded.events[i] ?.id);
                //for venue logo img should be in event/id that search result
                //if (jsonObj._embedded.events[i] ?._embedded?.venues && jsonObj._embedded.events[i] ?._embedded?.venues[0]?.images) temp.push(jsonObj._embedded.events[i] ?._embedded?.venues[0]?.images[0]?.url);
                idMapping.set(jsonObj._embedded.events[i] ?.name, temp);
            }
        }
        console.log('data length is ' + data.length);
    }
    var table = document.createElement('table');
    table.setAttribute("id", "APIresultTable");
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');

    var text1 = document.createElement('p');
    text1.classList.add("headerCell");
    text1.innerHTML = 'Date';

    var text2 = document.createElement('p') ;
    text2.classList.add("headerCell");
    text2.innerHTML = 'Icon';

    var text3 = document.createElement('p') ;
    text3.classList.add("headerCell");
    text3.innerHTML = 'Event';

    var text4 = document.createElement('p') ;
    text4.classList.add("headerCell");
    text4.innerHTML = 'Genre';
    
    var text5 = document.createElement('p') ;
    text5.classList.add("headerCell");
    text5.innerHTML = 'Venue';


    // tr.classList.add("arow");
    td1.appendChild(text1);
    td1.classList.add("no");
    
    //td1.addEventListener("click", ()=>sortColumn(0));
    td2.appendChild(text2);
    td2.classList.add("img");

    //td2.addEventListener("click", ()=>sortColumn(1));
    td3.appendChild(text3);
    td3.classList.add("fevent");


    td3.addEventListener("click", () => sortColumn(data, 3));
    td4.appendChild(text4);
    td4.classList.add("fgenre");

    td4.addEventListener("click", () => sortColumn(data, 4));
    td5.appendChild(text5);
    td5.classList.add("fvenue");

    td5.addEventListener("click", () => sortColumn(data, 5));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);

    table.appendChild(tr);
    console.log('before creating table ...');
    console.log('data length is ' + data.length);
    for (let i = 0; i < data.length; i++) {
        tr = document.createElement('tr');
        // tr.classList.add("arow");
        td1 = document.createElement('td');
        td1.classList.add("no");
        td2 = document.createElement('td');
        td2.classList.add("img");
        td2.classList.add("icon");
        //let nav3 = document.createElement('nav');
        //we shall create <nav> </nav>
        // nav3.classList.add("nav-link");
        td3 = document.createElement('td');
        td3.classList.add("bn");
        console.log('');
        // td3.classList.add("nav");
        //creating a function which will not be executed immediately => moreinfo.bind(null, jsonObj.businesses[i].name)
        //td3.addEventListener("click", moreInfo.bind(null, jsonObj.businesses[i].name));
        let day = data[i][0]+' '+data[i][1];
        td3.addEventListener("click", () => moreInfo(i+1, day));
        td4 = document.createElement('td');
        td4.classList.add("rating");
        td5 = document.createElement('td');
        td5.classList.add("dist");


        text1 = document.createElement('p')
        text1.classList.add("datetn");
        text1.innerHTML = data[i][0]+ "<br>"+data[i][1];
        //text1 = document.createTextNode(data[i][0] + '\n' + data[i][1]);
        text2 = document.createElement('img');
        //text2.src = jsonObj.businesses[i].image_url;
        text2.src = data[i][2];
        text2.style.width = "50%";
        text2.style.objectFit = 'scale-down';
        text2.style.maxWidth = '150px';
        text2.style.marginBottom =  '10px';
        text2.style.marginTop =  '10px';
        // text3 = document.createTextNode(jsonObj.businesses[i].name);
        // text4 = document.createTextNode(jsonObj.businesses[i].rating);
        // text5 = document.createTextNode(jsonObj.businesses[i].distance);
        text3 = document.createElement('p')
        text3.classList.add("datetn");
        text3.innerHTML = data[i][3];
        //text3 = document.createTextNode(data[i][3]);
        text4 = document.createElement('p')
        text4.classList.add("datetn");
        text4.innerHTML = data[i][4];
        //text4 = document.createTextNode(data[i][4]);
        let place = '';
        for (let a = 5; a < data[i].length; a++) place += (data[i][a] + '<br>');
        text5 = document.createElement('p')
        text5.classList.add("datetn");
        text5.innerHTML = place;
        //text5 = document.createTextNode(place);
        // console.log(jsonObj.businesses[i].name);
        // console.log(jsonObj.businesses[i].rating);
        // console.log(jsonObj.businesses[i].distance);
        td1.appendChild(text1);
        td2.appendChild(text2);
        td3.appendChild(text3);
        td4.appendChild(text4);
        td5.appendChild(text5);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        table.appendChild(tr);
    }
    document.getElementsByClassName("APIresult")[0].appendChild(table);
    table.style.marginTop = '40px';
    table.style.marginBottom = '40px';
    //table.classList.add('table-bordered');
    console.log('after creating table ...');
}

function showPosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    console.log(lat);
    console.log(long);
}

function cc() {
    document.forms["partOne"].reset();
    document.getElementById("APIresult").innerHTML = '';
    document.getElementById('notfound').style.display = 'none';
    document.getElementById("inputLoc").style.display = 'block';
    idMapping.clear();
    jsonObjArray = [];
    // let elems = document.getElementsByClassName("APIresult");
    // for (let i = 0; i < elems.length; i++) elems[i].remove();
    elems = document.getElementsByClassName("searchResult");
    for (let i = 0; i < elems.length; i++) elems[i].style.display = "none";
    const ele = document.getElementsByClassName("outerMargin");
    for (let i = 0; i < ele.length; i++) ele[i].style.display = "none";
    const el = document.getElementById("venueDetails");
    for (let i = 0; i < el.length; i++) el[i].style.display = "none";
    const elem = document.getElementsByClassName("venueBut");
    for (let i = 0; i < elem.length; i++) elem[i].style.display = 'none';
}
//when user click the title and ask for more info
async function moreInfo(row, day) {
    let table = document.getElementById("APIresultTable");
    let name = table.rows[row].cells[2].innerText
    console.log('enter moreInfo');
    const elems = document.getElementsByClassName("searchResult");
    for (let i = 0; i < elems.length; i++) elems[i].style.display = 'block';
    ////value: id, artist team, venue, genre, ticket range, ticket status, buy website, photo
    document.getElementById("moreInfoHeader").textContent = name;
    document.getElementById("moreInfoDate").textContent = day.replace('undefined','');
    // if (idMapping.get(name)[1] != 'lol') {
    //     document.getElementById("moreInfoAT").textContent = idMapping.get(name)[1];
    // }
    document.getElementById("moreInfoVenue").textContent = idMapping.get(name)[2]
    document.getElementById("moreInfoGen").textContent = idMapping.get(name)[3] 
    console.log("######" + idMapping.get(name)[4] + "######")
    for (let j = 0; j < idMapping.get(name).length; j++) {
        console.log(idMapping.get(name)[j])
    }
    if (idMapping.get(name)[4] != "???") {
        document.getElementById("prangeTitle").innerHTML = "Price Ranges"
        document.getElementById("moreInfoRange").textContent = idMapping.get(name)[4]
    }
    let ticketStatius = idMapping.get(name)[5];
    document.getElementById("moreInfoSta").removeAttribute('class');;
    document.getElementById("moreInfoSta").innerHTML = "";
    if (ticketStatius === 'onsale') {
        document.getElementById("moreInfoSta").classList.add('onSale');
        document.getElementById("moreInfoSta").innerHTML = 'On Sale';
    } else if (ticketStatius === 'offsale') {
        document.getElementById("moreInfoSta").classList.add('offSale');
        document.getElementById("moreInfoSta").innerHTML = 'Off Sale';
    } else {
        document.getElementById("moreInfoSta").classList.add('rescheduled');
        document.getElementById("moreInfoSta").innerHTML = 'Rescheduled';
    }
    
    document.getElementById("moreInfoBuy").href = idMapping.get(name)[6];
    console.log(idMapping.get(name)[7]);
    //error occur
    document.getElementById("moreInfoIMG").src = idMapping.get(name)[7];
    //go search for venue
    let Url = 'https://app.ticketmaster.com/discovery/v2/venues?apikey='+ tmKey + '&keyword=' + idMapping.get(name)[2];
    //let logoIMG = await searchVenue(Url);
    console.log('enter searchVenue')
    logoIMG = "lol";
    await fetch('/getTicketMasterSearch', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "url": Url
        })
    })
    .then(response => response.json())
    .then(response => {
        if (response._embedded?.venues != null) {
            console.log('we got venue length ' + response._embedded.venues.length);
            console.log(response);
            for (let i = 0; i < response._embedded.venues.length; i++) {
                if (response._embedded.venues[i].images) {
                    console.log(response._embedded.venues[i].id);
                    console.log(response._embedded.venues[i].images[0].url);
                    logoIMG =  response._embedded.venues[i].images[0].url;
                    console.log('answer is ' + logoIMG)
                }
            }  
        }
    })

    console.log('we got logo img: ' + logoIMG)

    //under discovery/v2/events/{id}
    console.log('### going to check event ID:' + idMapping.get(name)[8] + ' ###');
    let url = 'https://app.ticketmaster.com/discovery/v2/events/'+ idMapping.get(name)[8]+ '.json?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ';
    let jobj;
    await fetch('/getTicketMasterSearch', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "url": url
            })
        })
        .then(response => response.json())
        .then(response => {
            jobj = response;
            console.log(JSON.stringify(response));
            return response;
        })
    //this property might not have data in it ... do this!
    if (jobj._embedded.attractions) {
        document.getElementById("moreInfoAT").href = jobj._embedded.attractions[0]?.url;
        document.getElementById("moreInfoATT").innerHTML = "Artist/Team"
        //Genre
        let name = ""
        for (let a = 0; a < jobj._embedded.attractions.length; a++) {
            name+=jobj._embedded.attractions[a].name
            name+=" | "
        }
        name = name.substring(0, name.length - 2);
        document.getElementById("moreInfoAT").textContent = name
    }
    let tc = jobj.classifications[0]?.segment?.name + " | " + jobj.classifications[0]?.genre?.name 
            + " | " + jobj.classifications[0].subGenre?.name
    tc = tc.replace('undefined','');
    document.getElementById("moreInfoGen").textContent = tc

    //venue logo the venue id may be not match to 
    console.log('trying to get venue id: ' + jobj._embedded.venues[0].id + ' : ' + logoIMG)
    idMapping.get(name).push(logoIMG)

    console.log("-----  we are going to show button   -----");
    //here display venue button
    const elem = document.getElementsByClassName("venueBut");
    elem.display = "block";
    for (let i = 0; i < elem.length; i++) elem[i].style.display = "block";
    selectedName = name;
    console.log('showing our button man!!!')
    const ele = document.getElementsByClassName("outerMargin");
    for (let i = 0; i < ele.length; i++) ele[i].style.display = "none";
    const el = document.getElementById("venueDetails");
    for (let i = 0; i < el.length; i++) el[i].style.display = "none";
}