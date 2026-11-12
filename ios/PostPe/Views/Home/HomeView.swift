import SwiftUI

struct HomeView: View {
    @StateObject private var vm = HomeViewModel()
    @State private var searchText = ""
    @State private var selectedPost: Post?
    @State private var selectedCategory: Category?
    @State private var navigateToList = false

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 24) {
                        heroSection
                        categoriesSection
                        recentSection
                    }
                    .padding(.bottom, 24)
                }
            }
            .navigationDestination(for: Post.self) { post in
                PostDetailView(postId: post.id)
            }
            .navigationDestination(for: Category.self) { cat in
                PostListView(initialCategory: cat.slug)
            }
            .navigationDestination(isPresented: $navigateToList) {
                PostListView(initialSearch: searchText)
            }
        }
        .task { await vm.loadData() }
    }

    private var heroSection: some View {
        VStack(spacing: 16) {
            VStack(spacing: 8) {
                Text("Buy, Sell & Connect")
                    .font(.largeTitle)
                    .fontWeight(.black)
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                Text("India's trusted local marketplace")
                    .font(.subheadline)
                    .foregroundColor(Theme.textSecondary)
            }
            .padding(.top, 8)

            SearchBarView(text: $searchText) {
                navigateToList = true
            }
        }
        .padding(.horizontal)
        .padding(.top, 8)
    }

    private var categoriesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Browse Categories")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(.white)
                .padding(.horizontal)

            if vm.categories.isEmpty && vm.isLoading {
                ProgressView().tint(Theme.accent).frame(maxWidth: .infinity)
            } else {
                CategoryGridView(categories: vm.categories.isEmpty ? fallbackCategories : vm.categories) { cat in
                    selectedCategory = cat
                }
                .padding(.horizontal)
                .navigationDestination(item: $selectedCategory) { cat in
                    PostListView(initialCategory: cat.slug)
                }
            }
        }
    }

    private var recentSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Recent Listings")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                Spacer()
                NavigationLink("View All") {
                    PostListView()
                }
                .font(.subheadline)
                .foregroundColor(Theme.accent)
            }
            .padding(.horizontal)

            if vm.isLoading {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    ForEach(0..<6, id: \.self) { _ in
                        Rectangle()
                            .fill(Theme.cardBackground)
                            .frame(height: 220)
                            .cornerRadius(16)
                            .redacted(reason: .placeholder)
                    }
                }
                .padding(.horizontal)
            } else if vm.recentPosts.isEmpty {
                Text("No listings yet")
                    .foregroundColor(Theme.textSecondary)
                    .frame(maxWidth: .infinity)
                    .padding()
            } else {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    ForEach(vm.recentPosts) { post in
                        NavigationLink(value: post) {
                            PostCardView(post: post)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal)
            }
        }
    }

    private var fallbackCategories: [Category] {
        Constants.defaultCategories.enumerated().map { i, c in
            Category(id: i + 1, name: c.0, slug: c.2, iconName: c.1, displayOrder: i + 1)
        }
    }
}
