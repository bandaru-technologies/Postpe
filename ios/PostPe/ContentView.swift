import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var authVM: AuthViewModel

    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house.fill")
                }

            PostListView()
                .tabItem {
                    Label("Browse", systemImage: "magnifyingglass")
                }

            postAdTab
                .tabItem {
                    Label("Post Ad", systemImage: "plus.circle.fill")
                }

            ConversationsView()
                .tabItem {
                    Label("Messages", systemImage: "message.fill")
                }

            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.fill")
                }
        }
        .tint(Theme.accent)
        .onAppear {
            let appearance = UITabBarAppearance()
            appearance.configureWithOpaqueBackground()
            appearance.backgroundColor = UIColor(Theme.cardBackground)
            UITabBar.appearance().standardAppearance = appearance
            UITabBar.appearance().scrollEdgeAppearance = appearance
        }
    }

    @ViewBuilder
    private var postAdTab: some View {
        if authVM.isAuthenticated {
            CreatePostView()
        } else {
            NavigationStack {
                ZStack {
                    Theme.background.ignoresSafeArea()
                    VStack(spacing: 20) {
                        Image(systemName: "plus.circle")
                            .font(.system(size: 60))
                            .foregroundColor(Theme.textSecondary)
                        Text("Sign in to post an ad")
                            .font(.title3)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        NavigationLink {
                            LoginView()
                        } label: {
                            Text("Sign In")
                                .fontWeight(.bold)
                                .frame(width: 200, height: 48)
                                .background(Theme.accent)
                                .foregroundColor(Color(hex: "0f1535"))
                                .cornerRadius(12)
                        }
                    }
                }
                .navigationTitle("Post Ad")
            }
        }
    }
}
