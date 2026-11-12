import Foundation

@MainActor
final class PostListViewModel: ObservableObject {
    @Published var posts: [Post] = []
    @Published var isLoading = false
    @Published var isLoadingMore = false
    @Published var hasMore = true
    @Published var error: String?
    @Published var filter = PostFilter()

    private let postService = PostService.shared
    private var totalPages = 1

    func loadPosts() async {
        isLoading = true
        error = nil
        filter.page = 0
        posts = []
        await fetchPage()
        isLoading = false
    }

    func loadMore() async {
        guard !isLoadingMore && hasMore else { return }
        isLoadingMore = true
        filter.page += 1
        await fetchPage()
        isLoadingMore = false
    }

    private func fetchPage() async {
        do {
            let res = try await postService.getPosts(filter: filter)
            if filter.page == 0 {
                posts = res.content
            } else {
                posts.append(contentsOf: res.content)
            }
            totalPages = res.totalPages
            hasMore = filter.page < totalPages - 1
        } catch let e as APIError {
            error = e.message
        } catch {
            self.error = error.localizedDescription
        }
    }

    func applyFilter(_ newFilter: PostFilter) async {
        filter = newFilter
        await loadPosts()
    }
}
