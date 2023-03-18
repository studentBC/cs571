//
//  ContentView.swift
//  HW9UI
//
//  Created by Chin Lung on 1/22/23.
//

import SwiftUI

struct submitContent {
    var kw: String
    var dist: String
    var loc: String
    var selfLocate: Bool
    var Category: String
    
}


struct ContentView: View {
    @State private var kw: String = ""
    @State private var dist: String = ""
    @State private var loc: String = ""
    @State private var selection: String = "Default"
    @State private var selfLocate: Bool = false
    @State private var searchResultTable: [Event] = []
    @State private var showSR = false
    @ObservedObject private var searchAPI = apiSearchModel()
    
    let categories = ["Default", "Music", "Sports", "Arts & Theatre", "Film","Miscellaneous"]
    var body: some View {
        // A cell that, when selected, adds a new folder.
        // reserve seat logo
        NavigationView {
            ZStack {
                 // Set the background color of the screen
                VStack(alignment: .leading, spacing: 2) {
                    HStack {
                        Spacer().frame(maxWidth:.infinity)
                        Button(action: reserve) {
                            NavigationLink(destination: ReservationView()) {
                                Label("", systemImage: "calendar.badge.plus")
                            }
                        }
                    }
                    Text("Events Search")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .padding(.leading, 16)
                        .padding(.bottom, 0)
                    
                    Form {
                        TextField("Key Word:", text: $kw)
                        TextField("Distance:", text: $dist)
                        Picker("Category", selection: $selection) {
                            ForEach(categories, id: \.self) {
                                Text($0)
                            }
                        }
                        .pickerStyle(.menu)
                        if (!selfLocate) {
                            TextField("Location", text: $loc)
                        }
                        Toggle("auto detect my location", isOn: $selfLocate)
                        HStack {
                            Button(action: {
                                Task {
                                    let sbc = submitContent(kw: kw, dist: dist, loc: loc, selfLocate: selfLocate, Category: selection)
                                    await searchAPI.goSearch(suc: sbc)
                                    showSR = true
                                }
                            }) {
                                Text("Submit")
                            }.buttonStyle(.bordered)
                                .tint(.blue)
                            Button(action: {
                                // Closure will be called once user taps your button
                                kw = "";
                                selection = "Default";
                                dist = "";
                                loc = "";
                                selfLocate = false;
                                searchAPI.searchResultTable.removeAll();
                                showSR = false
                            }) {
                                Text("Clear")
                            }.buttonStyle(.bordered)
                                .tint(.red)
                        }
                    }//.navigationTitle("Events Search")
                    
                    //https://www.ralfebert.com/ios-examples/uikit/uitableviewcontroller/
                    //https://developer.apple.com/documentation/swiftui/table
                    //let no = 1
                    //https://www.appcoda.com/swiftui-first-look/
                    if (showSR) {
                        if (searchAPI.searchResultTable.count == 0) {
                            Text("No Records found").padding().backgroundStyle(.white).foregroundColor(.red)
                        } else {
                            List(searchAPI.searchResultTable, id: \.name) { eve in
                                NavigationLink(destination: moreInfo(event: eve)) {
                                    searchTableCell(es: eve)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
struct searchTableCell: View {
    let es: Event
    var body: some View{
        HStack {
            Text((es.date ?? "") + "\n" + (es.time ?? "")).aspectRatio(contentMode: .fit)
            AsyncImage(url: URL(string: es.imgUrl),
                       content: {
                image in image.resizable().aspectRatio(contentMode: .fit)
            },
                       placeholder: {
                ProgressView()
            })
            Text(es.name).aspectRatio(contentMode: .fit)
            Text(es.genre).aspectRatio(contentMode: .fit)
            //that is weird here we should debug for it ... maybe json obj error
            Text((es.venue) ?? "none").aspectRatio(contentMode: .fit)
        }
    }
}

func reserve() {
    
}
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
