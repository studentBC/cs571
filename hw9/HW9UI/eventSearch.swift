// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse the JSON, add this file to your project and do:
//
//   let welcome = try? JSONDecoder().decode(Welcome.self, from: jsonData)

import Foundation

// MARK: - Event
struct Event: Codable {
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
}
