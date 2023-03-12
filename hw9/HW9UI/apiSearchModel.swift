//
//  eventModel.swift
//  HW9UI
//
//  Created by Chin Lung on 1/29/23.
//

import Foundation
// check v38
class apiSearchModel: ObservableObject {
    @Published var searchResultTable: [Event] = []
    var venue: apiSearchVenue = apiSearchVenue()
    init() {
    
    }
    func googleAPI(Location: String)async -> String {
        let location = Location.replacingOccurrences(of: " ", with: "+")
        let gkey = "AIzaSyBdSh29p_B93XTLF7qB0XtnfnjxQudHCA8";
        var ans: String = ""
        let url = URL(string:"https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=" + gkey)
        do {
            let (data, response) = try await URLSession.shared.data(from: url!)
            let answer = try? JSONDecoder().decode(gGeo.self, from: data);
            //ans = answer!.region + " " + answer!.city
            ans = Geohash.encode(latitude: answer!.results[0].geometry.location.lat, longitude: answer!.results[0].geometry.location.lng, length: 5)
        } catch {
            print("error occur when we retrieve ipinfo")
        }
        return ans
    }
    func locateMyself() async -> String {

        print("enter to locateMyself")
        let urlString = "https://ipinfo.io"
        var ans: String = "Taipei"
        let url = URL(string:"https://ipinfo.io")
        do {
            let (data, response) = try await URLSession.shared.data(from: url!)
            let answer = try? JSONDecoder().decode(ipInfo.self, from: data);
            //ans = answer!.region + " " + answer!.city
            ans = answer!.loc
        } catch {
            print("error occur when we retrieve ipinfo")
        }
        return ans
    }
    func goSearch(suc: submitContent) async {
        print(suc.loc, suc.dist, suc.kw, suc.Category)
        var sid = ""
        var location=""
        var keyword: String = suc.kw
        if (suc.selfLocate) {
            print("enter here man !!!!!")
            let lol = await locateMyself()
            let components = lol.components(separatedBy: ",")
            let s = Geohash.encode(latitude: Double(components[0])!, longitude: Double(components[1])!, length: 5)
            location = s
//            let tmp = lol.replacingOccurrences(of: " ", with: "%20")
//            let temp = suc.kw.replacingOccurrences(of: " ", with: "%20")
//            keyword = temp+"%20"+tmp
        } else {
            //call google API get lat lng
            //use google geoapi to get lat lng
            location = await googleAPI(Location: suc.loc)
        }
        if (suc.Category == "Default") {
            sid = ""
        } else if (suc.Category == "Music") {
            sid = "KZFzniwnSyZfZ7v7nJ"
        } else if (suc.Category == "Sports") {
            sid = "KZFzniwnSyZfZ7v7nE"
        } else if (suc.Category == "Arts") {
            sid = "KZFzniwnSyZfZ7v7na"
        } else if (suc.Category == "Theatre") {
            sid = "KZFzniwnSyZfZ7v7na"
        } else if (suc.Category == "Film") {
            sid = "KZFzniwnSyZfZ7v7nn"
        } else {
            sid = "KZFzniwnSyZfZ7v7n1"
        }
        var dd = suc.dist
        if (dd == "") {
            dd = "10"
        }
        keyword = suc.kw.replacingOccurrences(of: " ", with: "%20")
        let urlString = "keyword=" + keyword + "&segmentId=" + sid + "&size=200&unit=miles&radius=" + dd + "&geoPoint="+location;
        print("enter to getEventResults")
        print(urlString)
        
        
        var components = URLComponents()
//        components.scheme = "http"
//        components.host = "localhost:3000"
//        components.path = "/getEvents"

        components.queryItems = [
            URLQueryItem(name: "url", value: urlString)
        ]

        // "https://advswift.com/home?topic=swift&page=urls"
        print("component string is ")
        print(components.string)
        
        if let url = URL(string: "https://yukichat-ios13.wl.r.appspot.com/getEvents"+components.string!) {
            do {
                print("=== before decoding ===")
                print(url)
                let (data, response) = try await URLSession.shared.data(from: url)
                //print(data)
                //print(response)
                var eves = try! JSONSerialization.jsonObject(with: data, options: []) as? [[String]]
                    // try to read out a string array
                print(eves)
                //let eves = try JSONSerialization.jsonObject(with: data, options: []) as! [[String]]
                //print("===== go gog man ====")
                //let eves = try JSONDecoder().decode(getevents.self, from: data)
                for(index, eve) in eves!.enumerated() {
                    DispatchQueue.main.async {
                        let temp = Event(name: eve[3], date: eve[0], time: eve[1], eventID: eve[6], genre: eve[4], imgUrl: eve[2], venue: eve[5], seatmap: eve[7], ticketStatus: eve[8], buyTicketURL: eve[9], pMin: eve[10], pMax: eve[11], currency: eve[12], venueID: eve[13])
                        self.searchResultTable.append((temp))
                    }
                }
            } catch {
                print("Checkout failed.")
            }
        }
    }
    func getVenue (venueId: String, completion: @escaping(VenueS?)->()) {
        guard let url = URL(string: "https://app.ticketmaster.com/discovery/v2/venues/\(venueId).json?apikey=uAFLpjEgT9FAAj213SNDEUVZKB9lw0WJ&id=KovZpZA7AAEA") else {
            completion(nil);
            return;
        }
        URLSession.shared.dataTask(with: url) {
            data, response, error in guard let data = data, error == nil else {
                completion(nil);
                return;
            }
            let venue = try? JSONDecoder().decode(VenueS.self, from: data);
            if let venue = venue {
                completion(venue);
            } else {
                completion(nil);
            }
        }.resume();
    }
}
