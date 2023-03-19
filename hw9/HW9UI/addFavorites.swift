//
//  addFavorites.swift
//  HW9UI
//
//  Created by Chin Lung on 3/17/23.
//

import Foundation

class addFavorites: ObservableObject {
    static var favoriteTable: [Event] = []
    static var isAdded: [String: Bool] = [:]
    init() {
        
    }
    //change isAdded and favoriteTable at the same time
    func addFavorite(event: Event)->Bool {
        let key = event.name+event.date
        if addFavorites.isAdded.contains(where: { $0.key == key }) {
            // "someKey" exists in the dictionary
            addFavorites.isAdded[key] = !addFavorites.isAdded[key]!
        } else {
            addFavorites.isAdded[key] = true
        }
        if addFavorites.isAdded[key]! {
            addFavorites.favoriteTable.append(event)
        } else {
            for (index, eve) in addFavorites.favoriteTable.enumerated() {
                if (eve.date == event.date && eve.time == event.time && eve.name == event.name) {
                    addFavorites.favoriteTable.remove(at: index)
                    break
                }
            }
        }
        print("now our table count is ", addFavorites.favoriteTable.count)
        for event in addFavorites.favoriteTable {
            // Do something with each event
            print(event.name)
        }
        return addFavorites.isAdded[key]!
    }

}
