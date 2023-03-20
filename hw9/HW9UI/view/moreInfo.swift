//
//  moreInfo.swift
//  HW9UI
//
//  Created by Chin Lung on 1/31/23.
//

import SwiftUI
import UIKit
import MapKit
//import GoogleMaps
//struct moreInfoPreviews: PreviewProvider {
//    static var previews: some View {
//        moreInfo(event: <#T##Event#>)
//    }
//}
//struct MapViewControllerBridge: UIViewControllerRepresentable {
//
//    func makeUIViewController(context: Context) -> MapViewController {
//        return MapViewController()
//    }
//
//    func updateUIViewController(_ uiViewController: MapViewController, context: Context) {
//    }
//}
////for Google map modal view
struct ModalView: View {
    var body: some View {
        Text("This is a modal view")
            .font(.title)
            .padding()
        //        GeometryReader { geometry in
        //          ZStack(alignment: .top) {
        //            // Map
        //            MapViewControllerBridge()
        //
        //            // Cities List
        //            CitiesList(markers: $markers) { (marker) in
        //              guard self.selectedMarker != marker else { return }
        //              self.selectedMarker = marker
        //              self.zoomInCenter = false
        //              self.expandList = false
        //            }  handleAction: {
        //              self.expandList.toggle()
        //            } // ...
        //          }
        //        }
    }
}

struct CarouselItemView: View {
    let artist: spotifyArtist
    var body: some View {
        VStack {
            Text(artist.name)
            AsyncImage(url: URL(string: artist.asICON),
                       content: {
                image in image.resizable().aspectRatio(contentMode: .fit)
            },placeholder: {
                ProgressView()
            }).frame(width: 80, height: 80)
                .clipShape(Circle())
            //                .overlay(Circle().stroke(Color.white, lineWidth: 2))
            //                .shadow(radius: 3)
            Text("Popularity")
            Text(String(artist.aspop))
            Text("Followers")
            Text(String(artist.astotal))
            Text("Spotify Link")
            Button(action: {
                guard let url = URL(string: artist.asurl) else { return }
                UIApplication.shared.open(url)
            }){
                Image("spotify-icon")
                    .resizable()
                    .frame(width: 50, height: 50)
                    .padding(.bottom, 20)
            }
            
            Text("Album featuring Grouplove")
            if !artist.album0.isEmpty {
                AsyncImage(url: URL(string: artist.album0),
                           content: {
                    image in image.resizable().aspectRatio(contentMode: .fit)
                }, placeholder: {
                    ProgressView()
                })
            }
            //            if !artist.album1.isEmpty {
            //                AsyncImage(url: URL(string: artist.album1),
            //                           content: {
            //                    image in image.resizable().aspectRatio(contentMode: .fit)
            //                }, placeholder: {
            //                    ProgressView()
            //                })
            //            }
            //            if !artist.album2.isEmpty {
            //                AsyncImage(url: URL(string: artist.album2),
            //                           content: {
            //                    image in image.resizable().aspectRatio(contentMode: .fit)
            //                }, placeholder: {
            //                    ProgressView()
            //                })
            //            }
        }.frame(maxWidth: .infinity)
        //        .frame(width: 150)
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
    var body: some View {
        // 1
        TabView(selection: $selectedTab) { // 2
            ZStack {
                Color.white // Set the background color of the screen
                VStack {
                    Text((event.venue ?? "lol"))
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .padding(.top, 50) // Adjust the top padding to your liking
                    
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Date").aspectRatio(contentMode: .fit)
                            Text(event.date ?? "?"+" " + (event.time ?? "")).multilineTextAlignment(.leading).aspectRatio(contentMode: .fit)
                            Text("Artist/Team").padding(.top, 5)
                            //we need to change venue json obj to get the link ...
                            //Text("[\(event.embedded.attractions[0]?.name)](\())")
                            Text("Genres").padding(.top, 5)
                            Text(event.genre).aspectRatio(contentMode: .fit).multilineTextAlignment(.leading)
                            Text("Price Ranges").padding(.top, 5)
                            Text("\(event.pMin)-\(event.pMax) \(event.currency)").aspectRatio(contentMode: .fit).multilineTextAlignment(.leading)
                            Group {
                                Text("Ticket Status")
                                if (event.ticketStatus == "onsale") {
                                    Text("On Sale").padding(3).background(.green).cornerRadius(8).foregroundColor(.black)
                                } else if (event.ticketStatus == "offsale") {
                                    Text("Off Sale").padding(3).background(.red).cornerRadius(8).foregroundColor(.white)
                                } else {
                                    Text("Rescheduled").padding(3).background(.yellow).cornerRadius(8).foregroundColor(.black)
                                }
                            }.padding(.top, 8)
                            Text("Buy TicketAt:").aspectRatio(contentMode: .fit).multilineTextAlignment(.leading).padding(.top, 5)
                            //Link("Ticketmaster", destination: URL(string: event.url)!)
                            Text(.init("[Ticketmaster](\(event.buyTicketURL))")).aspectRatio(contentMode: .fit).multilineTextAlignment(.leading)
                            
                            
                            //                    Text("Ticketmaster").onTapGesture {
                            //                        UIApplication.shared.open(URL(string: event.url)!)
                            //                    }
                        }
                        //                    AsyncImage(url: URL(string: event.seatmap ?? ""),
                        //                               content: {
                        //                        image in image.resizable().aspectRatio(contentMode: .fit)
                        //                    },
                        //                               placeholder: {
                        //                        ProgressView()
                        //                    }).frame(width: 200)
                    }
                    //favorites heart button
                    HStack {
                        Text("Share on:")
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
                    //shared on button
                    let key = event.name+event.date
                    Button(action: {
                        isFilled = getFavorite.addFavorite(event: event)
                    }) {
                        Image(systemName: isFilled ? "heart.fill" : "heart")
                            .foregroundColor(isFilled ? .red : .gray).font(.system(size: 50))
                    }
                    //colliquium
                }.scaledToFit().task(lol)
            }.tag(0)
            // 3
                .tabItem {
                    //            Image("descending-airplane")
                    //              .resizable()
                    Text("Event Details")
                }
            
            //spotify artists
            ZStack {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 20) {
                        if spotifyArtists?.count ?? -1 > 0 {
                            ForEach(spotifyArtists!.indices, id: \.self) { index in
                                CarouselItemView(artist: spotifyArtists![index])
                            }
                            //                            ForEach(spotifyArtists, id: \.id) { artist in
                            //                                CarouselItemView(artist: artist)
                            //                            }
                        }
                    }
                    .padding()
                }
                
            }
            .tabItem {
                //            Image(systemName: "airplane")
                //              .resizable()
                Text("Artists/Team")
            }.tag(1)
            VStack {
                HStack {
                    VStack {
                        Text("Name").aspectRatio(contentMode: .fit)
                        Text(venueDetail?.vname ?? "lol").multilineTextAlignment(.leading).aspectRatio(contentMode: .fit)
                        Text("Address").padding(.top, 5)
                        Text(venueDetail?.vdaddr ?? "lol").multilineTextAlignment(.leading).aspectRatio(contentMode: .fit)
                        if ((venueDetail?.vdphone) != nil) {
                            Text("Phone Number").padding(.top, 5)
                            Text(venueDetail?.vdphone ?? "lol").aspectRatio(contentMode: .fit).multilineTextAlignment(.leading)
                        }
                        
                    }
                    VStack {
                        if ((venueDetail?.vdoh) != nil) {
                            
                            VStack(alignment: .leading) {
                                Text("Open Hours").padding(.top, 5)
                                if isVdohExpanded {
                                    Text(venueDetail!.vdoh).padding(.top, 5).font(.subheadline)
                                } else {
                                    Text(venueDetail!.vdoh).padding(.top, 5)
                                        .font(.subheadline)
                                        .lineLimit(3)
                                }
                                Button(action: {
                                    isVdohExpanded.toggle()
                                }) {
                                    if isVdohExpanded {
                                        Text("Read less")
                                    } else {
                                        Text("Read more")
                                    }
                                }
                            }
                            .padding()
                        }
                        if ((venueDetail?.vdgr) != nil){
                            VStack {
                                Text("General Rule").padding(.top, 5)
                                if isVdgrExpanded {
                                    Text(venueDetail!.vdgr).padding(.top, 5).font(.subheadline)
                                } else {
                                    Text(venueDetail!.vdgr).padding(.top, 5)
                                        .font(.subheadline)
                                        .lineLimit(3)
                                }
                                Button(action: {
                                    isVdgrExpanded.toggle()
                                }) {
                                    if isVdgrExpanded {
                                        Text("Read less")
                                    } else {
                                        Text("Read more")
                                    }
                                }
                            }
                        }
                        if ((venueDetail?.vdcr) != nil) {
                            VStack {
                                Text("Child Rule").padding(.top, 5)
                                if isVdcrExpanded {
                                    Text(venueDetail!.vdcr).font(.subheadline).padding(.top, 5)
                                } else {
                                    Text(venueDetail!.vdcr).padding(.top, 5)
                                        .font(.subheadline)
                                        .lineLimit(3)
                                }
                                Button(action: {
                                    isVdcrExpanded.toggle()
                                }) {
                                    if isVdcrExpanded {
                                        Text("Read less")
                                    } else {
                                        Text("Read more")
                                    }
                                }
                            }
                        }
                    }
                }
                Button("Show Map") {
                    showModal = true
                }
                
            }.sheet(isPresented: $showModal) {
                ModalView()
            }
            .tabItem {
                //            Image("ascending-airplane")
                Text("Venue")
            }.tag(2)
        }
    }
    
    func lol() async {
        //        print("=== enter  \(event.name) ===")
        let key = event.name+event.date
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

