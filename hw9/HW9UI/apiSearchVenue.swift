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
        print("enter to getEventResults")
        let urlString = "https://app.ticketmaster.com/discovery/v2/venues/\(vid).json?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ"
        
        
        var components = URLComponents()
        components.queryItems = [
            URLQueryItem(name: "url", value: urlString)
        ]
        print("component string is ")
        print(components.string)
        
        if let url = URL(string: "https://yukichat-ios13.wl.r.appspot.com/getVenuesDetails"+components.string!) {
            do {
                print("=== before decoding ===")
                print(url)
                let (data, response) = try await URLSession.shared.data(from: url)
                let eves = try JSONDecoder().decode(getVenueDetails.self, from: data)
                venueDetail = eves
            } catch {
                print("Checkout failed.")
            }
        }
    }
}
