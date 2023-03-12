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
    
    var body: some View {
        VStack {
            Text((event.venue ?? "lol"))
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
                AsyncImage(url: URL(string: event.seatmap ?? ""),
                           content: {
                    image in image.resizable().aspectRatio(contentMode: .fit)
                },
                           placeholder: {
                    ProgressView()
                }).frame(width: 200)
            }
        }.scaledToFit().task(lol)
    }
    func lol() async {
        print("=== enter  \(event.name) ===")
        await getVenue.goSearch(eve: event)
        //print(getVenue.venueDetail?.name)
        print("------------------------")
    }
}

