//
//  apiSearchVenue.swift
//  HW9UI
//
//  Created by Chin Lung on 1/31/23.
//

import Foundation

class apiSearchVenue: ObservableObject {
    @Published var venueDetail: getVenueDetails?
    init() {
        
    }
    func goSearch(eve: Event) async  {
        
        var vid = eve.venueID ?? "KovZpZAIF7aA"
        print("----------------------")
        print(vid)
        var eid = "&keyword=" + eve.venue;
        if eid.hasSuffix("|") {
            eid = String(eid.dropLast())
        }
        eid = eid.replacingOccurrences(of: " ", with: "%20")
        //eid+="&geoPoint="+
        print("enter to getEventResults")
        let urlString = "https://app.ticketmaster.com/discovery/v2/venues?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ"+eid
        print(urlString)
        
        var components = URLComponents()
        components.queryItems = [
            URLQueryItem(name: "url", value: urlString)
        ]
        print("component string is ")
        print(components.string)
        //https://yukichat-ios13.wl.r.appspot.com
        if let url = URL(string: "http://localhost:8080/getVenuesDetails"+components.string!) {
            do {
                print("=== before decoding ===")
                print(url)
                let (data, response) = try await URLSession.shared.data(from: url)
                let eves = try JSONDecoder().decode(getVenueDetails.self, from: data)
                venueDetail = eves
                print("------------- we got venueDetails ola  ----------")
                print(eves)
            } catch {
                print("Error decoding JSON in api Search Venue: \(error)")
            }
        }
    }
}
