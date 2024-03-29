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

extension Binding where Value == Bool {
    
    static func &&(_ lhs: Binding<Bool>, _ rhs: Binding<Bool>) -> Binding<Bool> {
        return Binding<Bool>( get: { lhs.wrappedValue && rhs.wrappedValue },
                              set: {_ in })
    }
}

struct ContentView: View {
    @State private var kw: String = ""
    @State private var prev: String = ""
    @State private var dist: String = "10"
    @State private var loc: String = ""
    @State private var selection: String = "Default"
    @State private var selfLocate: Bool = false
    @State private var searchResultTable: [Event] = []
    @State private var showSR = false
    @State private var suggestions: [String] = []
    @State private var showSuggestions = false
    @State private var selectedSuggestion = ""
    @State private var showAgain=true;
    @State private var typingTimer: Timer?
    @State private var okay = false
    @State private var showProgressView = false
    @State private var determined = false
    @ObservedObject private var searchAPI = apiSearchModel()
    
    let categories = ["Default", "Music", "Sports", "Arts & Theatre", "Film","Miscellaneous"]
    var body: some View {
        // A cell that, when selected, adds a new folder.
        // reserve seat logo
        NavigationView {
            
            // Set the background color of the screen
            VStack(alignment: .leading, spacing: 2) {
                Form {
                    HStack {
                        Text("Keyword: ").foregroundColor(Color.gray)
                        TextField("Required", text: $kw)
                            .onChange(of: kw) { value in
                                // Invalidate the previous timer when user is typing
                                typingTimer?.invalidate()
                                //print("enter on change: ", value)
                                showAgain = true
                                if (prev != value) {
                                    determined = false
                                    prev = value
                                } else {
                                    determined = true
                                }
                                // Start a new timer when user starts typing
                                typingTimer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: false) { _ in
                                    // Show suggestions when the timer completes
                                    if (kw.count > 0 && !determined) {
                                        showSuggestions = true
                                    }
                                    getSuggestions()
                                }
                                if kw.count > 0 && (selfLocate || loc.count > 0) {
                                    okay = true
                                } else {
                                    okay = false
                                }
                            }
                            .sheet(isPresented: $showSuggestions && $showAgain, onDismiss: {
                                showAgain = false
                                showSuggestions = false
                            } ) {
                                if suggestions.count == 0 {
                                    ProgressView("Loading")
                                } else {
                                    Text("Suggestions").bold().font(.system(size: 30)).padding(.top, 20)
                                    Form {
                                        ForEach(Array(suggestions.prefix(5)), id: \.self) { suggestion in
                                            Button(action: {
                                                selectedSuggestion = suggestion
                                                kw = suggestion
                                                prev = kw
                                                determined = true
                                                showSuggestions = false
                                                showAgain = false
                                                suggestions = []
                                            }) {
                                                Text(suggestion)
                                                    .foregroundColor(.primary)
                                                    .padding(.vertical, 8)
                                                    .padding(.horizontal)
                                            }
                                        }
                                    }
                                }
                            }
                    }
                    
                    HStack {
                        Text("Distance: ") .foregroundColor(Color.gray)
                        TextField(dist, text: $dist).foregroundColor(Color.black)
                    }
                    
                    Picker("Category", selection: $selection) {
                        ForEach(categories, id: \.self) {
                            Text($0)
                        }
                    }.foregroundColor(Color.gray)
                        .pickerStyle(.menu)
                    if (!selfLocate) {
                        HStack {
                            Text("Location: ").foregroundColor(Color.gray)
                            TextField("Required", text: $loc).onChange(of: loc) { value in
                                if kw.count > 0 && (selfLocate || loc.count > 0) {
                                    okay = true
                                } else {
                                    okay = false
                                }
                            }
                        }
                        //TextField("Location", text: $loc)
                    }
                    Toggle("Auto-detect my location", isOn: $selfLocate).foregroundColor(Color.gray).onChange(of: selfLocate) { value in
                        if kw.count > 0 && (selfLocate || loc.count > 0) {
                            okay = true
                        } else {
                            okay = false
                        }
                    }
                    HStack {
                        Button(action: {
                            Task {
                                searchAPI.searchResultTable.removeAll()
                                let sbc = submitContent(kw: kw, dist: dist, loc: loc, selfLocate: selfLocate, Category: selection)
                                showProgressView = true
                                showSR = true
                                await searchAPI.goSearch(suc: sbc)
                                
                                showProgressView = false
                            }
                        }) {
                            Text("Submit").foregroundColor(.white)
                        }.disabled(!okay).background(okay ? Color.red : Color.gray).buttonStyle(.bordered).clipShape(RoundedRectangle(cornerRadius: 10))
                            .frame(width: 180, height: 50)
                        //.tint(.gray)
                        Button(action: {
                            // Closure will be called once user taps your button
                            kw = "";
                            selection = "Default";
                            dist = "10";
                            loc = "";
                            selfLocate = false;
                            searchAPI.searchResultTable.removeAll();
                            showSR = false
                            showAgain=false;
                            showSuggestions = false;
                            okay = false;
                        }) {
                            Text("Clear").foregroundColor(.white)
                        }.background(Color.blue).buttonStyle(.bordered).clipShape(RoundedRectangle(cornerRadius: 10))
                        //.frame(width: 200, height: 50)
                    }
                    //}//.navigationBarTitle("Events Search")
                    
                    //https://www.ralfebert.com/ios-examples/uikit/uitableviewcontroller/
                    //https://developer.apple.com/documentation/swiftui/table
                    //let no = 1
                    //https://www.appcoda.com/swiftui-first-look/
                    
                    if (showSR) {
                        Section {
                            Text("Results").bold().font(.title)
                            if showProgressView {
                                HStack {
                                        Spacer()
                                        ProgressView("Please wait...")
                                        Spacer()
                                    }
                            } else {
                                if (searchAPI.searchResultTable.count == 0) {
                                    Text("No result available").foregroundColor(.red)
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
            }.toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: reserve) {
                        NavigationLink(destination: ReservationView()) {
                            Label("", systemImage: "heart.circle").font(.system(size: 25))
                        }
                    }
                }
            }
            .navigationBarTitle("Events Search")
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
}
struct searchTableCell: View {
    let es: Event
    var body: some View{
        HStack {
            Text((es.date ?? "") + "|" + (es.time ?? "")).foregroundColor(.gray)//.aspectRatio(contentMode: .fit)
            AsyncImage(url: URL(string: es.imgUrl),
                       content: {
                image in image.resizable().aspectRatio(contentMode: .fit)
            },
                       placeholder: {
                ProgressView()
            })
            Text(es.name).bold().lineLimit(3)//.aspectRatio(contentMode: .fill)
            //Text(es.genre).aspectRatio(contentMode: .fit)
            //that is weird here we should debug for it ... maybe json obj error
            Text((es.venue ?? "none").replacingOccurrences(of: "|", with: "")).foregroundColor(.gray)
            //.aspectRatio(contentMode: .fit)
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

