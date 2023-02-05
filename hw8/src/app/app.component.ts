import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { HttpClient, HttpXsrfTokenExtractor } from "@angular/common/http"
import { NONE_TYPE } from "@angular/compiler";
// import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

declare global {
  var lat: number;
  var long: number;
  var res: 0;
  var jsobj: object;
  var reserveNo: number;
  var jsonText: string;
  var ascending: boolean,
      prevCol: -1;
  var jsonObjArray: object[];
  var jsonStrArray: string[];
  var modalDisplay: string;
  //for reserve info
  var db: Map<string, string[]>;
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
  //debug usage
  var debug: boolean;
  var reserveModal: ElementRef;
  var gMLoc: string;
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
  ngOnInit(): void {
      globalThis.ascending = true;
      globalThis.jsonObjArray = [];
      globalThis.jsonStrArray = [];
      globalThis.jsonReveiewStrArray = [];
      globalThis.modalDisplay = "none";
      globalThis.clickedBN = "lol";
      globalThis.reserveNo = 1;
      globalThis.db = new Map<string, string[]>();
      globalThis.bDetail = new Map<string, string[]>();
      globalThis.nameToUID = new Map<string, string>();
      globalThis.debug = true;
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
      } else {
          let showTB = document.getElementById("myBookingsTab") as HTMLElement;
          let noTB = document.getElementById("searchTab");
          noTB!.style.display = "none";
          showTB!.style.display = "block";
          showTB.innerHTML = "";
          //dynamically create reserve table
          this.createReserveTable();
      }
      const elems = document.getElementsByClassName("searchResult");
      for (let i = 0; i < elems.length; i++) {
          const ee = elems[i] as HTMLElement;
          ee.style.display = 'none';
      }
  }
  putMeUp(id: string) {
      console.log('we call tab ');
      console.log(id);
      let t1 = document.getElementById("businessTab");
      let t2 = document.getElementById("Maplocation");
      let t3 = document.getElementById("Reviews");
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
      //nodeJS server IP
      await fetch('http://127.0.0.1:3000/getYelpSearch', {
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
              globalThis.jsonText = JSON.stringify(response);
              console.log(typeof (response));
              globalThis.jsobj = response;
              console.log(typeof (response));
              //console.log(JSON.stringify(response));
              return response;
          })
          .then(response => this.initial(response));
      console.log('---- come out ----');
      let jojo = JSON.parse(globalThis.jsonText);
      console.log(typeof (jojo));
      console.log(jojo.total);
      // console.log(jsonObjArray[0].total);
      let left = jojo.total - jojo.businesses.length, start = 50;
      if (left > 0 && !globalThis.debug) {
          while (left) {
              console.log(left);
              await fetch('http://127.0.0.1:3000/getYelpSearch', {
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      "url": url + '&offset=' + start
                  })
              })
                  .then(response => response.json())
                  .then(response => this.initial(response))
                  .then(response => {
                      start += jojo.businesses.length;
                      let job = JSON.parse(globalThis.jsonStrArray[jsonStrArray.length - 1]);
                      left -= job.businesses.length;
                  });
          }
      }
      console.log(jsonObjArray.length);
      this.createAPIresultTable();
      return;
  }
  // showPosition(position: JSON) {
  //     lat = position.coords.latitude;
  //     long = position.coords.longitude;
  //     console.log(lat);
  //     console.log(long);
  // }
  submitlol(form: NgForm) {
      // console.log(event);
      //form submit will refresh my page and clear log
      // event.preventDefault();
      let kw = "",
          loc = "Taipei",
          selfLocate = false,
          fc = "Default",
          dist = 10;
      console.log(form.value);
      kw = form.value.kw || 'deli';
      loc = form.value.location || "Taipei";
      selfLocate = form.value.autoDetect || false;
      fc = form.value.fc || "Default";
      dist = form.value.dm || 10;
      console.log(loc);
      console.log(kw);
      console.log(selfLocate);
      console.log(fc);
      console.log(dist);

      if (!dist) dist = 10000;
      if (!fc) fc = "all";
      if (!selfLocate && loc === "") {
          alert("you has not enter all required info!");
          return;
      }
      let url = "";
      if (selfLocate) {
          if (navigator.geolocation) {
              alert('selfLocate checked!');
              console.log('===   we have bug here for async problem   ===');
              navigator.geolocation.getCurrentPosition(this.showPosition);
              console.log('===   come outside   ===');
              // globalThis.lat = res.results[0].geometry.location.lat;
              // globalThis.long = res.results[0].geometry.location.lng;
              globalThis.gMLoc = '&center=' + globalThis.long + ',' + globalThis.lat;
              url = 'https://api.yelp.com/v3/businesses/search?term=' + kw + '&latitude=' + globalThis.lat + '&longitude=' + globalThis.long +
                  '&categories=' + fc + '&radius=' + dist + '&limit=50';
          } else {
              alert("Geolocation is not supported by this browser.");
          }
      } else {
          //if (!globalThis.debug) {
          globalThis.gMLoc = loc.replace(/\s+/g, '+');
          var gkey = 'AIzaSyA0s1a7phLN0iaD6-UE7m4qP-z21pH0eSc';
          var gr = this.httpGet('https://maps.googleapis.com/maps/api/geocode/json?address=' + loc + '&key=' + gkey);
          //call python get method to get the address
          var res = JSON.parse(gr);
          url = 'https://api.yelp.com/v3/businesses/search?limit=50' + '&term=' + kw + '&location=' + loc;
          //}
      }
      //call YELP https://docs.developer.yelp.com/reference/v3_business_search
      //let url = 'https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972&offset=20&limit=50';

      // if (globalThis.debug) {
      //     url = 'https://api.yelp.com/v3/businesses/search?term=delis&location=Austin&limit=50'
      // } else {
      // url = 'https://api.yelp.com/v3/businesses/search?term=' + kw + '&latitude=' + lat + '&longitude=' + long +
      //     '&categories=' + fc + '&radius=' + dist + '&limit=50';
      //}
      console.log('-------- the url is --------');
      console.log(url);
      console.log(globalThis.lat);
      console.log(globalThis.long);
      console.log('-----------------------------');
      this.callAPI(url);
  }
  ///////////// dynamically deal with webUI ///////////////
  createAPIresultTable() {
      console.log('enter to createAPIresultTable');
      let resultTable = document.getElementsByClassName("APIresult");
      //return;
      //store json obj into data array
      var len = jsonObjArray.length;
      console.log(len);
      let data: any[] = [];
      if (len > 0 && resultTable.length === 1) {
          console.log('enter to creat !!!');
          const elems = document.getElementsByClassName("APIresult");
          for (let i = 0; i < elems.length; i++) {
              const ee = elems[i] as HTMLElement;
              ee.style.display = 'flex';
          }
          let index = 1;
          console.log('------  here ------');
          for (let j = 0; j < len; j++) {
              console.log(jsonStrArray[j]);
              let jsonObj = JSON.parse(jsonStrArray[j]);
              console.log('jsonObj length is ' + jsonObj.businesses.length);
              for (let i = 0; i < jsonObj.businesses.length; i++) {
                  let tmp = [];
                  tmp.push(index);
                  if (jsonObj.businesses[i]?.image_url) tmp.push(jsonObj.businesses[i].image_url);
                  else tmp.push('http://clipart-library.com/images/dc45Exp9i.png');
                  if (jsonObj.businesses[i]?.name) tmp.push(jsonObj.businesses[i].name);
                  else tmp.push('fuck');
                  if (jsonObj.businesses[i]?.rating) tmp.push(jsonObj.businesses[i].rating);
                  else tmp.push(-1);
                  if (jsonObj.businesses[i]?.distance) tmp.push(jsonObj.businesses[i].distance);
                  else tmp.push(-1);
                  globalThis.nameToUID.set(jsonObj.businesses[i]?.name, jsonObj.businesses[i]?.id);
                  data.push(tmp);
                  index++;
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

      var text1 = document.createTextNode('No.');
      var text2 = document.createTextNode('Image');
      var text3 = document.createTextNode('Business Name');
      var text4 = document.createTextNode('Rating');
      var text5 = document.createTextNode('Distance(miles)');
      tr.classList.add("arow");
      td1.appendChild(text1);
      td1.classList.add("no");
      //td1.addEventListener("click", ()=>sortColumn(0));
      td2.appendChild(text2);
      td2.classList.add("img");
      //td2.addEventListener("click", ()=>sortColumn(1));
      td3.appendChild(text3);
      td3.classList.add("bn");

      td3.addEventListener("click", () => this.sortColumn(data, 2));
      td4.appendChild(text4);
      td4.classList.add("rating");
      td4.addEventListener("click", () => this.sortColumn(data, 3));
      td5.appendChild(text5);
      td5.classList.add("dist");
      td5.addEventListener("click", () => this.sortColumn(data, 4));

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);

      table.appendChild(tr);
      console.log('before creating table ...');
      console.log('data length is ' + data.length);
      for (let i: number = 0; i < data.length; i++) {
          tr = document.createElement('tr');
          tr.classList.add("arow");
          td1 = document.createElement('td');
          td1.classList.add("no");
          td2 = document.createElement('td');
          td2.classList.add("img");
          //let nav3 = document.createElement('nav');
          //we shall create <nav> </nav>
          // nav3.classList.add("nav-link");
          td3 = document.createElement('td');
          td3.classList.add("bn");
          console.log('');
          // td3.classList.add("nav");
          //creating a function which will not be executed immediately => moreinfo.bind(null, jsonObj.businesses[i].name)
          //td3.addEventListener("click", moreInfo.bind(null, jsonObj.businesses[i].name));
          td3.addEventListener("click", () => this.moreInfo(data[i][2]));
          td4 = document.createElement('td');
          td4.classList.add("rating");
          td5 = document.createElement('td');
          td5.classList.add("dist");


          let num = i + 1;
          text1 = document.createTextNode(num.toString());
          let image = document.createElement('img');
          image.src = data[i][1];
          image.style.width = "150px";

          text3 = document.createTextNode(data[i][2]);
          text4 = document.createTextNode(data[i][3]);
          text5 = document.createTextNode(data[i][4]);

          td1.appendChild(text1);
          td2.appendChild(image);
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
      console.log('after creating table ...');
      document.getElementsByClassName("APIresult")[0].appendChild(table);
  }

  sortColumn(array: any, col: any) {
      if (globalThis.prevCol == col) globalThis.ascending = !globalThis.ascending;
      if (ascending) {
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
          console.log(array[i][0]);
          console.log(table.rows[i].cells[1].innerHTML);
          //the image is not inner text so we need to change it!
          //table.rows[i].cells[1].innerText = array[i][1];
          table.rows[i].cells[1].innerText = "";
          let img = document.createElement('img');
          img.style.width = "150px";
          img.src = array[i][1];
          table.rows[i].cells[1].appendChild(img);
          //the business name still need to show its link
          table.rows[i].cells[2].innerText = array[i][2];
          table.rows[i].cells[3].innerText = array[i][3];
          table.rows[i].cells[4].innerText = array[i][4];
      }
      globalThis.prevCol = col;
  }
  //when user click the title and ask for more info
  moreInfo(name: string) {
      console.log('enter moreInfo');
      //let search result table gone
      const elem = document.getElementsByClassName("APIresult");
      for (let i = 0; i < elem.length; i++) {
          const ee = elem[i] as HTMLElement;
          ee.style.display = 'none';
      }
      globalThis.clickedBN = name;
      const elems = document.getElementsByClassName("searchResult");
      for (let i = 0; i < elems.length; i++) {
          const ee = elems[i] as HTMLElement;
          ee.style.display = 'flex';
      }
      //give searchResult a header
      const header = document.getElementById('currentBU') as HTMLElement;
      header.innerHTML = name;

      for (let a = 0; a < jsonObjArray.length; a++) {
          let jsobj = JSON.parse(jsonStrArray[a]);
          for (let i = 0; i < jsobj.businesses.length; i++) {
              if (name === jsobj.businesses[i].name) {
                  var addr = "",
                      trs = "",
                      cate = "";
                  for (let j = 0; j < Object.keys(jsobj.businesses[0].location.display_address).length; j++) {
                      addr += jsobj.businesses[j].location.display_address[j];
                      addr += " ";
                  }
                  console.log(addr);
                  //document.getElementById("address").textContent = addr;
                  let tmp = document.getElementById("pn") as HTMLElement;
                  if (jsobj.businesses[i].phone) {
                      tmp.innerHTML = jsobj.businesses[i].phone;
                  } else {
                      tmp.innerHTML = "None";
                  }
                  tmp = document.getElementById("address") as HTMLElement;
                  tmp.innerHTML = addr;

                  for (let j = 0; j < jsobj.businesses[i].transactions.length; j++) {
                      trs += jsobj.businesses[i].transactions[j];
                      trs += " ";
                  }
                  console.log(trs);
                  tmp = document.getElementById("transactionsSupported") as HTMLElement;
                  if (trs.length) {
                      tmp.innerHTML = trs;
                  } else {
                      tmp.innerHTML = "None";
                  }
                  for (let j = 0; j < jsobj.businesses[i].categories.length; j++) {
                      cate += jsobj.businesses[i].categories[j].alias;
                      cate += " ";
                  }

                  console.log(cate);
                  let lol = document.getElementById("categories") as HTMLElement;
                  lol.textContent = cate;
                  //for more info
                  //var anchor = document.createElement('a');
                  let anchor = document.getElementById("minfo") as HTMLAnchorElement;
                  //var anchorText = document.createTextNode('Yelp');
                  anchor.href = jsobj.businesses[i].url;
                  console.log("------- here -------");
                  console.log(jsobj);
                  //anchor.setAttribute('href', jsobj.businesses[i].url);
                  break;
              }
          }
      }
      //deal with google map tab
      let gm = document.getElementById('GMap') as HTMLIFrameElement;
      gm.src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyA0s1a7phLN0iaD6-UE7m4qP-z21pH0eSc&q=" + name + '+' + globalThis.gMLoc;
      //deal with review tab
      let nn = globalThis.nameToUID.get(name)?.toString()!;
      this.callImgAPI(nn);
      this.callReviewAPI(nn);
  }
  // handle modal 
  //https://stackoverflow.com/questions/59590391/bootstrap-modal-is-not-shown-on-angular-8-on-click
  openModal() {
      console.log('enter to open');
      // this.reserveModal.nativeElement.className = 'modal fade show';
      // this.reserveModal.open();
      //let tmp = document.getElementById('reserveModal');
      // tmp.style.display = "contents";
      let but = document.getElementsByClassName("resBut")[0] as HTMLButtonElement;
      console.log('------------------');
      console.log(but.innerHTML[0]);
      if (but.innerHTML[0] == 'C') {
          but!.style.backgroundColor = "#d0451b";
          but!.style.background = "linear-gradient(to bottom, #d0451b 5%, #bc3315 100%)";
          but.innerHTML = "Reserve now";
          //delete selected reservation
          const header = document.getElementById('currentBU') as HTMLElement;
          let name = header.innerHTML;
          console.log('***  going to cancel ' + name + '   ***');
          this.delReserv(name);
          //close and clear modal
          this.onCloseHandled();
          return;
      } else {
          // console.log(globalThis.reserveModal);
          // console.log(globalThis.reserveModal.nativeElement.getElementById('reserveModal'));
          // if (!globalThis.reserveModal) console.log('fuck there is no use');
          // else globalThis.reserveModal.nativeElement.click(); 
          let tmpbut = document.getElementById('realOpen') as HTMLButtonElement;
          tmpbut.click();
      }
  }



  onCloseHandled() {
      console.log('enter to onCloseHandled');
      let tt = document.getElementById('reserve-form') as HTMLFormElement;
      tt!.reset();
  }
  submitModal(form: NgForm): void {
      alert('Reservation created!');
      // no name date time email
      let no = globalThis.reserveNo.toString(),
          name = globalThis.clickedBN,
          email = form.value.mem,
          date = form.value.mdate,
          hour = form.value.mmh,
          min = form.value.mmm;
      console.log(no);
      console.log(name);
      console.log(email);
      console.log(date);
      console.log(hour);
      console.log(min);
      let but = document.getElementsByClassName("resBut")[0] as HTMLButtonElement;
      console.log('------------------');
      console.log(but.innerHTML[0]);
      if (but.innerHTML[0] == 'C') {
          globalThis.reserveModal.nativeElement
          but!.style.backgroundColor = "#d0451b";
          but!.style.background = "linear-gradient(to bottom, #d0451b 5%, #bc3315 100%)";
          but.innerHTML = "Reserve now";
          //delete selected reservation
          this.delReserv(name);
          //close and clear modal
          this.onCloseHandled();
          return;
      }
      // console.log(form.value);
      globalThis.reserveNo++;
      console.log('we set db key: ' + name);
      globalThis.db.set(name, [no, name, date, hour, min, email]);
      //turn reserve button to cancel button
      but!.style.backgroundColor = "#019ad2";
      but!.style.background = "linear-gradient(to bottom, #33bdef 5%, #019ad2 100%)";
      but.innerHTML = "Cancel reservation";
      //close and clear modal
      this.onCloseHandled();
      return;
  }
  ///////////// dynamically deal with reservation table ///////////////
  createReserveTable() {
      console.log('enter to createReserveTable');
      //store json obj into data array
      var len = globalThis.db.size;
      console.log(len);

      let data: any[] = [];
      if (len === 0) {
          let title = document.createElement('h1') as HTMLElement;
          console.log(title);
          title!.textContent = "No reservations to show";
          title.style.color = "red";
          title.style.textAlign = "center";
          let tmp = document.getElementById("myBookingsTab") as HTMLElement;
          console.log(tmp);
          tmp.appendChild(title);
          return;
      }
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

      var text1 = document.createTextNode('#.');
      var text2 = document.createTextNode('Business Name');
      var text3 = document.createTextNode('Date');
      var text4 = document.createTextNode('Time');
      var text5 = document.createTextNode('E-mail');
      var text6 = document.createTextNode('deletButton');
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
      for (let [key, value] of db) {
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
          td6.addEventListener("click", () => this.delReserv(key));

          text1 = document.createTextNode(no.toString());
          text2 = document.createTextNode(value[1]);
          text3 = document.createTextNode(value[2]);
          text4 = document.createTextNode(value[3] + ':' + value[4]);
          text5 = document.createTextNode(value[5]);
          let t6 = document.createElement("p") as HTMLElement;
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
      let tmp = document.getElementById("myBookingsTab") as HTMLElement;
      console.log(tmp);
      tmp.appendChild(table);
  }
  //delete reservation
  delReserv(key: string) {

      console.log('enter to del key: ' + key);
      globalThis.db.delete(key);
      globalThis.reserveNo--;
      let table = document.getElementById("reserveTable") as HTMLTableElement;
      if (!table) {
          db.delete(key);
          return;
      }
      if (table.rows.length === 1) {
          return;
      }
      console.log(table.rows.length);
      for (let i = 1; i < table.rows.length; i++) {
          console.log(table.rows[i]);
          console.log(table.rows[i].cells[0].innerHTML);
          console.log(table.rows[i].cells[1].innerHTML);
          if (table.rows[i].cells[1].innerHTML === key) {
              table.rows[i].remove();
              break;
          }
      }
  }
  //it should include all business detail including open hour
  async callImgAPI(bid: string) {
      //https://api.yelp.com/v3/businesses/_n-F9OKGHcfaC8Fs9NZKag/reviews?limit=20&sort_by=yelp_sort
      //nodeJS server IP
      let url = 'https://api.yelp.com/v3/businesses/' + bid;
      await fetch('http://127.0.0.1:3000/getYelpSearch', {
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
          .then(response => this.getBinfo(response));
      console.log('---- come out ----');
      this.createCarouselImg(bid);
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
  // curl --request GET \
  //  --url 'https://api.yelp.com/v3/businesses/business_id_or_alias/reviews?limit=20&sort_by=yelp_sort' \
  //  --header 'accept: application/json'
  // B3FleeBQX8tsgBhMwdFXLQ
  async callReviewAPI(bid: string) {
      //https://api.yelp.com/v3/businesses/_n-F9OKGHcfaC8Fs9NZKag/reviews?limit=20&sort_by=yelp_sort
      //nodeJS server IP
      let url = 'https://api.yelp.com/v3/businesses/' + bid + '/reviews?sort_by=yelp_sort&limit=50';
      await fetch('http://127.0.0.1:3000/getYelpSearch', {
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
              globalThis.jsonReviewText = JSON.stringify(response);
              console.log(typeof (response));
              return response;
          })
          .then(response => this.getReveiew(response));
      console.log('---- come out ----');
      let jojo = JSON.parse(globalThis.jsonReviewText);
      console.log(typeof (jojo));
      console.log(jojo.total);
      // console.log(jsonObjArray[0].total);
      let left = jojo.total - jojo.reviews.length, start = 50;
      console.log('left: ' + left);
      // API bug here !!!
      // if (left > 0) {
      //     while (left) {
      //         console.log(left);
      //         await fetch('http://127.0.0.1:3000/getYelpSearch', {
      //             method: 'POST',
      //             headers: {
      //                 'Accept': 'application/json',
      //                 'Content-Type': 'application/json'
      //             },
      //             body: JSON.stringify({
      //                 "url": url + '&offset=' + start
      //             })
      //         })
      //             .then(response => response.json())
      //             .then(response => this.getReveiew(response))
      //             .then(response => {
      //                 start += jojo.reviews.length;
      //                 let job = JSON.parse(globalThis.jsonReveiewStrArray[jsonReveiewStrArray.length - 1]);
      //                 left -= job.reviews.length;
      //             });
      //     }
      // }
      this.createReviewTable(bid);
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
}
