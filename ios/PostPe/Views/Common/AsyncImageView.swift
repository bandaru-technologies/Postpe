import SwiftUI

struct AsyncImageView: View {
    let url: String?
    var contentMode: ContentMode = .fill
    var placeholder: String = "photo"

    var body: some View {
        Group {
            if let urlStr = url, let imageUrl = URL(string: urlStr) {
                AsyncImage(url: imageUrl) { phase in
                    switch phase {
                    case .success(let image):
                        image.resizable().aspectRatio(contentMode: contentMode)
                    case .failure:
                        placeholderView
                    case .empty:
                        ProgressView().tint(Theme.accent)
                    @unknown default:
                        placeholderView
                    }
                }
            } else {
                placeholderView
            }
        }
    }

    private var placeholderView: some View {
        ZStack {
            Theme.cardBackground
            Image(systemName: placeholder)
                .font(.largeTitle)
                .foregroundColor(Theme.textSecondary)
        }
    }
}
