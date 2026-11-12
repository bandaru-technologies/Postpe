import SwiftUI

struct PostCardView: View {
    let post: Post
    @State private var favorited: Bool
    @State private var favoriteLoading = false
    var onFavoriteToggle: ((Bool) -> Void)?

    init(post: Post, onFavoriteToggle: ((Bool) -> Void)? = nil) {
        self.post = post
        self._favorited = State(initialValue: post.isFavorited ?? false)
        self.onFavoriteToggle = onFavoriteToggle
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topTrailing) {
                AsyncImageView(url: fullImageUrl(post.mainImageUrl))
                    .frame(height: 160)
                    .clipped()

                Button {
                    Task { await toggleFavorite() }
                } label: {
                    Image(systemName: favorited ? "heart.fill" : "heart")
                        .foregroundColor(favorited ? .red : .white)
                        .padding(8)
                        .background(Color.black.opacity(0.4))
                        .clipShape(Circle())
                }
                .padding(8)
                .disabled(favoriteLoading)
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(post.category.name)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(Theme.accent)

                Text(post.title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .lineLimit(2)

                Text(post.formattedPrice)
                    .font(.headline)
                    .fontWeight(.bold)
                    .foregroundColor(Theme.accent)

                HStack {
                    if let city = post.city {
                        Label(city, systemImage: "mappin.circle")
                            .font(.caption)
                            .foregroundColor(Theme.textSecondary)
                    }
                    Spacer()
                    Text(post.createdAt.timeAgo())
                        .font(.caption)
                        .foregroundColor(Theme.textSecondary)
                }
            }
            .padding(12)
        }
        .cardStyle()
    }

    private func fullImageUrl(_ url: String?) -> String? {
        guard let url = url else { return nil }
        if url.starts(with: "http") { return url }
        return Constants.baseURL.replacingOccurrences(of: "/api", with: "") + url
    }

    private func toggleFavorite() async {
        favoriteLoading = true
        defer { favoriteLoading = false }
        do {
            let res = try await PostService.shared.toggleFavorite(postId: post.id)
            favorited = res.favorited
            onFavoriteToggle?(res.favorited)
        } catch {}
    }
}
