import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { favoriteList } from '../app.component';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements AfterViewInit {
    @ViewChild('mbTitle')mbTitle!: ElementRef;
    @ViewChild("favoriteTable") favoriteTable!: ElementRef;
    ngAfterViewInit(): void {
        this.createReserveTable()
    }
    
    ///////////// dynamically deal with reservation table ///////////////
    createReserveTable() {
      console.log('enter to createReserveTable');
      console.log(this.mbTitle.nativeElement.innerHTML)
    //   let tmp = this.el.nativeElement.querySelector('.fT');
    //     console.log(tmp);
      //store json obj into data array
      this.mbTitle.nativeElement.classList.remove("hasEvents");
      this.mbTitle.nativeElement.classList.remove("hasnoEvents");
      console.log(favoriteList)
      if (!favoriteList) {
        this.mbTitle.nativeElement.innerHTML="No favorite events to show";
        this.mbTitle.nativeElement.classList.add("hasnoEvents")
        console.log('go to exit')
        return;
      }
      var len = favoriteList.size;
      console.log(len);

      let data: any[] = [];
      
      //let temp = document.getElementById("mbTitle") as HTMLElement;
      //console.log('temp is ' ,temp)
      
      if (len === 0) {
            this.mbTitle.nativeElement.innerHTML="No favorite events to show";
            this.mbTitle.nativeElement.classList.add("hasnoEvents")
          return;
      }

      this.mbTitle.nativeElement.innerHTML = "List of your favorite events";
      this.mbTitle.nativeElement.classList.add("hasEvents")
      // no, business name, date, time, email, delet button
      var table = document.createElement('table');
      table.setAttribute("id", "reserveTable");
      table.style.width="100%";
      table.classList.add("rounded-table");
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
      for (let [key, value] of favoriteList) {
          console.log(key + ' : ' + value + ' #### ');
          tr = document.createElement('tr');
          tr.classList.add("aarow");
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
      this.favoriteTable.nativeElement.appendChild(table)
      //document.getElementById("favoriteTable")!.appendChild(table);
  }
      //delete reservation
    delReserv(key: string, eventName: string, targetDate: string) {
        alert("Event Removed from Favorites!");
        console.log('enter to del key: ' + key);
        favoriteList.delete(key);
        let table = document.getElementById("reserveTable") as HTMLTableElement;
        if (!table) {
            favoriteList.delete(key);
            return;
        }
        (<HTMLElement>document.getElementById("mbTitle")).classList.remove("hasEvents");
        (<HTMLElement>document.getElementById("mbTitle")).classList.remove("hasnoEvents");
        if (favoriteList.size == 0) {
            document.getElementById("favoriteTable")!.innerHTML="";
            (<HTMLElement>document.getElementById("mbTitle"))!.innerHTML="No favorite events to show";
            (<HTMLElement>document.getElementById("mbTitle")).classList.add("hasnoEvents")
            return;
        } else  this.mbTitle.nativeElement.classList.add("hasEvents")
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
}
