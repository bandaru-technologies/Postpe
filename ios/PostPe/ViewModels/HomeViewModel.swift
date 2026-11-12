import Foundation

@MainActor
final class HomeViewModel: ObservableObject {
    @Published var categories: [Category] = []
    @Published var featuredPosts: [Post] = []
    @Published var recentPosts: [Post] = []
    @Published var isLoading = false
    @Published var error: String?

    private let postService = PostService.shared

    func loadData() async {
        isLoading = true
        error = nil
        async let categoriesTask = postService.getCategories()
        async let featuredTask = postService.getFeaturedPosts()
        async let recentTask = postService.getPosts(filter: PostFilter())

        do {
            categories = try await categoriesTask
            featuredPosts = try await featuredTask
            recentPosts = (try await recentTask).content
        } catch let e as APIError {
            error = e.message
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }
}
