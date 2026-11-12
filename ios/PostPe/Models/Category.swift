import Foundation

struct Category: Codable, Identifiable {
    let id: Int
    let name: String
    let slug: String
    let iconName: String
    let displayOrder: Int
}
