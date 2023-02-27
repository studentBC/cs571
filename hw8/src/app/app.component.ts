import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { HttpClient, HttpXsrfTokenExtractor } from "@angular/common/http"
import { NONE_TYPE } from "@angular/compiler";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
// import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

declare global {
    var lat: number;
    var long: number;
    var selectedName: string;
    var res: 0;
    var tmKey: string;
    var jsobj: object;
    var reserveNo: number;
    var jsonText: string;
    var ascending: boolean,
        prevCol: -1;
    var jsonObjArray: object[];
    var jsonStrArray: string[];
    var modalDisplay: string;
    //for reserve info = idmaping
    var idMapping: Map<string, string[]>;
    var no: string[];
    var email: string[];
    var time: string[];
    var businessName: string[];
    var date: string[];
    var clickedBN: string;
    var jsonReviewText: string;
    var jsonReveiewStrArray: string[];
    var nameToUID: Map<string, string>;
    var bDetail: Map<string, string[]>;
    var ishow: Map<string, boolean>;
    //key will be event Name+date
    var favoriteList: Map<string, string[]>;
    //debug usage
    var debug: boolean;
    var reserveModal: ElementRef;
    var gMLoc: string;
    var latlng: string;
}
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    /////////////// inital variable realted ////////////
    //https://stackoverflow.com/questions/39366981/viewchild-in-ngif
    //https://stackblitz.com/edit/angular-t5dfp7?file=app%2Fservice-component.ts
    // @ViewChild('reserveModal') set content(content: ElementRef) {
    //     console.log(globalThis.reserveModal);
    //     console.log(globalThis.reserveModal.nativeElement);
    //     if (content) globalThis.reserveModal = content;
    // }
    // @ViewChild(MatProgressSpinnerModule) progressSpinner: MatProgressSpinnerModule;
    ngOnInit(): void {
        globalThis.ascending = true;
        globalThis.jsonObjArray = [];
        globalThis.jsonStrArray = [];
        globalThis.jsonReveiewStrArray = [];
        globalThis.modalDisplay = "none";
        globalThis.clickedBN = "lol";
        globalThis.reserveNo = 1;
        globalThis.tmKey = "uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ";
        globalThis.idMapping = new Map<string, string[]>();
        globalThis.favoriteList = new Map<string, string[]>();
        globalThis.bDetail = new Map<string, string[]>();
        globalThis.nameToUID = new Map<string, string>();
        globalThis.debug = true;
        globalThis.ishow = new Map<string, boolean>([
            ["vdoh", false],
            ["vdgr", false],
            ["vdcr", false]
        ]);
        globalThis.latlng = '&geoPoint=';
    }
    // constructor(private http: HttpClient) {

    // }

    initial(jojo: object) {
        console.log(typeof (jojo));
        console.log(jojo);
        globalThis.jsobj = jojo;
        globalThis.jsonObjArray.push(jojo);
        globalThis.jsonStrArray.push(JSON.stringify(jojo));
    }
    getReveiew(jojo: object) {
        globalThis.jsonReveiewStrArray.push(JSON.stringify(jojo));
    }
    getBinfo(jojo: object) {
        let jobj = JSON.parse(JSON.stringify(jojo));
        if (jobj.id in globalThis.bDetail.keys) return;
        let tmp: string[] = [];
        //photos , daily open hours

        for (let i = 0; i < jobj.photos.length; i++) {
            tmp.push(jobj.photos[i]);
        }
        for (let i = 0; i < jobj.hours.open; i++) {
            tmp.push(jobj.hours.open[i].start + ':' + jobj.hours.open[i].end);
        }
        globalThis.bDetail.set(jobj.id, tmp);

    }
    showPosition(position: any) {
        globalThis.lat = position.coords.latitude;
        globalThis.long = position.coords.longitude;
        console.log(globalThis.lat);
        console.log(globalThis.long);
    }
    ///////////////// deal with UI click /////////////////
    clickTab(id: string) {
        let tabs = document.getElementById("sea");
        let target = document.getElementById("mb");
        let t = document.getElementById(id);
        // tabs.classList.add('active');
        target!.style.borderColor = 'transparent';
        tabs!.style.borderColor = 'transparent';
        t!.style.borderColor = 'white';
        // show tab
        let tabID: string;
        if (id == 'sea') {
            tabID = "searchTab";
            let showTB = document.getElementById("searchTab");
            let noTB = document.getElementById("myBookingsTab");
            noTB!.style.display = "none";
            showTB!.style.display = "block";
            document.getElementById("favoriteTable")!.innerHTML="";
            // for (let i = 0; i < elem.length; i++) {
            //     (elem[i] as HTMLElement).style.display = "none";
            // }
        } else {
            let showTB = document.getElementById("myBookingsTab") as HTMLElement;
            let noTB = document.getElementById("searchTab");
            noTB!.style.display = "none";
            showTB!.style.display = "block";
            this.cc();
            //go clear
            //dynamically create reserve table
            this.createReserveTable();
        }
    }
    putMeUp(id: string) {
        console.log('we call tab ');
        console.log(id);
        let t1 = document.getElementById("businessTab");
        let t2 = document.getElementById("spotifyArtist");
        let t3 = document.getElementById("venuesDetails");
        if (id != 'businessTab') {
            const elems = document.getElementsByClassName("promotionBut");
            for (let i = 0; i < elems.length; i++) {
                const ee = elems[i] as HTMLElement;
                ee.style.display = "none";
            }
        }
        let tt = document.getElementById(id);
        t1!.style.display = "none";
        t2!.style.display = "none";
        t3!.style.display = "none";

        if (id != 'businessTab') tt!.style.display = "block";
        else {
            console.log('enter to change bussinees tab');
            tt!.style.display = "flex";
            const elems = document.getElementById("promotionBut");
            if (!elems) console.log('no bt man !!!');
            elems!.style.display = "block";
            console.log(elems!.style.display);
            // elems = document.getElementsByClassName("socialShare");
            // for (let i = 0; i < elems.length; i++) {
            //     const ee = elems[i] as HTMLElement;
            //     ee.style.display = "flex";
            // }
        }
    }
    addFavorite() {
        console.log("ola enter addfavorite")
        //alert("Event added to Favorites!")
        let key = document.getElementById("moreInfoHeader")!.innerHTML + document.getElementById("moreInfoDate")!.innerHTML
        if (globalThis.favoriteList.has(key)) {
            console.log("yes we have key " + key)
            globalThis.favoriteList.delete(key)
            return
        }
        //date, event name, category, venue
        let tmp: string[] = []
        let date = document.getElementById("moreInfoDate")!.innerHTML.substring(0,10)
        tmp.push(date)
        tmp.push(document.getElementById("moreInfoHeader")!.innerHTML)
        tmp.push(document.getElementById("moreInfoGen")!.innerHTML)
        tmp.push(document.getElementById("vdHeader")!.innerHTML)
        console.log("go set up key")
        globalThis.favoriteList.set(key,tmp);
    }
    readMore(tid: string) {
        console.log("call read more man !!!");
        console.log('id is ' + tid)
        document.getElementById(tid+'a')!.innerHTML="";
        if (globalThis.ishow.get(tid)) {
            document.getElementById(tid)?.classList.remove('more-text');
            document.getElementById(tid)?.classList.add('hidden-text');
            document.getElementById(tid+'a')!.innerHTML="show more<i class=\"bi bi-chevron-down\"></i>"
        } else {
            document.getElementById(tid)?.classList.remove('hidden-text');
            document.getElementById(tid)?.classList.add('more-text');
            document.getElementById(tid+'a')!.innerHTML="show less<i class=\"bi bi-chevron-up\"></i>"
        }
        globalThis.ishow.set(tid, !globalThis.ishow.get(tid))
    }
    ///////////// clear button  ///////////////
    // cc() {
    //     document.getElementById("APIresult").innerHTML = '';
    //     // let elems = document.getElementsByClassName("APIresult");
    //     // for (let i = 0; i < elems.length; i++) elems[i].remove();
    //     elems = document.getElementsByClassName("searchResult");
    //     for (let i = 0; i < elems.length; i++) elems[i].style.display = "none";
    // }
    ///////////// handle submit button ///////////////
    httpGet(theUrl: string) {
        let xmlHttpReq = new XMLHttpRequest();
        xmlHttpReq.open("GET", theUrl, false);
        xmlHttpReq.send(null);
        return xmlHttpReq.responseText;
    }
    async callAPI(url: string) {
        console.log('enter callAPI');
        console.log(url);

        await fetch('https://yukichat-ios13.wl.r.appspot.com/getTicketMasterSearch?' + new URLSearchParams({
            "url": url
        }))
            //nodeJS server IP
            .then(response => response.json())
            .then(response => {
                globalThis.jsonText = JSON.stringify(response);
                globalThis.jsobj = response;
                console.log(JSON.stringify(response));
                return response;
            })
            .then(response => this.initial(response));

        console.log('---- come out ----');
        let jojo = JSON.parse(globalThis.jsonText);
        console.log(typeof (jojo));
        console.log(jojo.total);
        console.log('######################');
        console.log(jsonObjArray.length);
        console.log('######################');
        if (jojo.page.totalElements === 0) {
            document.getElementById('notfound')!.style.display = 'block';
            console.log(jsonObjArray[0]);
            console.log('######################');
            document.getElementById("APIresult")!.innerHTML = '';
            return;
        } else this.createAPIresultTable();
        return;
    }
    // showPosition(position: JSON) {
    //     lat = position.coords.latitude;
    //     long = position.coords.longitude;
    //     console.log(lat);
    //     console.log(long);
    // }
    async submitlol(form: NgForm) {
        globalThis.idMapping.clear();
        jsonStrArray = [];
        document.getElementById('notfound')!.style.display = 'none';
        document.getElementById("searchResult")!.style.display = "none";
        globalThis.latlng = '&geoPoint=';
        //process input parameter
        let kw = "",
            loc = "Taipei",
            selfLocate = false,
            fc = "Default",
            dist = 10;
        console.log(form.value);
        kw = form.value.kw || 'usc';
        loc = form.value.location || "";
        selfLocate = form.value.autoDetect || false;
        fc = form.value.fc || "default";
        dist = form.value.dm || 10;
        let dd = ''; let lat = ""; let lng = "";
        if (dist) dd = '&radius=' + dist + '&unit=miles'
        console.log(loc);
        console.log(kw);
        console.log(selfLocate);
        console.log(fc);
        console.log(dist);
        if (!selfLocate && loc != "") {
            //use google geoapi to get lat lng
            let location = loc.replace(/\s+/g, '+');
            let gkey = 'AIzaSyBdSh29p_B93XTLF7qB0XtnfnjxQudHCA8';
            await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=' + gkey, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(res => {
                    console.log(res);
                    if (!res.results[0]) {
                        alert("invalid location!");
                        return;
                    }
                    lat = res.results[0].geometry.location.lat;
                    lng = res.results[0].geometry.location.lng;
                });
            // let gr = httpGet('https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=' + gkey);
            if (lat === "") return;
        }
        let url = "";
        if (loc === "" && selfLocate) {
            console.log("enter here man");
            await fetch('https://ipinfo.io', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer c74fd8c3b95806'
                }
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    const temp = response.loc.split(",");
                    lat = temp[0]
                    lng = temp[1]
                });
        }
        const geohash = this.encode(Number(lat), Number(lng), 7);
        console.log("===  geohash we get is " + geohash + "  ===");
        globalThis.latlng += geohash
        let mixedKeyWord = kw;
        mixedKeyWord = mixedKeyWord.replace(/\s+/g, '%20');
        //https://app.ticketmaster.com/discovery/v2/venues?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ&keyword=Los%20Angeles%20Memorial%20Coliseum
        if (fc == 'default') {
            fc = ''
        }
        console.log(fc);
        url = 'https://app.ticketmaster.com/discovery/v2/events?apikey=' + globalThis.tmKey + '&keyword=' + mixedKeyWord + '&segmentId=' + fc + '&size=20' + dd + globalThis.latlng;
        console.log("we send url " + url)
        jsonObjArray = [];
        this.callAPI(url);
    }
    ///////////// dynamically deal with webUI ///////////////
    goBack() {
        console.log('going back man')
        const elems = document.getElementsByClassName("searchResult");
        for (let i = 0; i < elems.length; i++) {
            (elems[i] as HTMLElement).style.display = "none";
        }
        const elem = document.getElementsByClassName("APIresult");
        for (let i = 0; i < elem.length; i++) {
            (elem[i] as HTMLElement).style.display = "block";
        }
    }
    createAPIresultTable() {
        console.log('enter to createAPIresultTable');
        //return;
        //store json obj into data array
        var len = jsonObjArray.length;
        console.log(len);
        let data: any[] = [];
        console.log('enter to creat !!!');
        const elems = document.getElementsByClassName("APIresult");
        document.getElementById("APIresult")!.innerHTML = "";
        for (let i = 0; i < elems.length; i++) {
            const ee = elems[i] as HTMLElement;
            ee.style.display = 'block';
        }
        let index = 1;
        console.log('------  here ------');
        for (let j = 0; j < len; j++) {
            console.log(jsonStrArray[j]);
            let jsonObj = JSON.parse(jsonStrArray[j]);
            console.log('jsonObj length is ' + jsonObj.page.totalElements);
            for (let i = 0; i < jsonObj.page.totalElements; i++) {
                if (jsonObj._embedded.events[i]) {
                    let tmp = [];
                    let temp = [];
                    //date column
                    tmp.push(jsonObj._embedded.events[i]?.dates.start.localDate);
                    tmp.push(jsonObj._embedded.events[i]?.dates.start.localTime);
                    //Icon
                    tmp.push(jsonObj._embedded.events[i]?.images[2].url);
                    //Event
                    tmp.push(jsonObj._embedded.events[i]?.name);
                    //Genre
                    if (jsonObj._embedded.events[i]?.classifications) {
                        tmp.push(jsonObj._embedded.events[i]?.classifications[0].segment.name);
                    } else tmp.push("lol")
                    //Venue
                    let venue = '';
                    for (let k = 0; k < jsonObj._embedded.events[i]?._embedded.venues.length; k++) {
                        tmp.push(jsonObj._embedded.events[i]?._embedded.venues[k].name);
                        venue += jsonObj._embedded.events[i]?._embedded.venues[k].name;
                        venue += '|';
                    }
                    data.push(tmp);
                    //value: venue id, artist team, venue, genre, ticket range, ticket status, buy website, photo
                    //console.log(jsonObj._embedded.events[i].venues[0]?.id);
                    if (jsonObj._embedded.events[i]._embedded.venues[0].id) temp.push(jsonObj._embedded.events[i]._embedded.venues[0]?.id);//venues.id = venue's id eg: ZFr9jZAFkF
                    else temp.push('ZFr9jZAFkF');

                    // artist team should be changed again for search for event/id 
                    if (jsonObj._embedded.events[i]?._embedded.attractions) temp.push(jsonObj._embedded.events[i]?._embedded.attractions[0].name);
                    else temp.push('lol');
                    //
                    venue = venue.substring(0, venue.length - 1);
                    temp.push(venue);
                    //
                    temp.push(jsonObj._embedded.events[i]?.classifications[0].segment.name);
                    let prange = '???';
                    //console.log(jsonObj._embedded.events[i] ?.priceRanges);
                    if (jsonObj._embedded.events[i].priceRanges && jsonObj._embedded.events[i]?.priceRanges?.length > 0) {
                        prange = jsonObj._embedded.events[i]?.priceRanges[0].min + '-' + jsonObj._embedded.events[i]?.priceRanges[0].max
                        if (jsonObj._embedded.events[i]?.priceRanges.currency) prange += jsonObj._embedded.events[i]?.priceRanges.currency;
                        else prange += ' USD'
                    }
                    //
                    temp.push(prange);
                    //
                    temp.push(jsonObj._embedded.events[i]?.dates.status.code);
                    //
                    temp.push(jsonObj._embedded.events[i]?.url);
                    //console.log(jsonObj._embedded.events[i] ?.seatmap.staticUrl);
                    if (jsonObj._embedded.events[i]?.seatmap?.staticUrl) temp.push(jsonObj._embedded.events[i]?.seatmap.staticUrl);
                    else temp.push(jsonObj._embedded.events[i]?.url);
                    //artist url need event id to find it
                    temp.push(jsonObj._embedded.events[i]?.id);
                    //for venue logo img should be in event/id that search result
                    //if (jsonObj._embedded.events[i] ?._embedded?.venues && jsonObj._embedded.events[i] ?._embedded?.venues[0]?.images) temp.push(jsonObj._embedded.events[i] ?._embedded?.venues[0]?.images[0]?.url);
                    globalThis.idMapping.set(jsonObj._embedded.events[i]?.name, temp);
                }
            }
        }
        console.log('data length is ' + data.length);

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

        var text2 = document.createElement('p');
        text2.classList.add("headerCell");
        text2.innerHTML = 'Icon';

        var text3 = document.createElement('p');
        text3.classList.add("headerCell");
        text3.innerHTML = 'Event';

        var text4 = document.createElement('p');
        text4.classList.add("headerCell");
        text4.innerHTML = 'Genre';

        var text5 = document.createElement('p');
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


        td3.addEventListener("click", () => this.sortColumn(data, 3));
        td4.appendChild(text4);
        td4.classList.add("fgenre");

        td4.addEventListener("click", () => this.sortColumn(data, 4));
        td5.appendChild(text5);
        td5.classList.add("fvenue");

        td5.addEventListener("click", () => this.sortColumn(data, 5));

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
            let day = data[i][0] + ' ' + data[i][1];
            td3.addEventListener("click", () => this.moreInfo(i + 1, day));
            td4 = document.createElement('td');
            td4.classList.add("rating");
            td5 = document.createElement('td');
            td5.classList.add("dist");


            text1 = document.createElement('p')
            text1.classList.add("datetn");
            text1.innerHTML = data[i][0] + "<br>" + data[i][1];
            //text1 = document.createTextNode(data[i][0] + '\n' + data[i][1]);
            let text2 = document.createElement('img');
            //text2.src = jsonObj.businesses[i].image_url;
            text2.src = data[i][2];
            text2.style.width = "50%";
            text2.style.objectFit = 'scale-down';
            text2.style.maxWidth = '150px';
            text2.style.marginBottom = '10px';
            text2.style.marginTop = '10px';
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
        document.getElementById("APIresult")!.appendChild(table);
        table.style.marginTop = '40px';
        table.style.marginBottom = '40px';
        //table.classList.add('table-bordered');
        console.log('after creating table ...');
    }

    sortColumn(array: any, col: any) {
        if (globalThis.prevCol == col) globalThis.ascending = !globalThis.ascending;
        if (globalThis.ascending) {
            array.sort(function (a: any, b: any) {
                var x = a[col];
                var y = b[col];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        } else {
            array.sort(function (a: any, b: any) {
                var x = a[col];
                var y = b[col];
                return ((x < y) ? 1 : ((x > y) ? -1 : 0));
            });
        }
        let table = document.getElementById("APIresultTable") as HTMLTableElement;
        for (let i = 1; i < array.length; i++) {
            table.rows[i].cells[0].innerText = array[i][0] + '\n' + array[i][1];
            //the image is not inner text so we need to change it!
            //table.rows[i].cells[1].innerText = array[i][1];
            table.rows[i].cells[1].innerText = "";
            let img = document.createElement('img');
            img.style.width = "50%";
            img.style.objectFit = 'scale-down';
            img.style.maxWidth = '150px';
            img.style.marginBottom = '10px';
            img.style.marginTop = '10px';
            img.src = array[i][2];
            table.rows[i].cells[1].appendChild(img);
            //the business name still need to show its link
            table.rows[i].cells[2].innerText = array[i][3];
            table.rows[i].cells[3].innerText = array[i][4];
            table.rows[i].cells[4].innerText = array[i][5];
        }
        globalThis.prevCol = col;
    }


    //when user click the title and ask for more info
    async moreInfo(row: number, day: string) {
        let table = document.getElementById("APIresultTable") as HTMLTableElement;
        let name = table.rows[row].cells[2].innerText
        if (!globalThis.idMapping.has(name)) return;
        console.log('enter moreInfo');
        //let search result table gone
        const elems = document.getElementsByClassName("searchResult");
        for (let i = 0; i < elems.length; i++) {
            const ee = elems[i] as HTMLElement;
            ee.style.display = 'block';
        }
        document.getElementById("moreInfoHeader")!.textContent = name;
        document.getElementById("moreInfoDate")!.textContent = day.replace('undefined', '');
        // if (idMapping.get(name)[1] != 'lol') {
        //     document.getElementById("moreInfoAT").textContent = idMapping.get(name)[1];
        // }
        document.getElementById("moreInfoVenue")!.textContent = globalThis.idMapping.get(name)![2];
        document.getElementById("moreInfoGen")!.textContent = globalThis.idMapping.get(name)![3]
        console.log("######" + globalThis.idMapping.get(name)![4] + "######")
        for (let j = 0; j < globalThis.idMapping.get(name)!.length; j++) {
            console.log(globalThis.idMapping.get(name)![j])
        }
        if (globalThis.idMapping.get(name)![4] != "???") {
            document.getElementById("prangeTitle")!.innerHTML = "Price Ranges"
            document.getElementById("moreInfoRange")!.textContent = globalThis.idMapping.get(name)![4]
        }
        let ticketStatius = idMapping.get(name)![5];
        document.getElementById("moreInfoSta")!.removeAttribute('class');;
        document.getElementById("moreInfoSta")!.innerHTML = "";
        if (ticketStatius === 'onsale') {
            document.getElementById("moreInfoSta")!.classList.add('onSale');
            document.getElementById("moreInfoSta")!.innerHTML = 'On Sale';
        } else if (ticketStatius === 'offsale') {
            document.getElementById("moreInfoSta")!.classList.add('offSale');
            document.getElementById("moreInfoSta")!.innerHTML = 'Off Sale';
        } else if (ticketStatius === 'canceled') {
            document.getElementById("moreInfoSta")!.classList.add('canceled');
            document.getElementById("moreInfoSta")!.innerHTML = 'Canceled';
        } else if (ticketStatius === 'postponed') {
            document.getElementById("moreInfoSta")!.classList.add('rescheduled');
            document.getElementById("moreInfoSta")!.innerHTML = 'Postponed';
        } else {
            document.getElementById("moreInfoSta")!.classList.add('rescheduled');
            document.getElementById("moreInfoSta")!.innerHTML = 'Rescheduled';
        }

        const mtag = document.getElementById("moreInfoBuy") as HTMLAnchorElement;
        mtag.href = globalThis.idMapping.get(name)![6];
        console.log(globalThis.idMapping.get(name)![7]);
        //error occur
        (document.getElementById("moreInfoIMG") as HTMLImageElement).src = globalThis.idMapping.get(name)![7];
        //go search for venue
        let Url = 'https://app.ticketmaster.com/discovery/v2/venues?apikey=' + tmKey + '&keyword=' + globalThis.idMapping.get(name)![2];
        //let logoIMG = await searchVenue(Url);
        console.log('enter searchVenue')
        await fetch('https://yukichat-ios13.wl.r.appspot.com/getTicketMasterSearch?' + new URLSearchParams({
            "url": Url
        }))
            .then(response => response.json())
            .then(response => {
                console.log('we got venue length ' + response._embedded?.venues?.length);
            })

        //under discovery/v2/events/{id}
        console.log('### going to check event ID:  ' + globalThis.idMapping.get(name)![8] + ' ###');
        let url = 'https://app.ticketmaster.com/discovery/v2/events/' + globalThis.idMapping.get(name)![8] + '.json?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ';
        var jobjs: string = "";
        await fetch('https://yukichat-ios13.wl.r.appspot.com/getTicketMasterSearch?' + new URLSearchParams({
            "url": url
        }))
            .then(response => response.json())
            .then(response => {
                jobjs = JSON.stringify(response);
                console.log(jobjs);
                return response;
            })
        let jobj = JSON.parse(jobjs)
        let artistList = []
        //this property might not have data in it ... do this!
        if (jobj._embedded?.attractions) {
            let mtag = document.getElementById("moreInfoAT") as HTMLAnchorElement
            mtag.href = jobj._embedded.attractions[0]?.url;
            document.getElementById("moreInfoATT")!.innerHTML = "Artist/Team"
            //Genre
            let stop = jobj._embedded.attractions.length - 1;
            for (let a = 0; a < jobj._embedded.attractions.length; a++) {
                let mat = document.createElement("a");
                mat.href = jobj._embedded.attractions[a]?.url
                artistList.push(jobj._embedded.attractions[a].name)
                if (a == 0) mat.innerHTML = jobj._embedded.attractions[a].name + "&ensp;"
                else mat.innerHTML = "&ensp;" + jobj._embedded.attractions[a].name + "&ensp;"
                mat.style.color = "#1F8A70";
                mat.style.textDecoration = "none";
                mat.target = "_blank";
                (document.getElementById("moreInfoAT") as HTMLElement).appendChild(mat);
                if (a < stop) {
                    (document.getElementById("moreInfoAT") as HTMLElement).innerHTML += " | ";
                }
            }
        }
        let tc = ""
        if (jobj.classifications !== null) {
            if (jobj.classifications[0].subGenre?.name && jobj.classifications[0]?.subGenre?.name != 'Undefined') {
                tc+=jobj.classifications[0].subGenre?.name
            }
            if (jobj.classifications[0]?.genre?.name && jobj.classifications[0]?.genre?.name != 'Undefined') {
                if (tc!="") tc+=" | "
                tc+=jobj.classifications[0]?.genre?.name
            }
            if (jobj.classifications[0]?.segment?.name && jobj.classifications[0]?.segment?.name != 'Undefined') {
                if (tc!="") tc+=" | "
                tc+=jobj.classifications[0]?.segment?.name
            } 
            if (jobj.classifications[0].subType?.name && jobj.classifications[0]?.subType?.name != 'Undefined') {
                if (tc!="") tc+=" | "
                tc+=jobj.classifications[0].subType?.name
            }
            if (jobj.classifications[0].type?.name && jobj.classifications[0]?.type?.name != 'Undefined') {
                if (tc!="") tc+=" | "
                tc+=jobj.classifications[0].type?.name
            }
        }

        tc = tc.replace('undefined','');
        document.getElementById("moreInfoGen")!.textContent = tc

        //venue logo the venue id may be not match to 

        console.log("-----  we are going to hide our search table  -----");
        //here display venue button
        const ele = document.getElementsByClassName("searchResult");
        for (let i = 0; i < elems.length; i++) {
            (ele[i] as HTMLElement).style.display = "block";
        }
        const elem = document.getElementsByClassName("APIresult");
        for (let i = 0; i < elem.length; i++) {
            (elem[i] as HTMLElement).style.display = "none";
        }
        globalThis.selectedName = name;
        console.log('showing our button man!!!')
        this.showVenue()
        for (let i = 0; i < artistList.length; i++) {
            await this.showSpotify(artistList[i])
        }
        console.log('cinner nodes: ' + document.getElementById('cinner')!.childNodes.length)
        if (artistList.length == 0) {
            document.getElementById('noArtist')!.style.display = "block";
            document.getElementById('carouselExampleControls')!.style.display = "none";
        }
    }
    // handle modal 
    //https://stackoverflow.com/questions/59590391/bootstrap-modal-is-not-shown-on-angular-8-on-click
    openModal() {
        console.log('enter to open');
    }
    onCloseHandled() {
        document.getElementById("reserveModal")!.tabIndex = -1;
    }
    hideLocInput() {
        let cb = document.getElementById('cbox') as HTMLInputElement;
        if (cb.checked == true) {
            let cla = document.getElementById("inputLoc") as HTMLElement;
            cla.removeAttribute("required");
            let inloc = document.getElementById("inputLoc") as HTMLElement;
            inloc.style.display = 'none';
        } else {
            let inloc = document.getElementById('inputLoc') as HTMLElement;
            inloc.style.display = 'block';
        }
    }
    cc() {
        (<HTMLFormElement>document.getElementById("partOne")).reset();
        document.getElementById("APIresult")!.innerHTML = '';
        document.getElementById('notfound')!.style.display = 'none';
        document.getElementById("inputLoc")!.style.display = 'block';
        globalThis.idMapping.clear();
        jsonObjArray = [];

        const elems = document.getElementsByClassName("searchResult");
        for (let i = 0; i < elems.length; i++) {
            (elems[i] as HTMLElement).style.display = "none";
        }
    }
    ///////////// dynamically deal with reservation table ///////////////
    createReserveTable() {
        console.log('enter to createReserveTable');
        //store json obj into data array
        var len = globalThis.favoriteList.size;
        console.log(len);

        let data: any[] = [];
        let temp = document.getElementById("mbTitle") as HTMLElement;
        if (len === 0) {
            temp.innerHTML="No reservations to show";
            return;
        }

        temp.innerHTML = "List of your favorite events";

        // no, business name, date, time, email, delet button
        var table = document.createElement('table');
        table.setAttribute("id", "reserveTable");
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');
        var td5 = document.createElement('td');
        var td6 = document.createElement('td');

        var text1 = document.createTextNode('#');
        var text2 = document.createTextNode('Date');
        var text3 = document.createTextNode('Event');
        var text4 = document.createTextNode('Category');
        var text5 = document.createTextNode('Venue');
        var text6 = document.createTextNode('Favorite');
        tr.classList.add("arow");
        td1.appendChild(text1);
        td1.classList.add("no");
        //td1.addEventListener("click", ()=>sortColumn(0));
        td2.appendChild(text2);
        td2.classList.add("bn");
        //td2.addEventListener("click", ()=>sortColumn(1));
        td3.appendChild(text3);
        td3.classList.add("date");

        td4.appendChild(text4);
        td4.classList.add("time");

        td5.appendChild(text5);
        td5.classList.add("email");

        td6.appendChild(text6);
        td6.classList.add("deletBut");
        //td6.classList.add("glyphicon glyphicon-trash");
        //td6.addEventListener("click", () => this.delReserve(data, 4));

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);

        table.appendChild(tr);
        console.log('before creating table ...');
        console.log('data length is ' + len);
        let no = 1;
        for (let [key, value] of globalThis.favoriteList) {
            console.log(key + ' : ' + value + ' #### ');
            tr = document.createElement('tr');
            tr.classList.add("arow");
            td1 = document.createElement('td');
            td1.classList.add("no");
            td2 = document.createElement('td');
            td2.classList.add("bn");
            td3 = document.createElement('td');
            td3.classList.add("date");
            td4 = document.createElement('td');
            td4.classList.add("time");
            td5 = document.createElement('td');
            td5.classList.add("email");
            td6 = document.createElement('td');
            //td6.classList.add("dist");
            // td6.classList.add("bi");
            // td6.classList.add("bi-trash");
            //td6.classList.add("glyphicon glyphicon-trash");
            td6.addEventListener("click", () => this.delReserv(key, value[0], value[1]));

            text1 = document.createTextNode(no.toString());
            text2 = document.createTextNode(value[0]);
            text3 = document.createTextNode(value[1]);
            text4 = document.createTextNode(value[2]);
            text5 = document.createTextNode(value[3]);
            let t6 = document.createElement("i") as HTMLElement;
            t6.classList.add("fa");
            t6.classList.add("fa-trash-o");
            t6.classList.add("restButton");

            td1.appendChild(text1);
            td2.appendChild(text2);
            td3.appendChild(text3);
            td4.appendChild(text4);
            td5.appendChild(text5);
            td6.appendChild(t6);

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);

            table.appendChild(tr);
            no++;
        }
        console.log('after creating table ...');
        document.getElementById("favoriteTable")!.appendChild(table);
    }
    //delete reservation
    delReserv(key: string, eventName: string, targetDate: string) {

        console.log('enter to del key: ' + key);
        globalThis.favoriteList.delete(key);
        globalThis.reserveNo--;
        let table = document.getElementById("reserveTable") as HTMLTableElement;
        if (!table) {
            globalThis.favoriteList.delete(key);
            return;
        }
        if (globalThis.favoriteList.size == 0) {
            document.getElementById("favoriteTable")!.innerHTML="";
            (<HTMLElement>document.getElementById("mbTitle"))!.innerHTML="No reservations to show";
            return;
        }
        console.log(eventName);
        console.log(targetDate);
        for (let i = 1; i < table.rows.length; i++) {
            console.log(table.rows[i]);
            console.log(table.rows[i].cells[1].innerHTML);
            console.log(table.rows[i].cells[2].innerHTML);
            if (table.rows[i].cells[1].innerHTML == eventName &&
                table.rows[i].cells[2].innerHTML == targetDate) {
                table.rows[i].remove();
                break;
            }
        }
    }

    //create carousel img
    createCarouselImg(bid: string) {
        let inner = document.getElementById("carousel-inner") as HTMLElement;
        let v = globalThis.bDetail.get(bid)!;
        for (let i = 0; i < v!.length; i++) {
            console.log(v![i]);
            let dv = document.createElement('div');
            dv.classList.add("carousel-item");
            if (v[i][0] === 'h') {
                let img = document.createElement('img');
                //d-block img-fluid img-thumbnail mx-auto
                img.classList.add("d-block");
                img.classList.add("img-fluid");
                img.classList.add("img-thumbnail");
                img.classList.add("mx-auto");
                img.src = v[i];
                dv.appendChild(img);
                inner.appendChild(dv);
            } else break;
        }
        console.log('after creating table ...');
    }

    //create review table
    createReviewTable(bid: string) {
        console.log('enter to createReserveTable');
        //store json obj into data array
        var len = globalThis.jsonReveiewStrArray.length;
        console.log(len);

        let data: any[] = [];
        if (len === 0) {
            let title = document.createElement('h1') as HTMLElement;
            title!.textContent = "No reviews yet";
            title.style.color = "red";
            title.style.textAlign = "center";
            let tmp = document.getElementById("Reviews") as HTMLElement;
            tmp.appendChild(title);
            return;
        }
        // no, business name, date, time, email, delet button
        var table = document.createElement('table');
        table.setAttribute("id", "reviewsTable");
        var tr = document.createElement('tr');
        //var td1 = document.createElement('td');
        tr.classList.add("arow");


        table.appendChild(tr);
        console.log('before creating table ...');
        console.log('data length is ' + len);
        for (let i = 0; i < len; i++) {
            console.log(jsonReveiewStrArray[i]);
            let jobj = JSON.parse(jsonReveiewStrArray[i]);
            tr = document.createElement('tr');
            tr.classList.add("arow");
            //name bold
            //rating
            //comment
            //date
            console.log(jobj.reviews[i].user);
            console.log(jobj.reviews[i].user.name);
            let name = document.createElement('h5');
            name.innerHTML = jobj.reviews[i].user.name;
            let ratingt = document.createElement('p');
            ratingt.innerHTML = 'Rating: ' + jobj.reviews[i].rating;
            let comment = document.createElement('p');
            comment.innerHTML = jobj.reviews[i].text;
            let date = document.createElement('p');
            date.innerHTML = jobj.reviews[i].time_created;

            tr.appendChild(name);
            tr.appendChild(ratingt);
            tr.appendChild(comment);
            tr.appendChild(date);

            table.appendChild(tr);
        }
        console.log('after creating table ...');
        let tmp = document.getElementById("Reviews") as HTMLElement;
        console.log(tmp);
        tmp.appendChild(table);
    }
    async showSpotify(artist: string) {

        await fetch('https://yukichat-ios13.wl.r.appspot.com/getSpotifyArtist?' + new URLSearchParams({
            "artist": artist
        }))
        .then(response => response.json())
        .then(response => {
            globalThis.jsobj = response;
            globalThis.jsonText = JSON.stringify(response);
            console.log(globalThis.jsonText)
            return response;
        })
        let artists = JSON.parse(globalThis.jsonText);
        let count = 0
        console.log('-------- lets go ---------')
        for (const name in artists) {
            console.log(name);
            var dd = document.createElement('div');
            dd.classList.add('carousel-item');
            if (count == 0) dd.classList.add('active');
            var content = document.createElement('div');
            content.classList.add('spotifyCarousel');
            
            //create first row
            //artist icon + name
            var fr = document.createElement('div');
            fr.classList.add('spotifyRow');
            var c1 = document.createElement('div');
            c1.classList.add('spotifyItems');
            var title = document.createElement('h4');
            title.style.color = "#9DF1DF"
            title.innerHTML = name
            var artitIcon = document.createElement('img');
            artitIcon.src = artists[name][4]
            artitIcon.classList.add('artistIcon');
            //for artist icon
            //globalThis.jsobj[name][4]
            c1.appendChild(title)
            c1.appendChild(artitIcon)
            fr.appendChild(c1);
            //popularity
            var c2 = document.createElement('div');
            c2.classList.add('spotifyItems');
            title = document.createElement('h4');
            title.style.color = "#9DF1DF"
            title.innerHTML = "Popularity"
            //<mat-spinner color="accent" mode="determinate" diameter="60">66</mat-spinner>
            var words = document.createElement('mat-progress-spinner');
            words.setAttribute('mode', 'determinate');
            words.setAttribute('value', artists[name][2]);
            words.setAttribute('color', 'accent');
            // words.setAttribute('diameter', "60");
            // words.innerHTML = artists[name][2]
            c2.appendChild(title)
            c2.appendChild(words)
            fr.appendChild(c2);
            //followers
            c2 = document.createElement('div');
            c2.classList.add('spotifyItems');
            title = document.createElement('h4');
            title.style.color = "#9DF1DF"
            title.innerHTML = "Followers"
            words = document.createElement('h4');
            words.style.color = "white"
            words.innerHTML = artists[name][1]
            c2.appendChild(title)
            c2.appendChild(words)
            fr.appendChild(c2);
            //spotify link
            c2 = document.createElement('div');
            c2.classList.add('spotifyItems');
            title = document.createElement('h4');
            title.style.color = "#9DF1DF"
            title.innerHTML = "Spotify Link"
//             <a href="https://www.spotify.com/" target="_blank" rel="noopener noreferrer">
//   <span class="spotify-icon"></span>
// </a>         
            var tag = document.createElement('a');
            tag.href = artists[name][3]
            tag.target = "_blank"
            tag.rel = "noopener noreferrer"
            var sp = document.createElement('span');
            sp.classList.add("spotify-icon")
            tag.appendChild(sp)
            c2.appendChild(title)
            c2.appendChild(tag)
            fr.appendChild(c2);
            //create second row
            var sr = document.createElement('div');
            sr.classList.add('spotifyItems');
            title = document.createElement('h4');
            title.style.color = "#9DF1DF"
            title.innerHTML = "Album featuring "+artist
            sr.appendChild(title)
            //put 3 album img
            var ssr = document.createElement('div');
            var albumImgs = document.createElement('div');
            albumImgs.classList.add('albumIMG')
            ssr.appendChild(albumImgs)
            for (let j = 5; j < artists[name].length; j++) {
                let img = document.createElement('img');
                img.src = artists[name][j]
                // img.classList.add('albumIMG')
                albumImgs.appendChild(img)
            }
            sr.appendChild(ssr);
            content.appendChild(fr)
            var newline = document.createElement('br')
            content.appendChild(newline)
            content.appendChild(newline)
            content.appendChild(sr)
            dd.appendChild(content)
            document.getElementById('cinner')!.appendChild(dd)
            count+=1
        }
        console.log("artist count is " + count)
        if (count == 0) {
            document.getElementById('noArtist')!.style.display = "block";
            document.getElementById('carouselExampleControls')!.style.display = "none";
        }
    }
    async showVenue() {
        console.log('=== enter showVenue ===')

        let eid = '&keyword=' + globalThis.idMapping.get(selectedName)![2].replace(/\s+/g, '%20');
        eid += globalThis.latlng;
        //Z7r9jZ1AdbxAM
        console.log('the eid we got is ' + eid);
        //document.getElementById("vdIMG").src = ;
        //we need to get address through the api link:
        let url = 'https://app.ticketmaster.com/discovery/v2/venues?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ' + eid;
        await fetch('https://yukichat-ios13.wl.r.appspot.com/getTicketMasterSearch?' + new URLSearchParams({
            "url": url
        }))
            .then(response => response.json())
            .then(response => {
                globalThis.jsobj = response;
                globalThis.jsonText = JSON.stringify(response);
                console.log(globalThis.jsonText)
                return response;
            })
        let jobj = JSON.parse(globalThis.jsonText);
        if (!jobj._embedded?.venues[0]) return;
        //we will start from here

        // let add = 'Address: ';
        if (jobj._embedded?.venues[0]?.address.line1) {
            // add+=jobj.address.line1 +"<br>";
            (document.getElementById('vdaddr') as HTMLElement).innerHTML = jobj._embedded?.venues[0]?.address.line1 +", "
                jobj._embedded?.venues[0]?.city.name + ", " + jobj._embedded?.venues[0]?.state.name
        } else {
            (document.getElementById('vdaddr') as HTMLElement).innerHTML = jobj._embedded?.venues[0]?.city.name + ", " + jobj._embedded?.venues[0]?.state.name
        }

        //for google map URL
        //it will encouner repeat state or city name especially new york ...
        //let kw = jobj.state.name +'+'+ jobj.city.name + '+' + jobj.name;
        let kw = jobj._embedded?.venues[0]?.name + '+' + jobj._embedded?.venues[0]?.postalCode;
        kw = kw.replace(/\s/g, '+');
  

        document.getElementById("vdHeader")!.innerHTML = jobj._embedded?.venues[0]?.name;

        document.getElementById("vdphone")!.innerHTML = jobj._embedded?.venues[0]?.boxOfficeInfo?.phoneNumberDetail;
        //open hour
        document.getElementById("vdoh")!.innerHTML = jobj._embedded?.venues[0]?.boxOfficeInfo?.openHoursDetail;
        //general rule
        document.getElementById("vdgr")!.innerHTML = jobj._embedded?.venues[0]?.generalInfo?.generalRule;
        //children rule
        document.getElementById("vdcr")!.innerHTML = jobj._embedded?.venues[0]?.generalInfo?.childRule;
        //deal with google map tab


        const elem = document.getElementById("VenueDetails")!.style.display = 'flex';

    }


    /////////GEO coding from MIT
    encode(lat: number, lon: number, precision: number) {
        const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';

        lat = Number(lat);
        lon = Number(lon);
        precision = Number(precision);

        if (isNaN(lat) || isNaN(lon) || isNaN(precision)) throw new Error('Invalid geohash');

        let idx = 0; // index into base32 map
        let bit = 0; // each char holds 5 bits
        let evenBit = true;
        let geohash = '';

        let latMin = -90, latMax = 90;
        let lonMin = -180, lonMax = 180;

        while (geohash.length < precision) {
            if (evenBit) {
                // bisect E-W longitude
                const lonMid = (lonMin + lonMax) / 2;
                if (lon >= lonMid) {
                    idx = idx * 2 + 1;
                    lonMin = lonMid;
                } else {
                    idx = idx * 2;
                    lonMax = lonMid;
                }
            } else {
                // bisect N-S latitude
                const latMid = (latMin + latMax) / 2;
                if (lat >= latMid) {
                    idx = idx * 2 + 1;
                    latMin = latMid;
                } else {
                    idx = idx * 2;
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
}
