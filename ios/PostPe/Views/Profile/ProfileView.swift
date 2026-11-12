import SwiftUI
import PhotosUI

struct ProfileView: View {
    @EnvironmentObject private var authVM: AuthViewModel
    @State private var selectedItem: PhotosPickerItem?
    @State private var tab: Tab = .posts
    @State private var showLogin = false
    @State private var myPosts: [Post] = []
    @State private var favorites: [Post] = []
    @State private var isLoading = false
    @State private var editing = false
    @State private var editName = ""

    enum Tab { case posts, favorites }

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()

                if !authVM.isAuthenticated {
                    notLoggedInView
                } else {
                    ScrollView {
                        VStack(spacing: 20) {
                            profileHeader
                            tabSelector
                            tabContent
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                if authVM.isAuthenticated {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Sign Out") { authVM.logout() }
                            .foregroundColor(.red)
                    }
                }
            }
        }
        .task {
            if authVM.isAuthenticated { await loadData() }
        }
        .onChange(of: selectedItem) { _, newItem in
            Task { await uploadAvatar(item: newItem) }
        }
    }

    private var notLoggedInView: some View {
        VStack(spacing: 20) {
            Image(systemName: "person.circle")
                .font(.system(size: 80))
                .foregroundColor(Theme.textSecondary)
            Text("Sign in to PostPe")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(.white)
            Text("Access your listings, favorites, and messages")
                .foregroundColor(Theme.textSecondary)
                .multilineTextAlignment(.center)
            NavigationLink {
                LoginView()
            } label: {
                Text("Sign In")
                    .fontWeight(.bold)
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(Theme.accent)
                    .foregroundColor(Color(hex: "0f1535"))
                    .cornerRadius(14)
            }
        }
        .padding(32)
    }

    @ViewBuilder
    private var profileHeader: some View {
        if let user = authVM.user {
            HStack(spacing: 16) {
                PhotosPicker(selection: $selectedItem, matching: .images) {
                    ZStack(alignment: .bottomTrailing) {
                        AsyncImageView(url: user.avatarUrl)
                            .frame(width: 80, height: 80)
                            .clipShape(Circle())
                            .overlay(Circle().stroke(Theme.accent.opacity(0.3), lineWidth: 2))

                        Image(systemName: "camera.fill")
                            .font(.caption)
                            .padding(6)
                            .background(Theme.accent)
                            .foregroundColor(Color(hex: "0f1535"))
                            .clipShape(Circle())
                    }
                }

                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(user.name)
                            .font(.title3)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        if user.verified { VerifiedBadgeView(showText: true) }
                    }
                    Text(user.email)
                        .font(.caption)
                        .foregroundColor(Theme.textSecondary)
                    if let phone = user.phone {
                        Text(phone)
                            .font(.caption)
                            .foregroundColor(Theme.textSecondary)
                    }
                }
                Spacer()
            }
            .padding()
            .cardStyle()
        }
    }

    private var tabSelector: some View {
        HStack(spacing: 8) {
            ForEach([(Tab.posts, "My Ads", "tag.fill"), (Tab.favorites, "Saved", "heart.fill")], id: \.0.hashValue) { t, label, icon in
                Button {
                    tab = t
                } label: {
                    Label(label, systemImage: icon)
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(tab == t ? Theme.cardBackground : Color.clear)
                        .foregroundColor(tab == t ? .white : Theme.textSecondary)
                        .cornerRadius(10)
                }
            }
        }
        .padding(4)
        .background(Color(hex: "1a2456"))
        .cornerRadius(14)
    }

    @ViewBuilder
    private var tabContent: some View {
        let displayPosts = tab == .posts ? myPosts : favorites
        if isLoading {
            ProgressView().tint(Theme.accent).frame(maxWidth: .infinity, minHeight: 100)
        } else if displayPosts.isEmpty {
            VStack(spacing: 12) {
                Image(systemName: tab == .posts ? "tag" : "heart")
                    .font(.system(size: 40))
                    .foregroundColor(Theme.textSecondary)
                Text(tab == .posts ? "No listings yet" : "No saved listings")
                    .foregroundColor(Theme.textSecondary)
            }
            .frame(maxWidth: .infinity, minHeight: 120)
        } else {
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ForEach(displayPosts) { post in
                    NavigationLink {
                        PostDetailView(postId: post.id)
                    } label: {
                        PostCardView(post: post)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private func loadData() async {
        isLoading = true
        async let p = PostService.shared.getMyPosts()
        async let f = PostService.shared.getFavorites()
        myPosts = (try? await p)?.content ?? []
        favorites = (try? await f)?.content ?? []
        isLoading = false
    }

    private func uploadAvatar(item: PhotosPickerItem?) async {
        guard let item, let data = try? await item.loadTransferable(type: Data.self) else { return }
        guard let uiImage = UIImage(data: data) else { return }
        _ = try? await PostService.shared.uploadImages(postId: "", images: [uiImage])
    }
}
