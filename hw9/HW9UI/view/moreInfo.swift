//
//  moreInfo.swift
//  HW9UI
//
//  Created by Chin Lung on 1/31/23.
//

import SwiftUI
//struct moreInfoPreviews: PreviewProvider {
//    static var previews: some View {
//        moreInfo(event: <#T##Event#>)
//    }
//}

struct moreInfo: View {
    let event : Event
    //    @ObservedObject private var getVenue = apiSearchVenue()
    @State private var getVenue = apiSearchVenue()
    @State private var getSpotify = apiSearchSpotify()
    @State private var selectedTab = 0
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
                            let twitterUrl = "https://twitter.com/intent/tweet?url=Check%20P!NK:%20Summer%20Carnival%202023%20on%20Ticketmaster%20.https://www.ticketmaster.com/pnk-summer-carnival-2023-inglewood-california-10-05-2023/event/0A005D68C2D2346F"
                            //let twitterUrl = "https://twitter.com/intent/tweet?text=\(tweetText)&url=\(tweetUrl)"
                            guard let url = URL(string: twitterUrl) else { return }
                            UIApplication.shared.open(url)
                        }){
                            Image("fb-icon")
                                .resizable()
                                .frame(width: 50, height: 50)
                                .padding(.bottom, 20)
                        }
                        Button(action: {
                            // Open Twitter app or website to share the message
                            let twitterUrl = "https://twitter.com/intent/tweet?url=Check%20P!NK:%20Summer%20Carnival%202023%20on%20Ticketmaster%20.https://www.ticketmaster.com/pnk-summer-carnival-2023-inglewood-california-10-05-2023/event/0A005D68C2D2346F"
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
                Text(getSpotify.spotifyArtists?[0].asid ?? "lol")
                Text(String( getSpotify.spotifyArtists?[0].aspop ?? 0))
                Text(getSpotify.spotifyArtists?[0].asurl ?? "lol")
                Text(String( getSpotify.spotifyArtists?[0].astotal ?? 0))
                Text(getSpotify.spotifyArtists?[0].asICON ?? "lol")
                Text(getSpotify.spotifyArtists?[0].album0 ?? "lol")
                Text(getSpotify.spotifyArtists?[0].album1 ?? "lol")
                Text(getSpotify.spotifyArtists?[0].album2 ?? "lol")
                
            }
            .tabItem {
                //            Image(systemName: "airplane")
                //              .resizable()
                Text("Artists/Team")
            }.tag(1)
            ZStack {
                HStack {
                    VStack {
                        Text("Name").aspectRatio(contentMode: .fit)
                        Text(getVenue.venueDetail?.vname ?? "lol").multilineTextAlignment(.leading).aspectRatio(contentMode: .fit)
                        Text("Address").padding(.top, 5)
                        Text(getVenue.venueDetail?.vdaddr ?? "lol").multilineTextAlignment(.leading).aspectRatio(contentMode: .fit)
                        if ((getVenue.venueDetail?.vdphone) != nil) {
                            Text("Phone Number").padding(.top, 5)
                            Text(getVenue.venueDetail?.vdphone ?? "lol").aspectRatio(contentMode: .fit).multilineTextAlignment(.leading)
                        }
                        
                    }
                    VStack {
                        if ((getVenue.venueDetail?.vdoh) != nil) {
                            Text("Open Hours").padding(.top, 5)
                            Text(getVenue.venueDetail!.vdoh).aspectRatio(contentMode: .fit).multilineTextAlignment(.leading)
                        }
                        if ((getVenue.venueDetail?.vdgr) != nil){
                            Text("General Rule").padding(.top, 5)
                            Text(getVenue.venueDetail?.vdgr ?? "lol").aspectRatio(contentMode: .fit).multilineTextAlignment(.leading)
                        }
                        if ((getVenue.venueDetail?.vdcr) != nil) {
                            Text("Child Rule").padding(.top, 5)
                            Text(getVenue.venueDetail?.vdcr ?? "lol").aspectRatio(contentMode: .fit).multilineTextAlignment(.leading)
                        }
                        
                    }
                }
            }
            .tabItem {
                //            Image("ascending-airplane")
                Text("Venue")
            }.tag(2)
        }
    }
    func lol() async {
        print("=== enter  \(event.name) ===")
        await getVenue.goSearch(eve: event)
        await getSpotify.goSearch(eve: event)
        //print(getVenue.venueDetail?.name)
        print("------------------------")
    }
    func shareFacebookEvent() {
        guard let url = URL(string: "https://www.facebook.com/events/1234567890") else {
            return
        }
        
        let activityViewController = UIActivityViewController(activityItems: [url], applicationActivities: nil)
        UIApplication.shared.windows.first?.rootViewController?.present(activityViewController, animated: true, completion: nil)
    }
}

