//
//  addFavorites.swift
//  HW9UI
//
//  Created by Chin Lung on 3/17/23.
//

import Foundation

class addFavorites: ObservableObject {
    @Published var favoriteTable: [Event] = []

    init() {
        
    }
    func addFavorite(event: Event) {
        favoriteTable.append(event)
    }
    func removeFavorite(event: Event) {
        for (index, eve) in favoriteTable.enumerated() {
            if (eve.date == event.date && eve.time == event.time && eve.name == event.name) {
                favoriteTable.remove(at: index)
                break
            }
        }
    }

}
