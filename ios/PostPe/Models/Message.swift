import Foundation

struct MessageModel: Codable, Identifiable {
    let id: String
    let sender: User
    let receiver: User
    let post: Post?
    let content: String
    let read: Bool
    let createdAt: String
}

struct SendMessageRequest: Codable {
    let receiverId: String
    let postId: String?
    let content: String
}
