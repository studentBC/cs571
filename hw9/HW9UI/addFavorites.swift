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
    static var chooseEvent: Event? = nil
    init() {
        
        if let data = UserDefaults.standard.data(forKey: "favoriteTable") {
            addFavorites.favoriteTable = try! JSONDecoder().decode([Event].self, from: data)
        } else {
            let encodedData = try? JSONEncoder().encode(Self.favoriteTable)
            UserDefaults.standard.set(encodedData, forKey: "favoriteTable")
        }
        if let isAddedData = UserDefaults.standard.object(forKey: "isAdded") as? Data {
            addFavorites.isAdded = try! JSONDecoder().decode([String: Bool].self, from: isAddedData)
        } else {
            let isAddedData = try? JSONEncoder().encode(addFavorites.isAdded)
            UserDefaults.standard.set(isAddedData, forKey: "isAdded")
        }
        if let data = UserDefaults.standard.data(forKey: "chooseEventData") {
            addFavorites.chooseEvent = try? JSONDecoder().decode(Event.self, from: data)
        } else {
            let encodeddata = try? JSONEncoder().encode(Self.chooseEvent)
            UserDefaults.standard.set(encodeddata, forKey: "chooseEventData")
        }
        
    }
    //change isAdded and favoriteTable at the same time
    func addFavorite(event: Event)->Bool {
        let key = event.name+event.date
        //        print("enter addFavorite")
        
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
        //        print("now our table count is ", addFavorites.favoriteTable.count)
        //        for event in addFavorites.favoriteTable {
        //            // Do something with each event
        //            print(event.name)
        //        }
        
        let encodedData = try? JSONEncoder().encode(Self.favoriteTable)
        UserDefaults.standard.set(encodedData, forKey: "favoriteTable")
        
        let isAddedData = try? JSONEncoder().encode(addFavorites.isAdded)
        UserDefaults.standard.set(isAddedData, forKey: "isAdded")
        
        let chooseEventData = try? JSONEncoder().encode(addFavorites.chooseEvent)
        UserDefaults.standard.set(chooseEventData, forKey: "chooseEvent")
        return addFavorites.isAdded[key]!
    }
    
}
