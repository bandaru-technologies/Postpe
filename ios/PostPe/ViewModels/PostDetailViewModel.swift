import Foundation

@MainActor
final class PostDetailViewModel: ObservableObject {
    @Published var post: Post?
    @Published var relatedPosts: [Post] = []
    @Published var isLoading = false
    @Published var isFavorited = false
    @Published var error: String?

    private let postService = PostService.shared

    func loadPost(id: String) async {
        isLoading = true
        do {
            let p = try await postService.getPost(id: id)
            post = p
            isFavorited = p.isFavorited ?? false

            var filter = PostFilter()
            filter.categorySlug = p.category.slug
            filter.size = 4
            let related = try await postService.getPosts(filter: filter)
            relatedPosts = related.content.filter { $0.id != id }
        } catch let e as APIError {
            error = e.message
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    func toggleFavorite() async {
        guard let post = post else { return }
        do {
            let res = try await postService.toggleFavorite(postId: post.id)
            isFavorited = res.favorited
        } catch {}
    }
}
