//
//  ipInfo.swift
//  HW9UI
//
//  Created by Chin Lung on 2/1/23.
//

import Foundation
// MARK: - ipInfo
struct ipInfo: Codable {
    let ip, hostname, city, region: String
    let country, loc, org, postal: String
    let timezone: String
    let readme: String
}
