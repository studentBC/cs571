//
//  moreInfo.swift
//  HW9UI
//
//  Created by Chin Lung on 1/31/23.
//

import SwiftUI
import UIKit
import MapKit
public var glat: Double = -33.86
public var glng: Double = 151.20

////for Google map modal view
struct ModalView: View {
    @State var loc: googleLoc?
    @State var coordinate = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 56.948889, longitude: 24.106389),
        span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1))
    var body: some View {
        VStack {
            Map(coordinateRegion: $coordinate, annotationItems: [loc].compactMap{$0}) { item in
                //MapMarker(coordinate: place.coordinate, tint: .green)
                MapMarker(coordinate: CLLocationCoordinate2D(latitude: item.lat, longitude: item.lng), tint: .red)
            }
        }.padding(10)
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
                coordinate = MKCoordinateRegion(
                    center: CLLocationCoordinate2D(latitude: loc.lat, longitude: loc.lng),
                    span: MKCoordinateSpan(latitudeDelta: 0.2, longitudeDelta: 0.2))
            } catch {
                print("Error searching venue: \(error)")
            }
        }
    }
}

struct CircularProgressView: View {
    var progress: Double
    var color: Color

    var body: some View {
//        var notchColor: Color =  Color.orange.opacity(0.5)
        let gradient = LinearGradient(
            gradient: Gradient(colors: [color, color]),
            startPoint: .topTrailing,
            endPoint: .bottomLeading
        )

        return ZStack {
            Circle()
                .stroke(Color.gray, lineWidth: 10)
                .frame(width: 60, height: 60)
            Circle()
                .trim(from: 0, to: CGFloat(progress))
                .stroke(gradient, lineWidth: 10)
                .rotationEffect(Angle(degrees: -90))
                .frame(width: 60, height: 60)
            Circle()
                .trim(from: 0, to: CGFloat(1.0))
                .stroke(Color.orange.opacity(0.6), lineWidth: 10)
                .rotationEffect(Angle(degrees: -90))
                .frame(width: 60, height: 60)
        }
    }
}
func convertToShortHand(_ numberString: String) -> String {
    guard let number = Double(numberString) else {
        return numberString // return the original string if it can't be converted to a number
    }
    
    let formatter = NumberFormatter()
    formatter.numberStyle = .decimal
    formatter.maximumFractionDigits = 1
    
    if number >= 1000000 {
        let millionNumber = Int(number / 1000000)
        return formatter.string(from: NSNumber(value: millionNumber))! + "M"
    } else {
        let kNumber = Int(number / 1000)
        return formatter.string(from: NSNumber(value: kNumber))! + "K"
    }
}

struct CarouselItemView: View {
    @State private var popular = 0.5
    let artist: spotifyArtist
    var body: some View {
        VStack(alignment: .leading) {
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
                .frame(width: 90, height: 90)
                Spacer()
                VStack(alignment: .leading) {
                    Text(artist.name).bold().foregroundColor(.white).lineLimit(1)
                    HStack {
                        Text(convertToShortHand(String(artist.astotal))).bold().foregroundColor(.white).lineLimit(1)
                        Text("Followers").foregroundColor(.white).font(.system(size: 12))
                    }
                    HStack {
                        Button(action: {
                            guard let url = URL(string: artist.asurl) else { return }
                            UIApplication.shared.open(url)
                        }){
                            Image("spotify-icon")
                                .resizable()
                                .frame(width: 30, height: 30)
//                                .padding(.bottom, 20)
                        }
                        Text("Spotify").font(.system(size: 14)).foregroundColor(.green)
                    }
                }
                Spacer()
                VStack {
                    Text("Popularity").bold().foregroundColor(.white)
//                    Text(String(artist.aspop)).foregroundColor(.white)
                    ZStack {
                        Text(String(artist.aspop))
                            .foregroundColor(.white)
                        CircularProgressView(progress: Double(artist.aspop)/100, color: .orange)
                    }
                }
            }
            Text("Popular Albums").bold().foregroundColor(.white)
            HStack {
                
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
        }.padding(10)
            .background(Color(red: 0.2, green: 0.2, blue: 0.2))
        .border(Color.gray, width: 1)
        .cornerRadius(10)
        .frame(width: 380)
        .padding(.top, 20)
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
                        .font(.system(size: 20))
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
                            Text("\(event.pMin)-\(event.pMax)").foregroundColor(Color.gray).multilineTextAlignment(.leading)
                        }
                        Spacer()
                        VStack(alignment: .center, spacing: 10) {
                            Group {
                                Text("Ticket Status").bold()
                                if (event.ticketStatus == "onsale") {
                                    Text("On Sale").foregroundColor(.white).padding(3).background(.green).cornerRadius(8).foregroundColor(.black)
                                } else if (event.ticketStatus == "offsale") {
                                    Text("Off Sale").foregroundColor(.white).padding(3).background(.red).cornerRadius(8).foregroundColor(.white)
                                } else {
                                    Text("Rescheduled").foregroundColor(.white).padding(3).background(.yellow).cornerRadius(8).foregroundColor(.black)
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
                            .cornerRadius(10)
                    }.frame(width: 150, height: 50).cornerRadius(10)
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
                            guard let url = URL(string: fbUrl) else { return }
                            UIApplication.shared.open(url)
                        }){
                            Image("fb-icon")
                                .resizable()
                                .frame(width: 35, height: 35)
                                .padding(.bottom, 20)
                        }
                        Button(action: {
                            // Open Twitter app or website to share the message
//                            var twitterUrl = "https://twitter.com/intent/tweet?url=Check%20\(event.name) %20on%20Ticketmaster%20.\(event.buyTicketURL)"
                            let words = event.name.replacingOccurrences(of: " ", with: "%20").replacingOccurrences(of:"÷", with: "%C3%B7")
                            
                            var twitterUrl = "https://twitter.com/intent/tweet?url=\(words)%20\(event.buyTicketURL)"
                            print("we got twitterUrl", twitterUrl)
//                            twitterUrl = "https://twitter.com/intent/tweet?url=Ed%20Sheeran:%20+-=%C3%B7x%20Tour%20https://www.ticketmaster.com/ed-sheeran-x-tour-inglewood-california-09-23-2023/event/0A005D3EAC76317F"
                            //twitterUrl = twitterUrl.replacingOccurrences(of: " ", with: "%20")
                            guard let url = URL(string: twitterUrl) else { return }
                            UIApplication.shared.open(url)
                        }) {
                            Image("twitter-icon")
                                .resizable()
                                .frame(width: 35, height: 35)
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
//                ScrollView {
                    if spotifyArtists?.count ?? -1 > 0 {
                        ScrollView {
                            ForEach(spotifyArtists!.indices, id: \.self) { index in
                                CarouselItemView(artist: spotifyArtists![index])
                            }
                        }
                    } else {
                        VStack {
                            Spacer()
                            Text("No music related artist details to show").font(.system(size: 30)).bold()
                            Spacer()
                        }
                    }
                }
//            }
            .tabItem {
                Image(systemName: "guitars.fill")
                    .resizable()
                Text("Artists | Team")
            }.tag(1)
            
            
            VStack {
                Text(event.name).bold()
                    .font(.system(size: 20))
                    .fontWeight(.bold)
                    .padding(.bottom, 50) // Adjust the top padding to your liking
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
                Button("Show venue on maps") {
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
                                .background(Color.gray).opacity(0.8)
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

