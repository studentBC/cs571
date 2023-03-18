//
//  apiSearchVenue.swift
//  HW9UI
//
//  Created by Chin Lung on 1/31/23.
//

import Foundation

class apiSearchVenue: ObservableObject {
    init() {
        
    }
    func goSearch(eve: Event) async throws->getVenueDetails  {
        var venueDetail: getVenueDetails = getVenueDetails(vdaddr:"", vname:"", vdphone:"", vdoh:"", vdgr:"", vdcr:"");
        var vid = eve.venueID ?? "KovZpZAIF7aA"
//        print("----------------------")
//        print(vid)
        var eid = "&keyword=" + eve.venue;
        if eid.hasSuffix("|") {
            eid = String(eid.dropLast())
        }
        eid = eid.replacingOccurrences(of: " ", with: "%20")
        //eid+="&geoPoint="+
        let urlString = "https://app.ticketmaster.com/discovery/v2/venues?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ"+eid
        
        var components = URLComponents()
        components.queryItems = [
            URLQueryItem(name: "url", value: urlString)
        ]
//        print("component string is ")
//        print(components.string)
        //https://yukichat-ios13.wl.r.appspot.com
        if let url = URL(string: "http://localhost:8080/getVenuesDetails"+components.string!) {
            do {
//                print("=== before decoding ===")
//                print(url)
                let (data, response) = try await URLSession.shared.data(from: url)
                venueDetail = try JSONDecoder().decode(getVenueDetails.self, from: data)
//                print("------------- we got venueDetails ola  ----------")
//                print(venueDetail)
            } catch {
                print("Error decoding JSON in api Search Venue: \(error)")
            }
        }
        return venueDetail
    }
}
