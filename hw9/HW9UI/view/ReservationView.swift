//
//  ReservationView.swift
//  HW9UI
//
//  Created by Chin Lung on 3/17/23.
//

import SwiftUI

struct ReservationView: View {
    var body: some View {
        Text("Favorites")
            .font(.largeTitle)
            .fontWeight(.bold)
            .padding(.leading, 16)
            .padding(.bottom, 0)
//        Text("Favorites").font(.system(size: 24, weight: .bold))
//            .frame(alignment: .leading)
//            .padding()
        VStack {
            
            List{
                ForEach(addFavorites.favoriteTable, id: \.name) { eve in
                    HStack {
                        Text((eve.date )).aspectRatio(contentMode: .fit)
                        Text(eve.name).aspectRatio(contentMode: .fit)
                        Text(eve.genre).aspectRatio(contentMode: .fit)
                        //that is weird here we should debug for it ... maybe json obj error
                        Text((eve.venue) ).aspectRatio(contentMode: .fit)
//                        Spacer()
//                        Button(action: {
//                            if let index = addFavorites.favoriteTable.firstIndex(of: eve) {
//                                addFavorites.favoriteTable.remove(at: index)
//                            }
//                        }) {
////                            Image(systemName: "trash")
//                        }
                    }
                }.onDelete(perform: deleteFavorites)
            }
        }
    }
    func deleteFavorites(at offsets: IndexSet) {
        offsets.forEach { (i) in
            let key = addFavorites.favoriteTable[i].name+addFavorites.favoriteTable[i].date
            addFavorites.isAdded[key] = false
        }
        addFavorites.favoriteTable.remove(atOffsets: offsets)
        
//        print("-------- after delete we have ------")
//        for event in addFavorites.favoriteTable {
//            // Do something with each event
//            print(event.name)
//        }
    }
}
    
struct ReservationView_Previews: PreviewProvider {
    static var previews: some View {
        ReservationView()
    }
}
