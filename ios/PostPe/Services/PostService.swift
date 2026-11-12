import Foundation
import UIKit

final class PostService {
    static let shared = PostService()
    private let api = APIService.shared

    private init() {}

    func getPosts(filter: PostFilter = PostFilter()) async throws -> PagedResponse<Post> {
        return try await api.get("/posts", queryItems: filter.queryItems())
    }

    func getFeaturedPosts() async throws -> [Post] {
        return try await api.get("/posts/featured")
    }

    func getPost(id: String) async throws -> Post {
        return try await api.get("/posts/\(id)")
    }

    func createPost(_ request: CreatePostRequest) async throws -> Post {
        return try await api.post("/posts", body: request)
    }

    func updatePost(id: String, request: CreatePostRequest) async throws -> Post {
        return try await api.put("/posts/\(id)", body: request)
    }

    func deletePost(id: String) async throws {
        try await api.delete("/posts/\(id)")
    }

    func getMyPosts() async throws -> PagedResponse<Post> {
        return try await api.get("/posts/my-posts")
    }

    func toggleFavorite(postId: String) async throws -> FavoriteResponse {
        return try await api.postEmpty("/posts/\(postId)/favorite")
    }

    func getFavorites() async throws -> PagedResponse<Post> {
        return try await api.get("/posts/favorites")
    }

    func uploadImages(postId: String, images: [UIImage]) async throws -> [PostImage] {
        let imageData = images.compactMap { $0.jpegData(compressionQuality: 0.8) }
        return try await api.uploadMultipart("/posts/\(postId)/images", imageData: imageData)
    }

    func getCategories() async throws -> [Category] {
        return try await api.get("/categories")
    }
}
