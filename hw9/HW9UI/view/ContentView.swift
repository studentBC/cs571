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
    @State private var suggestions: [String] = []
    @State private var showSuggestions = false
    @State private var selectedSuggestion = ""
    
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
                        .onChange(of: kw) { _ in
                            getSuggestions()
                            showSuggestions = true
                        }
                        //VStack {
                            ForEach(Array(suggestions.prefix(5)), id: \.self) { suggestion in
                                Button(action: {
                                    selectedSuggestion = suggestion
                                    kw = suggestion
                                    showSuggestions = false
                                    suggestions=[]
                                }) {
                                    Text(suggestion)
                                        .foregroundColor(.primary)
                                        .padding(.vertical, 8)
                                        .padding(.horizontal)
                                }
                            }
//                            .background(Color.secondary)
//                            .cornerRadius(8)
//                            .shadow(radius: 4)
                        //}.background(Color.secondary)
//                        VStack {
//                            List(suggestions, id: \.self) { suggestion in
//                                Text(suggestion)
//                            }
//                        }
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
                                    
//                                    do {
//                                        let lol = try await searchAPI.getSuggestion(kw: kw)
//                                        print("$$$$$$$$$$$$$$$$$$$$$$$")
//                                        for s in lol.sgs {
//                                            print(s)
//                                        }
//                                        print(lol)
//                                    } catch {
//                                        print("Error searching Spotify for artists: \(error)")
//                                    }
                                    
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
    func getSuggestions() {
        // Call getSuggestion() function with the current keyword
        suggestions = [];
        if (!showSuggestions) {
            return;
        }
        var eid = "&keyword=" + kw;
        eid = eid.replacingOccurrences(of: " ", with: "%20")
        let urlString = "https://app.ticketmaster.com/discovery/v2/suggest/?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ"+eid
        
        var components = URLComponents()
        components.queryItems = [
            URLQueryItem(name: "url", value: urlString)
        ]
        var sgs = suggestion(sgs: [])
        
        let url = URL(string: "https://yukichat-ios13.wl.r.appspot.com/getSuggestion"+components.string!)!
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                print("error when fetching suggestion \(error)")
            } else if let data = data {
                let decoder = JSONDecoder()
                do {
                    sgs = try decoder.decode(suggestion.self, from: data)
                    for string in sgs.sgs {
                        self.suggestions.append(string);
                    }
                } catch {
                    print("error when fetching suggestion \(error)")
                }
            }
        }.resume()
    }
    
//    func getSuggestion(keyword: String, completion: @escaping (Result<[String], Error>) -> Void) {
//        var eid = "&keyword=" + keyword;
//        eid = eid.replacingOccurrences(of: " ", with: "%20")
//        let urlString = "https://app.ticketmaster.com/discovery/v2/suggest/?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ"+eid
//
//        var components = URLComponents()
//        components.queryItems = [
//            URLQueryItem(name: "url", value: urlString)
//        ]
//        var sgs = suggestion(sgs: [])
//
//        let url = URL(string: "https://yukichat-ios13.wl.r.appspot.com/getSuggestion"+components.string!)!
//        URLSession.shared.dataTask(with: url) { data, response, error in
//            if let error = error {
//                completion(.failure(error))
//            } else if let data = data {
//                let decoder = JSONDecoder()
//                do {
//                    sgs = try decoder.decode(suggestion.self, from: data)
//                    for string in sgs.sgs {
//                        self.suggestions.append(string);
//                    }
//                    completion(.success(suggestions))
//                } catch {
//                    completion(.failure(error))
//                }
//            }
//        }.resume()
//    }
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
