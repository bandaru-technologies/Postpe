import Foundation

struct User: Codable, Identifiable {
    let id: String
    let name: String
    let email: String
    let phone: String?
    let avatarUrl: String?
    let verified: Bool
    let role: String
    let createdAt: String
    let postCount: Int?

    enum CodingKeys: String, CodingKey {
        case id, name, email, phone, avatarUrl, verified, role, createdAt, postCount
    }
}
