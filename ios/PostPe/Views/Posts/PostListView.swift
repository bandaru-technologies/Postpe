import SwiftUI

struct PostListView: View {
    var initialCategory: String = ""
    var initialSearch: String = ""

    @StateObject private var vm = PostListViewModel()
    @State private var showFilters = false

    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()

            VStack(spacing: 0) {
                SearchBarView(text: $vm.filter.search) {
                    Task { await vm.loadPosts() }
                }
                .padding()

                if vm.isLoading && vm.posts.isEmpty {
                    Spacer()
                    ProgressView().tint(Theme.accent)
                    Spacer()
                } else if vm.posts.isEmpty {
                    Spacer()
                    VStack(spacing: 16) {
                        Image(systemName: "magnifyingglass")
                            .font(.system(size: 48))
                            .foregroundColor(Theme.textSecondary)
                        Text("No listings found")
                            .foregroundColor(Theme.textSecondary)
                    }
                    Spacer()
                } else {
                    ScrollView {
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                            ForEach(vm.posts) { post in
                                NavigationLink {
                                    PostDetailView(postId: post.id)
                                } label: {
                                    PostCardView(post: post)
                                }
                                .buttonStyle(.plain)
                                .onAppear {
                                    if post.id == vm.posts.last?.id {
                                        Task { await vm.loadMore() }
                                    }
                                }
                            }
                        }
                        .padding(.horizontal)
                        .padding(.bottom, 12)

                        if vm.isLoadingMore {
                            ProgressView().tint(Theme.accent).padding()
                        }
                    }
                }
            }
        }
        .navigationTitle("Browse Listings")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    showFilters = true
                } label: {
                    Label("Filter", systemImage: "line.3.horizontal.decrease.circle")
                }
                .foregroundColor(Theme.accent)
            }
        }
        .sheet(isPresented: $showFilters) {
            FilterView(filter: $vm.filter) {
                Task { await vm.loadPosts() }
            }
        }
        .task {
            if !initialCategory.isEmpty { vm.filter.categorySlug = initialCategory }
            if !initialSearch.isEmpty { vm.filter.search = initialSearch }
            await vm.loadPosts()
        }
    }
}
