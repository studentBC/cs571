//
//  moreInfo.swift
//  HW9UI
//
//  Created by Chin Lung on 1/31/23.
//

import SwiftUI
import UIKit
import MapKit
import GoogleMaps
public var glat: Double = -33.86
public var glng: Double = 151.20

struct GoogleMapView: UIViewRepresentable {
    var loc: googleLoc
    //    init(glat: Double, glng: Double) {
    //        lat = glat
    //        lng = glng
    //        print("2. we got lat lng", lat, lng)
    //    }
    
    func makeUIView(context: Context) -> GMSMapView {
        GMSServices.provideAPIKey("AIzaSyC90QZRvrLzZiCA6-t8jwRrexVM1zdgmJo")
        // Create a GMSCameraPosition that tells the map to display the
        // coordinate -33.86,151.20 at zoom level 6.
        let camera = GMSCameraPosition.camera(withLatitude: loc.lat, longitude: loc.lng, zoom: 13.0)
        let mapView = GMSMapView.map(withFrame: .zero, camera: camera)
        
        // Creates a marker in the center of the map.
        let marker = GMSMarker()
        marker.position = CLLocationCoordinate2D(latitude: loc.lat, longitude: loc.lng)
        //        marker.title = "Sydney"
        //        marker.snippet = "Australia"
        marker.map = mapView
        
        return mapView
    }
    func updateUIView(_ mapView: GMSMapView, context: Context) {
        // Update the view if needed
        GMSCameraPosition.camera(withLatitude: loc.lat, longitude: loc.lng, zoom: 13)
        //mapView.animate(to: camera)
    }
}
////for Google map modal view
struct ModalView: View {
    @State var loc: googleLoc?
    var body: some View {
        VStack {
            Text("This is a modal view")
                .font(.title)
                .padding()
            if let loc = loc {
                GoogleMapView(loc: loc)
                    .frame(height: 300)
            } else {
                ProgressView()
            }
        }
        .onAppear {
            getGL()
        }
    }
    func getGL() {
        Task {
            do {
                let getVenue = apiSearchVenue()
                let loc = try await getVenue.getGoogleLoc(eve: addFavorites.chooseEvent!)
                self.loc = loc
            } catch {
                print("Error searching venue: \(error)")
            }
        }
    }
}

struct CarouselItemView: View {
    let artist: spotifyArtist
    var body: some View {
        HStack(spacing: 10) {
            AsyncImage(url: URL(string: artist.asICON),
                   content: { image in
                       image
                           .resizable()
                           .aspectRatio(contentMode: .fit)
                           .clipShape(RoundedRectangle(cornerRadius: 10))
                   },
                   placeholder: {
                       ProgressView()
                   })
            .frame(width: 80, height: 80)
            VStack {
                Text(artist.name).foregroundColor(.white)
                HStack {
                    Text(String(artist.astotal)).foregroundColor(.white)
                    Text("Followers").foregroundColor(.white)
                }
                HStack {
                    Button(action: {
                        guard let url = URL(string: artist.asurl) else { return }
                        UIApplication.shared.open(url)
                    }){
                        Image("spotify-icon")
                            .resizable()
                            .frame(width: 50, height: 50)
                            .padding(.bottom, 20)
                    }
                    Text("Spotify")
                }
            }
            VStack {
                Text("Popularity")
                Text(String(artist.aspop)) //to do
            }
        }
        HStack {
            Text("Album featuring Grouplove").foregroundColor(.white)
            HStack {
                if !artist.album0.isEmpty {
                    AsyncImage(url: URL(string: artist.album0),
                               content: {
                        image in image.resizable().aspectRatio(contentMode: .fit)
                    }, placeholder: {
                        ProgressView()
                    })
                }
                if !artist.album1.isEmpty {
                    AsyncImage(url: URL(string: artist.album1),
                               content: {
                        image in image.resizable().aspectRatio(contentMode: .fit)
                    }, placeholder: {
                        ProgressView()
                    })
                }
                if !artist.album2.isEmpty {
                    AsyncImage(url: URL(string: artist.album2),
                               content: {
                        image in image.resizable().aspectRatio(contentMode: .fit)
                    }, placeholder: {
                        ProgressView()
                    })
                }
            }
        }
    }
}
struct moreInfo: View {
    let event : Event
    var getVenue = apiSearchVenue()
    var getSpotify = apiSearchSpotify()
    var getFavorite = addFavorites()
    @State var spotifyArtists: [spotifyArtist]?
    @State var venueDetail: getVenueDetails?
    @State private var selectedTab = 0
    @State var isFilled = false
    @State private var showModal = false
    @State private var isVdohExpanded = false
    @State private var isVdgrExpanded = false
    @State private var isVdcrExpanded = false
    @State private var selection = 0
    @State private var showToast = false
    var body: some View {
        // 1
        TabView(selection: $selectedTab) { // 2
            ZStack {
                Color.white // Set the background color of the screen
                VStack(spacing: 10) {
                    Text(event.name)
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .padding(.top, 50) // Adjust the top padding to your liking
                    
                    HStack {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Date").bold().aspectRatio(contentMode: .fit)
                            Text(event.date ?? "?"+" " + (event.time ?? "")).foregroundColor(Color.gray).multilineTextAlignment(.leading).aspectRatio(contentMode: .fit)
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 10) {
                            Text("Artist/Team").bold().padding(.top, 5)
                            Text(event.artistName).foregroundColor(Color.gray)
                        }
                    }
                    HStack {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Venue").bold().aspectRatio(contentMode: .fit)
                            Text((event.venue ?? "lol").replacingOccurrences(of: "|", with: "")).foregroundColor(Color.gray)
                        }
                        Spacer()
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Genres").bold().padding(.top, 5)
                            Text(event.genre).foregroundColor(Color.gray).multilineTextAlignment(.trailing)
                        }
                    }
                    
                    
                    HStack {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Price Ranges").bold().padding(.top, 5)
                            Text("\(event.pMin)-\(event.pMax) \(event.currency)").foregroundColor(Color.gray).multilineTextAlignment(.leading)
                        }
                        Spacer()
                        VStack(alignment: .center, spacing: 10) {
                            Group {
                                Text("Ticket Status").bold()
                                if (event.ticketStatus == "onsale") {
                                    Text("On Sale").padding(3).background(.green).cornerRadius(8).foregroundColor(.black)
                                } else if (event.ticketStatus == "offsale") {
                                    Text("Off Sale").padding(3).background(.red).cornerRadius(8).foregroundColor(.white)
                                } else {
                                    Text("Rescheduled").padding(3).background(.yellow).cornerRadius(8).foregroundColor(.black)
                                }
                            }.padding(.top, 8)
                        }
                    }
                    //shared on button
                    Button(action: {
                        isFilled = getFavorite.addFavorite(event: event)
                        showToast = true;
                    }) {
                        Text(isFilled ? "Remove Favorites" : "Save Event")
                            .foregroundColor(.white)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(isFilled ? Color.red : Color.blue)
                    }.frame(width: 150, height: 50)
                    //show img
                    
                    AsyncImage(url: URL(string: event.seatmap)) { image in
                        image.resizable().frame(width: 250, height: 200)
                    } placeholder: {
                        ProgressView()
                    }
                    
                    
                    HStack {
                        Text("Buy TicketAt:").bold().aspectRatio(contentMode: .fit).multilineTextAlignment(.leading).padding(.top, 5)
                        //Link("Ticketmaster", destination: URL(string: event.url)!)
                        Text(.init("[Ticketmaster](\(event.buyTicketURL))")).foregroundColor(Color.gray).aspectRatio(contentMode: .fit).multilineTextAlignment(.trailing)
                    }
                    
                    
                    
                    //favorites heart button
                    HStack {
                        Text("Share on:").bold()
                        Button(action: {
                            // Open Twitter app or website to share the message
                            let fbUrl = "https://www.facebook.com/sharer/sharer.php?u=\(event.buyTicketURL)"
                            //let twitterUrl = "https://twitter.com/intent/tweet?text=\(tweetText)&url=\(tweetUrl)"
                            guard let url = URL(string: fbUrl) else { return }
                            UIApplication.shared.open(url)
                        }){
                            Image("fb-icon")
                                .resizable()
                                .frame(width: 50, height: 50)
                                .padding(.bottom, 20)
                        }
                        Button(action: {
                            // Open Twitter app or website to share the message
                            var twitterUrl = "https://twitter.com/intent/tweet?url=Check%20\(event.name) %20on%20Ticketmaster%20.\(event.buyTicketURL)"
                            twitterUrl = twitterUrl.replacingOccurrences(of: " ", with: "%20")
                            //let twitterUrl = "https://twitter.com/intent/tweet?text=\(tweetText)&url=\(tweetUrl)"
                            guard let url = URL(string: twitterUrl) else { return }
                            UIApplication.shared.open(url)
                        }) {
                            Image("twitter-icon")
                                .resizable()
                                .frame(width: 50, height: 50)
                                .padding(.bottom, 20)
                        }
                    }
                    
                    //colliquium
                }.scaledToFit().task(lol)
            }.tag(0)
            // 3
                .tabItem {
                    Image(systemName: "text.bubble.fill")
                        .resizable()
                    Text("Events")
                }
            
            //spotify artists
            VStack {
                ScrollView {
                    if spotifyArtists?.count ?? -1 > 0 {
                        HStack {
                            ForEach(spotifyArtists!.indices, id: \.self) { index in
                                CarouselItemView(artist: spotifyArtists![index])
                                
                                
                                
                                
                            }
                        }
                    }
                }
            }
            .tabItem {
                Image(systemName: "guitars.fill")
                    .resizable()
                Text("Artists/Team")
            }.tag(1)
            
            
            VStack {
                Text(event.name).bold()
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .padding(.top, 50) // Adjust the top padding to your liking
                VStack {
                    VStack(spacing: 10) {
                        Text("Name").bold().aspectRatio(contentMode: .fit)
                        Text(venueDetail?.vname ?? "lol").foregroundColor(Color.gray).multilineTextAlignment(.leading).aspectRatio(contentMode: .fit)
                        Text("Address").bold().padding(.top, 5)
                        Text(venueDetail?.vdaddr ?? "lol").foregroundColor(Color.gray).multilineTextAlignment(.leading).aspectRatio(contentMode: .fit)
                        if ((venueDetail?.vdphone) != nil) {
                            Text("Phone Number").bold().padding(.top, 5)
                            Text(venueDetail?.vdphone ?? "lol").foregroundColor(Color.gray).aspectRatio(contentMode: .fit).multilineTextAlignment(.leading)
                        }
                        
                    }
                    VStack {
                        if ((venueDetail?.vdoh) != nil && (venueDetail?.vdoh) != "") {
                            
                            VStack(alignment: .center) {
                                Text("Open Hours").bold().padding(.top, 5)
                                ScrollView {
                                    Text(venueDetail!.vdoh).foregroundColor(Color.gray)
                                    .lineLimit(3)
                                }
                            }
                            .padding()
                        }
                        if ((venueDetail?.vdgr) != nil && (venueDetail?.vdgr) != ""){
                            VStack {
                                Text("General Rule").bold().padding(.top, 5)
                                ScrollView {
                                    Text(venueDetail!.vdgr).foregroundColor(Color.gray)
                                    .lineLimit(3)
                                }
                            }
                        }
                        if ((venueDetail?.vdcr) != nil && (venueDetail?.vdcr) != "") {
                            VStack {
                                Text("Child Rule").bold().padding(.top, 5)
                                ScrollView {
                                    Text(venueDetail!.vdcr).foregroundColor(Color.gray)
                                    .lineLimit(3)
                                }
                            }
                        }
                    }
                }
                Spacer().frame(height: 10)
                Button("Show venue on Google Maps") {
                    showModal = true
                }.foregroundColor(.white)
                    .padding(.vertical, 10)
                    .padding(.horizontal, 20)
                    .background(Color.red)
                    .cornerRadius(10)
                
            }.sheet(isPresented: $showModal) {
                ModalView()
            }
            .tabItem {
                Image(systemName: "location.fill")
                    .resizable()
                //            Image("ascending-airplane")
                Text("Venue")
            }.tag(2)
        }.overlay(
            Group {
                if showToast {
                    ZStack(alignment: .bottom) {
                        Color.black.opacity(0)
        //                    .ignoresSafeArea()
        //                VStack {
                            Text(isFilled ? "Added to favorites": "Remove from favorites")
                                .foregroundColor(.black)
                                .padding()
                                .background(Color.gray)
                                .cornerRadius(10)
                                .alignmentGuide(.bottom) { d in d[.bottom] + 50 }
        //                }
        //                .padding()
                    }
                    .animation(.easeOut)
                    .onAppear {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                            showToast = false
                        }
                    }
                }
            }, alignment: .top)
        
    }
    
    func lol() async {
        //        print("=== enter  \(event.name) ===")
        let key = event.name+event.date
        addFavorites.chooseEvent = event
        if addFavorites.isAdded.contains(where: { $0.key == key }) {
            isFilled = addFavorites.isAdded[key]!
        } else {
            isFilled = false
        }
        do {
            venueDetail = try await getVenue.goSearch(eve: event)
        } catch {
            print("Error searching Spotify for artists: \(error)")
        }
        do {
            spotifyArtists = try await getSpotify.goSearch(eve: event)
        } catch {
            print("Error searching Spotify for artists: \(error)")
        }
    }
    func shareFacebookEvent() {
        guard let url = URL(string: "https://www.facebook.com/events/1234567890") else {
            return
        }
        
        let activityViewController = UIActivityViewController(activityItems: [url], applicationActivities: nil)
        UIApplication.shared.windows.first?.rootViewController?.present(activityViewController, animated: true, completion: nil)
    }
}

