import Foundation

final class AuthService {
    static let shared = AuthService()
    private let api = APIService.shared

    private init() {}

    func login(email: String, password: String) async throws -> AuthResponse {
        struct LoginBody: Encodable { let email, password: String }
        let res: AuthResponse = try await api.post("/auth/login", body: LoginBody(email: email, password: password))
        KeychainService.shared.saveToken(res.token)
        return res
    }

    func register(name: String, email: String, phone: String, password: String) async throws -> AuthResponse {
        struct RegisterBody: Encodable { let name, email, phone, password: String }
        let res: AuthResponse = try await api.post("/auth/register", body: RegisterBody(name: name, email: email, phone: phone, password: password))
        KeychainService.shared.saveToken(res.token)
        return res
    }

    func getCurrentUser() async throws -> User {
        return try await api.get("/auth/me")
    }

    func sendOTP(phone: String) async throws {
        let _: MessageTextResponse = try await api.post("/auth/send-otp", body: DictionaryBody(dict: ["phone": phone]))
    }

    func verifyOTP(phone: String, otp: String) async throws {
        let _: MessageTextResponse = try await api.post("/auth/verify-otp", body: DictionaryBody(dict: ["phone": phone, "otp": otp]))
    }

    func logout() {
        KeychainService.shared.deleteToken()
    }
}
