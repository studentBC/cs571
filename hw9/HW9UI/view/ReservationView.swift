//
//  ReservationView.swift
//  HW9UI
//
//  Created by Chin Lung on 3/17/23.
//

import SwiftUI

struct ReservationView: View {
    var body: some View {
        VStack {
            Label("List of your favorite events", systemImage: "").foregroundColor(.blue)
                .frame(alignment: .top)
                .padding()
            List(addFavorites.favoriteTable, id: \.name) { eve in
                HStack {
                    Text((eve.date )).aspectRatio(contentMode: .fit)
                    Text(eve.name).aspectRatio(contentMode: .fit)
                    Text(eve.genre).aspectRatio(contentMode: .fit)
                    //that is weird here we should debug for it ... maybe json obj error
                    Text((eve.venue) ).aspectRatio(contentMode: .fit)
                }
            }
        }
    }
}

struct ReservationView_Previews: PreviewProvider {
    static var previews: some View {
        ReservationView()
    }
}
