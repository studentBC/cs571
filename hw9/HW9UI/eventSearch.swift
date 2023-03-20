// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse the JSON, add this file to your project and do:
//
//   let welcome = try? JSONDecoder().decode(Welcome.self, from: jsonData)

import Foundation

// MARK: - Event
struct Event: Codable, Equatable {
    let name: String
    let date: String
    let time: String
    let eventID: String
    let genre: String
    let imgUrl: String
    let venue: String
    let seatmap: String
    let ticketStatus: String
    let buyTicketURL: String
    let pMin: String
    let pMax: String
    let currency: String
    let venueID: String
    let artistName: String //split by ,
    static func ==(lhs: Event, rhs: Event) -> Bool {
        return lhs.name == rhs.name &&
               lhs.date == rhs.date &&
               lhs.genre == rhs.genre &&
               lhs.venue == rhs.venue
    }
}
