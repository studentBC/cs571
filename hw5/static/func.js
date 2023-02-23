// document.getElementsByClassName("clickMe").onclick = submitlol;
let lat = 0,
    long = 0,
    res, jsobj, ascending = true,
    prevCol = -1;
let jsonObjArray = [];
let selectedName=''
var logoIMG = 'lol'
var latlng = '&geoPoint=';
let tmKey = 'uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ';
const base32 = '0123456789bcdefghjkmnpqrstuvwxyz'; // (geohash-specific) Base32 map
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
    var ans = 'lol'
    await fetch('/getTicketMasterSearch?' + new URLSearchParams({
        "url": url
    }))
    .then(response => response.json())
    .then(response => {
        for (let i = 0; i < response._embedded.venues.length; i++) {
            if (response._embedded.venues[i].images) {
                ans =  response._embedded.venues[i].images[0].url;
                return ans
            }
        }  
    })
    return ans
}
async function callAPI(url, mixedKeyWord) {
    console.log('enter callAPI');

        await fetch('/getTicketMasterSearch?' + new URLSearchParams({
            "url": url
        }))
        .then(response => response.json())
        .then(response => {
            console.log(JSON.stringify(response));
            return response;
        })
        .then(response => initial(response))
    // .then(response => createAPIresultTable(response))
    // .then(response => {
    // console.log(jsobj.total);
    // console.log(jsonObjArray[0].total);
    // let totalPage = jsobj.page.totalPages;
    // console.log('we got ' + totalPage + ' pages');
    // for (let i = 1; i < totalPage; i++) {
    //     let p = (i + 1).toString()
    //     await fetch('/getTicketMasterSearch?' + new URLSearchParams({
    //         "url": url+ '&page=' + p
    //     }))
    //     .then(response => response.json())
    //     .then(response => initial(response));
    // }
    console.log('######################');
    console.log(jsonObjArray.length);
    console.log('######################');
    if (jsonObjArray[0].page.totalElements === 0) {
        document.getElementById('notfound').style.display = 'block';
        console.log(jsonObjArray[0]);
        console.log('######################');
        document.getElementById("APIresult").innerHTML = '';
        const elem = document.getElementsByClassName("venueBut");
        for (let i = 0; i < elem.length; i++) elem[i].style.display = 'none';
        return;
    } else createAPIresultTable();

    // let Url = 'https://app.ticketmaster.com/discovery/v2/venues?apikey='+ tmKey + '&keyword=' + mixedKeyWord;
    // searchVenue(Url);
}

async function submitlol(event) {
    idMapping.clear();
    jsonObjArray = [];
    document.getElementById('notfound').style.display = 'none';
    console.log(event);
    // document.getElementById("APIresult").style.display = "none";
    document.getElementById("outerMargin").style.display = "none";
    document.getElementById("searchResult").style.display = "none";
    //form submit will refresh my page and clear log
    event.preventDefault();
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
    latlng = '&geoPoint=';
    //let latlng = '&geoPoint=';
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
        //latlng+=res.results[0].geometry.location.lat + ','+res.results[0].geometry.location.lng;
        if (res.results[0]) {
            lat = res.results[0].geometry.location.lat;
            lng = res.results[0].geometry.location.lng;
        } else {
            alert("Invalid Location!");
            return;
        }
    }
    
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
            const temp = response.loc.split(",");
            lat=temp[0]
            lng = temp[1]
        });
    }
    const geohash = encode(lat, lng, 7);
    latlng+=geohash
    let mixedKeyWord = kw;
    mixedKeyWord = mixedKeyWord.replace(/\s+/g, '%20');
    //https://app.ticketmaster.com/discovery/v2/venues?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ&keyword=Los%20Angeles%20Memorial%20Coliseum
    let url = '';
    if (fc == 'default') {
        fc = ''
    }
    url = 'https://app.ticketmaster.com/discovery/v2/events?apikey=' + tmKey + '&keyword=' + mixedKeyWord + '&segmentId=' + fc + '&size=20' + dd + latlng;
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
    const elems = document.getElementsByClassName("venueBut");
    for (let i = 0; i < elems.length; i++) elems[i].style.display = 'none';
    //using venue name + geoid to search
    let eid = '&keyword='+idMapping.get(selectedName)[2].replace(/\s+/g, '%20');
    eid+=latlng;
    //Z7r9jZ1AdbxAM
    //console.log('the eid we got is '+ eid);
    //document.getElementById("vdIMG").src = ;
    //we need to get address through the api link:
    let jobj;
    let url = 'https://app.ticketmaster.com/discovery/v2/venues?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ'+eid;
    await fetch('/getTicketMasterSearch?' + new URLSearchParams({
        "url": url
    }))
    .then(response => response.json())
    .then(response => {
        jobj = response;
        console.log(JSON.stringify(response));
        return response;
    })
    if (!jobj._embedded?.venues[0]) return;
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
    if (jobj._embedded?.venues[0]?.address.line1) {
        // add+=jobj.address.line1 +"<br>";
        document.getElementById('vdaddr').innerHTML = jobj._embedded?.venues[0]?.address.line1 +"<br>"+
                                                    jobj._embedded?.venues[0]?.state.name +", "+ jobj._embedded?.venues[0]?.state.stateCode+"<br>"+ jobj._embedded?.venues[0]?.postalCode
    } else {
        document.getElementById('vdaddr').innerHTML = jobj._embedded?.venues[0]?.state.name+", " +jobj._embedded?.venues[0]?.state.stateCode+"<br>"+jobj._embedded?.venues[0]?.postalCode
    }
    if (jobj._embedded?.venues[0]?.url) document.getElementById('vdme').href = jobj._embedded?.venues[0]?.url;
    //for google map URL
    //it will encouner repeat state or city name especially new york ...
    //let kw = jobj.state.name +'+'+ jobj.city.name + '+' + jobj.name;
    let kw = jobj._embedded?.venues[0]?.name + '+' + jobj._embedded?.venues[0]?.postalCode;
    kw = kw.replace(/\s/g, '+')
    document.getElementById('vdgm').href = 'https://www.google.com/maps/search/'+kw;
    document.getElementById("vdHeader").innerHTML = jobj._embedded?.venues[0]?.name;

    const ele = document.getElementsByClassName("outerMargin");
    for (let i = 0; i < ele.length; i++) ele[i].style.display = "block";
    const elem = document.getElementById("venueDetails");
    elem.style.display = 'block';
    for (let i = 0; i < elem.length; i++) elem[i].style.display = 'block';
    document.getElementById("venueDetails").scrollIntoView({ behavior: "smooth"})
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
    //store json obj into data array
    var len = jsonObjArray.length;
    let data = [];
    data = [];
    if (len > 0) {
        const elems = document.getElementsByClassName("APIresult");
        document.getElementById("APIresult").innerHTML = "";
        
        for (let i = 0; i < elems.length; i++) elems[i].style.display = 'block';
        // elems.innerHTML = "";
        for (let j = 0; j < len; j++) {
            let jsonObj = jsonObjArray[j];
            console.log('jsonObj length is ' + jsonObj.page.totalElements);
            for (let i = 0; i < jsonObj.page.totalElements; i++) {
                let tmp = [];
                let temp = [];
                if (jsonObj._embedded?.events[i]) {
                    //date column
                    tmp.push(jsonObj._embedded?.events[i] ?.dates.start.localDate);
                    tmp.push(jsonObj._embedded?.events[i] ?.dates.start.localTime);
                    //Icon
                    tmp.push(jsonObj._embedded?.events[i] ?.images[2].url);
                    //Event
                    tmp.push(jsonObj._embedded?.events[i] ?.name);
                    //Genre
                    if (jsonObj._embedded?.events[i] ?.classifications) {
                        tmp.push(jsonObj._embedded.events[i] ?.classifications[0].segment.name);
                    } else tmp.push("N/A")
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
                    if (jsonObj._embedded.events[i]?._embedded?.venues[0].id) temp.push(jsonObj._embedded.events[i]._embedded.venues[0]?.id);//venues.id = venue's id eg: ZFr9jZAFkF
                    else temp.push('ZFr9jZAFkF');

                    // artist team should be changed again for search for event/id 
                    if (jsonObj._embedded.events[i] ?._embedded.attractions) temp.push(jsonObj._embedded.events[i] ?._embedded.attractions[0].name);
                    else temp.push('N/A');
                    //
                    venue = venue.substring(0, venue.length - 1);
                    temp.push(venue);
                    //
                    temp.push(jsonObj._embedded.events[i] ?.classifications[0].segment.name);
                    let prange = "N/A"
                    //console.log(jsonObj._embedded.events[i] ?.priceRanges);
                    if (jsonObj._embedded?.events[i]?.priceRanges && jsonObj._embedded.events[i] ?.priceRanges?.length > 0) {
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
                    else temp.push("");
                    //artist url need event id to find it
                    temp.push(jsonObj._embedded.events[i] ?.id);
                    //for venue logo img should be in event/id that search result
                    //if (jsonObj._embedded.events[i] ?._embedded?.venues && jsonObj._embedded.events[i] ?._embedded?.venues[0]?.images) temp.push(jsonObj._embedded.events[i] ?._embedded?.venues[0]?.images[0]?.url);
                    idMapping.set(jsonObj._embedded.events[i] ?.name, temp);
                }
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
        if (data[i][1] === undefined) text1.innerHTML = data[i][0]
        else text1.innerHTML = data[i][0]+ "<br>"+data[i][1];
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
    document.getElementById("APIresult").scrollIntoView({behavior: "smooth"})
    //table.classList.add('table-bordered');
}

function showPosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
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
    const elems = document.getElementsByClassName("searchResult");
    for (let i = 0; i < elems.length; i++) elems[i].style.display = 'block';
    ////value: id, artist team, venue, genre, ticket range, ticket status, buy website, photo
    document.getElementById("moreInfoHeader").textContent = name;
    document.getElementById("moreInfoDate").textContent = day.replace('undefined','');
    document.getElementById("moreInfoVenue").textContent = idMapping.get(name)[2]
    document.getElementById("moreInfoGen").textContent = idMapping.get(name)[3] 
    if (idMapping.get(name)[4] != "N/A") {
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
    } else if (ticketStatius === 'canceled') {
        document.getElementById("moreInfoSta").classList.add('canceled');
        document.getElementById("moreInfoSta").innerHTML = 'Canceled';
    } else if (ticketStatius === 'postponed') {
        document.getElementById("moreInfoSta").classList.add('rescheduled');
        document.getElementById("moreInfoSta").innerHTML = 'Postponed';
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
    logoIMG = "lol";
    await fetch('/getTicketMasterSearch?' + new URLSearchParams({
        "url": Url
    }))
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

    //under discovery/v2/events/{id}
    console.log('### going to check event ID:' + idMapping.get(name)[8] + ' ###');
    let url = 'https://app.ticketmaster.com/discovery/v2/events/'+ idMapping.get(name)[8]+ '.json?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ';
    let jobj;
    await fetch('/getTicketMasterSearch?' + new URLSearchParams({
        "url": url
    }))
        .then(response => response.json())
        .then(response => {
            jobj = response;
            console.log(JSON.stringify(response));
            return response;
        })
    //this property might not have data in it ... do this!
    document.getElementById("moreInfoAT").innerHTML="";
    document.getElementById("moreInfoATT").innerHTML = ""
    if (jobj._embedded.attractions && jobj._embedded.attractions.length > 0) {
        document.getElementById("moreInfoATT").innerHTML = "Artist/Team"
        //Genre do here
        let stop = jobj._embedded.attractions.length-1;
         
        for (let a = 0; a < jobj._embedded.attractions.length; a++) {
            let mat = document.createElement("a");
            mat.href = jobj._embedded.attractions[a]?.url
            
            if (a == 0) mat.innerHTML = jobj._embedded.attractions[a].name+"&ensp;" 
            else mat.innerHTML = "&ensp;"+ jobj._embedded.attractions[a].name+"&ensp;"
            mat.style.color = "#1F8A70";
            mat.style.textDecoration = "none";
            mat.target = "_blank";
            document.getElementById("moreInfoAT").appendChild(mat); 
            if (a < stop) {
                document.getElementById("moreInfoAT").innerHTML+=" | "; 
            }
        }
    }
    let tc = jobj.classifications[0]?.segment?.name + " | " + jobj.classifications[0]?.genre?.name 
            + " | " + jobj.classifications[0].subGenre?.name
    tc = tc.replace('undefined','');
    document.getElementById("moreInfoGen").textContent = tc

    //venue logo the venue id may be not match to 
    idMapping.get(name).push(logoIMG)

    //here display venue button
    const elem = document.getElementsByClassName("venueBut");
    elem.display = "block";
    for (let i = 0; i < elem.length; i++) elem[i].style.display = "block";
    selectedName = name;
    const ele = document.getElementsByClassName("outerMargin");
    document.getElementById("searchResult").scrollIntoView({behavior: "smooth"})
    for (let i = 0; i < ele.length; i++) ele[i].style.display = "none";
    const el = document.getElementById("venueDetails");
    for (let i = 0; i < el.length; i++) el[i].style.display = "none";
}
/////////GEO coding from MIT
function encode(lat, lon, precision) {
    // infer precision?
    if (typeof precision == 'undefined') {
        // refine geohash until it matches precision of supplied lat/lon
        for (let p=1; p<=12; p++) {
            const hash = Geohash.encode(lat, lon, p);
            const posn = Geohash.decode(hash);
            if (posn.lat==lat && posn.lon==lon) return hash;
        }
        precision = 12; // set to maximum
    }

    lat = Number(lat);
    lon = Number(lon);
    precision = Number(precision);

    if (isNaN(lat) || isNaN(lon) || isNaN(precision)) throw new Error('Invalid geohash');

    let idx = 0; // index into base32 map
    let bit = 0; // each char holds 5 bits
    let evenBit = true;
    let geohash = '';

    let latMin =  -90, latMax =  90;
    let lonMin = -180, lonMax = 180;

    while (geohash.length < precision) {
        if (evenBit) {
            // bisect E-W longitude
            const lonMid = (lonMin + lonMax) / 2;
            if (lon >= lonMid) {
                idx = idx*2 + 1;
                lonMin = lonMid;
            } else {
                idx = idx*2;
                lonMax = lonMid;
            }
        } else {
            // bisect N-S latitude
            const latMid = (latMin + latMax) / 2;
            if (lat >= latMid) {
                idx = idx*2 + 1;
                latMin = latMid;
            } else {
                idx = idx*2;
                latMax = latMid;
            }
        }
        evenBit = !evenBit;

        if (++bit == 5) {
            // 5 bits gives us a character: append it and start over
            geohash += base32.charAt(idx);
            bit = 0;
            idx = 0;
        }
    }

    return geohash;
}