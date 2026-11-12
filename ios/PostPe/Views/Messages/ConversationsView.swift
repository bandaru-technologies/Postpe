import SwiftUI

struct ConversationsView: View {
    @EnvironmentObject private var authVM: AuthViewModel
    @State private var conversations: [MessageModel] = []
    @State private var isLoading = false

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()

                if !authVM.isAuthenticated {
                    VStack(spacing: 16) {
                        Image(systemName: "message")
                            .font(.system(size: 60))
                            .foregroundColor(Theme.textSecondary)
                        Text("Sign in to view messages")
                            .foregroundColor(Theme.textSecondary)
                    }
                } else if isLoading {
                    ProgressView().tint(Theme.accent)
                } else if conversations.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "message")
                            .font(.system(size: 60))
                            .foregroundColor(Theme.textSecondary)
                        Text("No conversations yet")
                            .foregroundColor(Theme.textSecondary)
                        Text("Message sellers to start chatting")
                            .font(.caption)
                            .foregroundColor(Theme.textSecondary)
                    }
                } else {
                    List(conversations) { msg in
                        ConversationRow(message: msg, currentUserId: authVM.user?.id ?? "")
                            .listRowBackground(Theme.cardBackground)
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Messages")
        }
        .task {
            guard authVM.isAuthenticated else { return }
            isLoading = true
            conversations = (try? await APIService.shared.get("/messages")) ?? []
            isLoading = false
        }
    }
}

struct ConversationRow: View {
    let message: MessageModel
    let currentUserId: String

    var otherUser: User {
        message.sender.id == currentUserId ? message.receiver : message.sender
    }

    var body: some View {
        HStack(spacing: 12) {
            AsyncImageView(url: otherUser.avatarUrl)
                .frame(width: 48, height: 48)
                .clipShape(Circle())

            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(otherUser.name)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                    if otherUser.verified { VerifiedBadgeView() }
                    Spacer()
                    Text(message.createdAt.timeAgo())
                        .font(.caption2)
                        .foregroundColor(Theme.textSecondary)
                }
                if let post = message.post {
                    Text(post.title)
                        .font(.caption)
                        .foregroundColor(Theme.accent)
                        .lineLimit(1)
                }
                Text(message.content)
                    .font(.caption)
                    .foregroundColor(Theme.textSecondary)
                    .lineLimit(1)
            }
        }
        .padding(.vertical, 8)
    }
}
