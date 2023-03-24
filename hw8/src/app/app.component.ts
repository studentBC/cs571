import { Component, OnInit, ElementRef, NgModule, ViewChild, Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpXsrfTokenExtractor } from "@angular/common/http"
import { NONE_TYPE } from "@angular/compiler";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { GoogleMap } from "@angular/google-maps";
import { FavoritesComponent } from './favorites/favorites.component';
// import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
export var favoriteList: Map<string, string[]>;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    /////////////// inital variable realted ////////////
    constructor(private fav: FavoritesComponent) {
        
    }
    ngOnInit(): void {
        //favoriteList = new Map<string, string[]>();
        //localStorage.removeItem("favoriteList");
        //console.log("new start!!!");
        if (typeof(Storage) !== "undefined") {
            if (localStorage.getItem("favoriteList")) {
                // console.log("==== here you go ===");
                // //const parsedFavoriteList = new Map(JSON.parse(storedFavoriteList));
                // console.log( JSON.parse(localStorage.getItem("favoriteList")!));
                // console.log("====================");
                favoriteList = new Map(JSON.parse(localStorage.getItem("favoriteList")!));
                //favoriteList = JSON.parse(localStorage.getItem("favoriteList")!);
            } else {
                favoriteList = new Map<string, string[]>();
            }
        } else {
            // Sorry! No Web Storage support..
            favoriteList = new Map<string, string[]>();
        }
    }
    
    callOtherModuleFunction() {
      this.fav.createReserveTable();
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
        // let tabID: string;
        // if (id == 'sea') {
        //     tabID = "searchTab";
        //     let showTB = document.getElementById("searchTab");
        //     let noTB = document.getElementById("myBookingsTab");
        //     noTB!.style.display = "none";
        //     showTB!.style.display = "block";
        //     document.getElementById("favoriteTable")!.innerHTML="";
        //     // for (let i = 0; i < elem.length; i++) {
        //     //     (elem[i] as HTMLElement).style.display = "none";
        //     // }
        // } else {
        //     let showTB = document.getElementById("myBookingsTab") as HTMLElement;
        //     // let noTB = document.getElementById("searchTab");
        //     // noTB!.style.display = "none";
        //     showTB!.style.display = "block";
        //     // this.cc();
        //     //go clear
        //     //dynamically create reserve table
            
        // }
    }

    // cc() {
    //     (<HTMLFormElement>document.getElementById("partOne")).reset();
    //     document.getElementById("APIresult")!.innerHTML = '';
    //     document.getElementById('notfound')!.style.display = 'none';
    //     document.getElementById("inputLoc")!.style.display = 'block';
    //     globalThis.idMapping.clear();
    //     jsonObjArray = [];
    //     document.getElementById("searchResult")!.style.display = "none";
    //     const elems = document.getElementsByClassName("searchResult");
    //     for (let i = 0; i < elems.length; i++) {
    //         (elems[i] as HTMLElement).style.display = "none";
    //     }
    // }
}
