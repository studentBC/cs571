//
//  apiSearchSpotify.swift
//  HW9UI
//
//  Created by Chin Lung on 3/17/23.
//

import Foundation
class apiSearchSpotify: ObservableObject {
    
    init() {
        
    }
    func goSearch(eve: Event) async throws -> [spotifyArtist]  {
        var spotifyArtists: [spotifyArtist] = []
        let artists: [String] = eve.artistName.components(separatedBy: ",")
        for name in artists {
            
            if (name.isEmpty) {
                continue;
            }
            var components = URLComponents()
            components.queryItems = [
                URLQueryItem(name: "artist", value: name)
            ]
//            print("component string is ")
//            print(components.string)
            
            
            if let url = URL(string: "http://localhost:8080/getMobileSpotifyArtist"+components.string!) {
                do {
//                    print("=== before spotify decoding ===")
//                    print(url)
                    let (data, response) = try await URLSession.shared.data(from: url)
                    let eves = try JSONDecoder().decode(spotifyArtist.self, from: data)
//                    print("####################")
//                    print(eves)
//                    print("####################")
                    spotifyArtists.append(eves)
                    
                } catch {
                    print("Error decoding JSON in spotify search api: \(error)")
                }
            }
        }
        return spotifyArtists
    }
}
