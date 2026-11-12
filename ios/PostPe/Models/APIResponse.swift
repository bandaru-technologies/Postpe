import Foundation

struct PagedResponse<T: Codable>: Codable {
    let content: [T]
    let page: Int
    let size: Int
    let totalElements: Int
    let totalPages: Int
}

struct AuthResponse: Codable {
    let token: String
    let user: User
}

struct FavoriteResponse: Codable {
    let favorited: Bool
}

struct AvatarResponse: Codable {
    let avatarUrl: String
}

struct MessageTextResponse: Codable {
    let message: String
}

struct APIError: Error, LocalizedError {
    let message: String
    var errorDescription: String? { message }
}
