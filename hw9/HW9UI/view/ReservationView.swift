//
//  ReservationView.swift
//  HW9UI
//
//  Created by Chin Lung on 3/17/23.
//

import SwiftUI

struct ReservationView: View {
    @State private var noFavoritesFound = 0
    init() {
        // Call the go() function before view initialization
    }
    var body: some View {
//        Text("Favorites")
//            .font(.largeTitle)
//            .fontWeight(.bold)
//            .padding(.leading, 16)
//            .padding(.bottom, 0)
//        Text("Favorites").font(.system(size: 24, weight: .bold))
//            .frame(alignment: .leading)
//            .padding()
        VStack {
            if noFavoritesFound == 0 {
                Text("No favorites found").foregroundColor(Color.red)
            } else {
                List{
                    ForEach(addFavorites.favoriteTable, id: \.name) { eve in
                        HStack {
                            Text((eve.date ))//.aspectRatio(contentMode: .fit).minimumScaleFactor(0.5)
                            Text(eve.name).lineLimit(3)//.aspectRatio(contentMode: .fit).minimumScaleFactor(0.5)
                            Text(eve.genre).lineLimit(3)//.aspectRatio(contentMode: .fit).minimumScaleFactor(0.5)
                            //that is weird here we should debug for it ... maybe json obj error
                            Text(eve.venue.replacingOccurrences(of: "|", with: "")).lineLimit(3)
//.aspectRatio(contentMode: .fit).minimumScaleFactor(0.5)
                        }
                    }.onDelete(perform: deleteFavorites)
                }
            }
        }.navigationTitle("Favorites").onAppear{
//            print("hola hola")
            if let data = UserDefaults.standard.data(forKey: "favoriteTable") {
                addFavorites.favoriteTable = try! JSONDecoder().decode([Event].self, from: data)
            }
            noFavoritesFound = addFavorites.favoriteTable.count
            //noFavoritesFound = 1
        }
    }
    func deleteFavorites(at offsets: IndexSet) {
        offsets.forEach { (i) in
            let key = addFavorites.favoriteTable[i].name+addFavorites.favoriteTable[i].date
            addFavorites.isAdded[key] = false
        }
        addFavorites.favoriteTable.remove(atOffsets: offsets)
        noFavoritesFound = addFavorites.favoriteTable.count
        let encodedData = try? JSONEncoder().encode(addFavorites.favoriteTable)
        UserDefaults.standard.set(encodedData, forKey: "favoriteTable")
        let isAddedData = try? JSONEncoder().encode(addFavorites.isAdded)
        UserDefaults.standard.set(isAddedData, forKey: "isAdded")
    }
}
struct ReservationView_Previews: PreviewProvider {
    static var previews: some View {
        ReservationView()
    }
}
