// document.getElementsByClassName("clickMe").onclick = submitlol;
let lat = 0,
    long = 0,
    res, jsobj, ascending = true,
    prevCol = -1;
let jsonObjArray = [];
//key: name
//value: id, artist team, venue, genre, ticket status, buy website, photo
const idMapping = new Map();

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
async function callAPI(url) {
    console.log('enter callAPI');
    await fetch('http://127.0.0.1:5000/getTicketMasterSearch', {
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
            console.log(JSON.stringify(response));
            return response;
        })
        .then(response => initial(response))
    // .then(response => createAPIresultTable(response))
    // .then(response => {
    console.log(jsobj.total);
    console.log(jsonObjArray[0].total);
    let totalPage = jsobj.page.totalPages;
    console.log('we got ' + totalPage + ' pages');
    for (let i = 1; i < totalPage; i++) {
        let p = (i + 1).toString()
        await fetch('http://127.0.0.1:5000/getTicketMasterSearch', {
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
            .then(response => initial(response))
            .then(response => {
                start += jsobj.businesses.length;
                left -= jsobj.businesses.length;
            });
    }
    console.log(jsonObjArray.length);
    createAPIresultTable();
}

function submitlol(event) {
    console.log(event);
    //form submit will refresh my page and clear log
    event.preventDefault();
    var kw = "",
        loc = "Taipei",
        selfLocate = false,
        fc = "Default",
        dist = 10;
    kw = document.forms["partOne"]["kw"].value;
    loc = document.forms["partOne"]["location"].value;
    selfLocate = document.forms["partOne"]["autoDetect"].checked;
    fc = document.forms["partOne"]["fc"].value;
    dist = document.forms["partOne"]["dm"].value;
    let dd = '';
    if (dist) dd = '&radius=' + dist + '&unit=miles'
    if (!selfLocate && loc === "") {
        alert("you has not enter all required info!");
        return false;
    }
    if (selfLocate) {
        if (navigator.geolocation) {
            alert('selfLocate checked!');
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
        tmploc = loc.replace(/\s+/g, '+');
        var gkey = '';
        var gr = httpGet('https://maps.googleapis.com/maps/api/geocode/json?address=' + tmploc + '&key=' + gkey);
        //call python get method to get the address
        var res = JSON.parse(gr);
        lat = res.results[0].geometry.location.lat;
        long = res.results[0].geometry.location.lng;
    }
    let mixedKeyWord = kw + ' ' + loc;
    mixedKeyWord = mixedKeyWord.replace(/\s+/g, '%20');
    let tmKey = 'uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ';
    //https://app.ticketmaster.com/discovery/v2/venues?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ&keyword=Los%20Angeles%20Memorial%20Coliseum
    let url = '';
    if (fc == 'default') url = 'https://app.ticketmaster.com/discovery/v2/events?apikey=' + tmKey + '&keyword=' + mixedKeyWord + '&size=200' + dd;
    else url = 'https://app.ticketmaster.com/discovery/v2/events?apikey=' + tmKey + '&keyword=' + mixedKeyWord + '&segmentId=' + fc + '&size=200' + dd;
    callAPI(url);
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
        img.style.width = "150px";
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
    if (len > 0) {
        console.log('enter to creat !!!');
        const elems = document.getElementsByClassName("APIresult");
        for (let i = 0; i < elems.length; i++) elems[i].style.display = 'flex';
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
                tmp.push(jsonObj._embedded.events[i] ?.classifications[0].segment.name);
                //Venue
                let venue = '';
                for (let k = 0; k < jsonObj._embedded.events[i] ?._embedded.venues.length; k++) {
                    tmp.push(jsonObj._embedded.events[i] ?._embedded.venues[k].name);
                    venue += jsonObj._embedded.events[i] ?._embedded.venues[k].name;
                    venue += '|';
                }
                data.push(tmp);
                //value: id, artist team, venue, genre, ticket range, ticket status, buy website, photo
                temp.push(jsonObj._embedded.events[i] ?.id);
                //not quiet too sure for artist team
                if (jsonObj._embedded.events[i] ?._embedded.attractions) temp.push(jsonObj._embedded.events[i] ?._embedded.attractions[0].name);
                else temp.push('lol');
                temp.push(venue);
                temp.push(jsonObj._embedded.events[i] ?.classifications[0].segment.name);
                let prange = '???';
                console.log(jsonObj._embedded.events[i] ?.priceRanges);
                if (jsonObj._embedded.events[i].priceRanges && jsonObj._embedded.events[i] ?.priceRanges?.length > 0) {
                    prange = jsonObj._embedded.events[i] ?.priceRanges[0].min + '-' + jsonObj._embedded.events[i] ?.priceRanges[0].max 
                    if (jsonObj._embedded.events[i] ?.priceRanges.currency) prange+=jsonObj._embedded.events[i] ?.priceRanges.currency;
                    else prange+= ' USD'
                }
                temp.push(prange);
                temp.push(jsonObj._embedded.events[i] ?.dates.status.code);
                temp.push(jsonObj._embedded.events[i] ?.url);
                //console.log(jsonObj._embedded.events[i] ?.seatmap.staticUrl);
                if (jsonObj._embedded.events[i] ?.seatmap?.staticUrl) temp.push(jsonObj._embedded.events[i] ?.seatmap.staticUrl);
                else temp.push(jsonObj._embedded.events[i] ?.url);

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

    var text1 = document.createTextNode('Date');
    var text2 = document.createTextNode('Icon');
    var text3 = document.createTextNode('Event');
    var text4 = document.createTextNode('Genre');
    var text5 = document.createTextNode('Venue');
    tr.classList.add("arow");
    td1.appendChild(text1);
    td1.classList.add("no");
    //td1.addEventListener("click", ()=>sortColumn(0));
    td2.appendChild(text2);
    td2.classList.add("img");
    //td2.addEventListener("click", ()=>sortColumn(1));
    td3.appendChild(text3);
    td3.classList.add("bn");

    td3.addEventListener("click", () => sortColumn(data, 3));
    td4.appendChild(text4);
    td4.classList.add("rating");
    td4.addEventListener("click", () => sortColumn(data, 4));
    td5.appendChild(text5);
    td5.classList.add("dist");
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
        tr.classList.add("arow");
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
        let day = data[i][0]+'\n'+data[i][1];
        td3.addEventListener("click", () => moreInfo(data[i][3], day));
        td4 = document.createElement('td');
        td4.classList.add("rating");
        td5 = document.createElement('td');
        td5.classList.add("dist");



        text1 = document.createTextNode(data[i][0] + '\n' + data[i][1]);
        text2 = document.createElement('img');
        //text2.src = jsonObj.businesses[i].image_url;
        text2.src = data[i][2];
        text2.style.width = "150px";
        // text3 = document.createTextNode(jsonObj.businesses[i].name);
        // text4 = document.createTextNode(jsonObj.businesses[i].rating);
        // text5 = document.createTextNode(jsonObj.businesses[i].distance);
        text3 = document.createTextNode(data[i][3]);
        text4 = document.createTextNode(data[i][4]);
        let place = '';
        for (let a = 5; a < data[i].length; a++) place += (data[i][a] + ' ');
        text5 = document.createTextNode(place);
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
    // let elems = document.getElementsByClassName("APIresult");
    // for (let i = 0; i < elems.length; i++) elems[i].remove();
    elems = document.getElementsByClassName("searchResult");
    for (let i = 0; i < elems.length; i++) elems[i].style.display = "none";
}
//when user click the title and ask for more info
function moreInfo(name, day) {
    console.log('enter moreInfo');
    const elems = document.getElementsByClassName("searchResult");
    for (let i = 0; i < elems.length; i++) elems[i].style.display = 'flex';
    ////value: id, artist team, venue, genre, ticket range, ticket status, buy website, photo
    document.getElementById("moreInfoDate").textContent = day 
    document.getElementById("moreInfoAT").textContent = idMapping.get(name)[1]
    document.getElementById("moreInfoVenue").textContent = idMapping.get(name)[2]
    document.getElementById("moreInfoGen").textContent = idMapping.get(name)[3]
    document.getElementById("moreInfoRange").textContent = idMapping.get(name)[4]
    document.getElementById("moreInfoSta").textContent = idMapping.get(name)[5]
    document.getElementById("moreInfoBuy").href = idMapping.get(name)[6]
    console.log(idMapping.get(name)[7]);
    document.getElementById("moreInfoIMG").src = idMapping.get(name)[7]
    // for (let a = 0; a < jsonObjArray.length; a++) {
    //     let jsobj = jsonObjArray[a];
    //     for (let i = 0; i < jsobj.businesses.length; i++) {
    //         if (name === jsobj.businesses[i].name) {
    //             var addr = "",
    //                 trs = "",
    //                 cate = "";
    //             for (let j = 0; j < Object.keys(jsobj.businesses[0].location.display_address).length; j++) {
    //                 addr += jsobj.businesses[j].location.display_address[j];
    //                 addr += " ";
    //             }
    //             console.log(addr);
    //             //document.getElementById("address").textContent = addr;
    //             if (jsobj.businesses[i].phone) document.getElementById("pn").innerHTML = jsobj.businesses[i].phone;
    //             else document.getElementById("pn").innerHTML = "None";
    //             //document.getElementById("pn").textContent = jsobj.businesses[i].phone;
    //             document.getElementById("address").innerHTML = addr;

    //             for (let j = 0; j < jsobj.businesses[i].transactions.length; j++) {
    //                 trs += jsobj.businesses[i].transactions[j];
    //                 trs += " ";
    //             }
    //             console.log(trs);
    //             if (trs.length) document.getElementById("transactionsSupported").innerHTML = trs;
    //             else document.getElementById("transactionsSupported").innerHTML = "None";
    //             for (let j = 0; j < jsobj.businesses[i].categories.length; j++) {
    //                 cate += jsobj.businesses[i].categories[j].alias;
    //                 cate += " ";
    //             }

    //             console.log(cate);
    //             document.getElementById("categories").textContent = cate;
    //             //for more info
    //             //var anchor = document.createElement('a');
    //             let anchor = document.getElementById("minfo");
    //             //var anchorText = document.createTextNode('Yelp');
    //             anchor.href = jsobj.businesses[i].url;
    //             //anchor.setAttribute('href', jsobj.businesses[i].url);
    //             break;
    //         }
    //     }
    // }
}