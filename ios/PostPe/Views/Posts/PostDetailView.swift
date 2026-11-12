import SwiftUI

struct PostDetailView: View {
    let postId: String
    @StateObject private var vm = PostDetailViewModel()
    @EnvironmentObject private var authVM: AuthViewModel
    @State private var showMessageSheet = false
    @State private var selectedImageIndex = 0

    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()

            if vm.isLoading {
                LoadingView()
            } else if let post = vm.post {
                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {
                        imageGallery(post: post)

                        VStack(alignment: .leading, spacing: 20) {
                            postInfo(post: post)
                            sellerCard(post: post)
                            if !vm.relatedPosts.isEmpty { relatedSection }
                        }
                        .padding()
                    }
                }
                .overlay(alignment: .bottom) { bottomBar(post: post) }
            } else if let error = vm.error {
                ErrorView(message: error) {
                    Task { await vm.loadPost(id: postId) }
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                if let post = vm.post {
                    Button {
                        Task { await vm.toggleFavorite() }
                    } label: {
                        Image(systemName: vm.isFavorited ? "heart.fill" : "heart")
                            .foregroundColor(vm.isFavorited ? .red : .white)
                    }
                }
            }
        }
        .task { await vm.loadPost(id: postId) }
        .sheet(isPresented: $showMessageSheet) {
            if let post = vm.post {
                MessageSheetView(post: post)
            }
        }
    }

    @ViewBuilder
    private func imageGallery(post: Post) -> some View {
        if post.images.isEmpty {
            ZStack {
                Theme.cardBackground
                Image(systemName: "photo")
                    .font(.system(size: 60))
                    .foregroundColor(Theme.textSecondary)
            }
            .frame(height: 280)
        } else {
            TabView(selection: $selectedImageIndex) {
                ForEach(post.images.indices, id: \.self) { i in
                    AsyncImageView(url: fullUrl(post.images[i].url))
                        .tag(i)
                }
            }
            .frame(height: 280)
            .tabViewStyle(.page(indexDisplayMode: .automatic))
        }
    }

    @ViewBuilder
    private func postInfo(post: Post) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text(post.category.name)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(Theme.accent)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Theme.accent.opacity(0.1))
                    .cornerRadius(8)

                Text(post.postType)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Theme.secondaryAccent)
                    .cornerRadius(8)
                Spacer()
            }

            Text(post.title)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(.white)

            Text(post.formattedPrice)
                .font(.title)
                .fontWeight(.black)
                .foregroundColor(Theme.accent)

            HStack(spacing: 16) {
                if let city = post.city {
                    Label(city, systemImage: "mappin.circle.fill")
                        .font(.caption)
                        .foregroundColor(Theme.textSecondary)
                }
                Label("\(post.views) views", systemImage: "eye")
                    .font(.caption)
                    .foregroundColor(Theme.textSecondary)
                Spacer()
                Text(post.createdAt.timeAgo())
                    .font(.caption)
                    .foregroundColor(Theme.textSecondary)
            }

            if let desc = post.description, !desc.isEmpty {
                Divider().overlay(Theme.navyBorder)
                Text("Description")
                    .font(.headline)
                    .foregroundColor(.white)
                Text(desc)
                    .foregroundColor(Theme.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .padding()
        .cardStyle()
    }

    @ViewBuilder
    private func sellerCard(post: Post) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Seller")
                .font(.headline)
                .foregroundColor(.white)

            HStack(spacing: 12) {
                AsyncImageView(url: fullUrl(post.user.avatarUrl))
                    .frame(width: 52, height: 52)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(Theme.accent.opacity(0.3), lineWidth: 2))

                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(post.user.name)
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                        if post.user.verified {
                            VerifiedBadgeView()
                        }
                    }
                    Text("Member since \(post.user.createdAt.yearJoined())")
                        .font(.caption)
                        .foregroundColor(Theme.textSecondary)
                }
                Spacer()
            }
        }
        .padding()
        .cardStyle()
    }

    @ViewBuilder
    private var relatedSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Similar Listings")
                .font(.headline)
                .foregroundColor(.white)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(vm.relatedPosts) { post in
                        NavigationLink {
                            PostDetailView(postId: post.id)
                        } label: {
                            PostCardView(post: post)
                                .frame(width: 180)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private func bottomBar(post: Post) -> some View {
        HStack(spacing: 12) {
            Button {
                if authVM.isAuthenticated {
                    showMessageSheet = true
                }
            } label: {
                Label("Message Seller", systemImage: "message.fill")
                    .fontWeight(.semibold)
                    .frame(maxWidth: .infinity)
                    .frame(height: 50)
                    .background(Theme.accent)
                    .foregroundColor(Color(hex: "0f1535"))
                    .cornerRadius(14)
            }
        }
        .padding()
        .background(Theme.background.opacity(0.95))
    }

    private func fullUrl(_ url: String?) -> String? {
        guard let url = url else { return nil }
        if url.starts(with: "http") { return url }
        return Constants.baseURL.replacingOccurrences(of: "/api", with: "") + url
    }
}

struct MessageSheetView: View {
    let post: Post
    @State private var content = ""
    @State private var sending = false
    @Environment(\.dismiss) private var dismiss

    private let quickMessages = ["Is this still available?", "Can you lower the price?", "I am interested!", "Can I see it in person?"]

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                VStack(spacing: 16) {
                    HStack {
                        AsyncImageView(url: nil)
                            .frame(width: 48, height: 48)
                            .cornerRadius(8)
                        VStack(alignment: .leading) {
                            Text(post.title).font(.subheadline).fontWeight(.semibold).foregroundColor(.white)
                            Text(post.formattedPrice).font(.caption).foregroundColor(Theme.accent)
                        }
                        Spacer()
                    }
                    .padding()
                    .cardStyle()

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Quick Messages").font(.caption).foregroundColor(Theme.textSecondary)
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack {
                                ForEach(quickMessages, id: \.self) { msg in
                                    Button(msg) { content = msg }
                                        .font(.caption)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 6)
                                        .background(Theme.cardBackground)
                                        .foregroundColor(.white)
                                        .cornerRadius(20)
                                        .overlay(RoundedRectangle(cornerRadius: 20).stroke(Theme.navyBorder))
                                }
                            }
                        }
                    }

                    TextEditor(text: $content)
                        .frame(height: 120)
                        .padding(8)
                        .background(Theme.cardBackground)
                        .cornerRadius(12)
                        .foregroundColor(.white)
                        .tint(Theme.accent)

                    Spacer()
                }
                .padding()
            }
            .navigationTitle("Contact Seller")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                        .foregroundColor(Theme.accent)
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        Task {
                            sending = true
                            _ = try? await APIService.shared.post("/messages", body: SendMessageRequest(
                                receiverId: post.user.id,
                                postId: post.id,
                                content: content
                            ))
                            dismiss()
                        }
                    } label: {
                        if sending {
                            ProgressView().tint(Theme.accent)
                        } else {
                            Text("Send").fontWeight(.semibold).foregroundColor(Theme.accent)
                        }
                    }
                    .disabled(content.trimmingCharacters(in: .whitespaces).isEmpty || sending)
                }
            }
        }
    }
}
