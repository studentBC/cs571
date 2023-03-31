//
//  googleLoc.swift
//  HW9UI
//
//  Created by Chin Lung on 3/20/23.
//

import Foundation
struct googleLoc: Codable, Identifiable {
    let id = UUID()
    let lat, lng: Double
}

