import Foundation
import Combine

@MainActor
final class AuthViewModel: ObservableObject {
    @Published var user: User?
    @Published var isAuthenticated = false
    @Published var isLoading = false
    @Published var error: String?

    private let authService = AuthService.shared

    init() {
        Task { await checkAuth() }

        NotificationCenter.default.addObserver(self, selector: #selector(handleLogout), name: .userDidLogout, object: nil)
    }

    @objc private func handleLogout() {
        logout()
    }

    func checkAuth() async {
        guard KeychainService.shared.getToken() != nil else { return }
        do {
            let u = try await authService.getCurrentUser()
            user = u
            isAuthenticated = true
        } catch {
            logout()
        }
    }

    func login(email: String, password: String) async {
        isLoading = true
        error = nil
        do {
            let res = try await authService.login(email: email, password: password)
            user = res.user
            isAuthenticated = true
        } catch let e as APIError {
            error = e.message
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    func register(name: String, email: String, phone: String, password: String) async {
        isLoading = true
        error = nil
        do {
            let res = try await authService.register(name: name, email: email, phone: phone, password: password)
            user = res.user
            isAuthenticated = true
        } catch let e as APIError {
            error = e.message
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    func logout() {
        authService.logout()
        user = nil
        isAuthenticated = false
    }
}
