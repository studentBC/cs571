//
//  addFavorites.swift
//  HW9UI
//
//  Created by Chin Lung on 3/17/23.
//

import Foundation

class addFavorites: ObservableObject {
    @Published var favoriteTable: [Event] = []
    var isAdded: [String: Bool] = [:]
    init() {
        
    }
    //change isAdded and favoriteTable at the same time
    func addFavorite(event: Event)->Bool {
        let key = event.name+event.date
        if isAdded.contains(where: { $0.key == key }) {
            // "someKey" exists in the dictionary
            isAdded[key] = !isAdded[key]!
        } else {
            isAdded[key] = true
        }
        if isAdded[key]! {
            favoriteTable.append(event)
        } else {
            for (index, eve) in favoriteTable.enumerated() {
                if (eve.date == event.date && eve.time == event.time && eve.name == event.name) {
                    favoriteTable.remove(at: index)
                    break
                }
            }
        }
        print("now our table count is ", favoriteTable.count)
        return isAdded[key]!
    }

}
