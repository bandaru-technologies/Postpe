import Foundation

final class APIService {
    static let shared = APIService()
    private let baseURL = Constants.baseURL
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder

    private init() {
        decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .useDefaultKeys

        encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .useDefaultKeys
    }

    private func makeURL(_ path: String, queryItems: [URLQueryItem] = []) -> URL {
        var components = URLComponents(string: baseURL + path)!
        if !queryItems.isEmpty {
            components.queryItems = queryItems
        }
        return components.url!
    }

    private func makeRequest(_ url: URL, method: String, body: Data? = nil) -> URLRequest {
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let token = KeychainService.shared.getToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        if let body = body {
            request.httpBody = body
        }
        return request
    }

    func get<T: Decodable>(_ path: String, queryItems: [URLQueryItem] = []) async throws -> T {
        let url = makeURL(path, queryItems: queryItems)
        let request = makeRequest(url, method: "GET")
        return try await perform(request)
    }

    func post<T: Decodable>(_ path: String, body: Encodable) async throws -> T {
        let url = makeURL(path)
        let bodyData = try encoder.encode(body)
        let request = makeRequest(url, method: "POST", body: bodyData)
        return try await perform(request)
    }

    func postEmpty<T: Decodable>(_ path: String) async throws -> T {
        let url = makeURL(path)
        let request = makeRequest(url, method: "POST")
        return try await perform(request)
    }

    func put<T: Decodable>(_ path: String, body: Encodable) async throws -> T {
        let url = makeURL(path)
        let bodyData = try encoder.encode(body)
        let request = makeRequest(url, method: "PUT", body: bodyData)
        return try await perform(request)
    }

    func delete(_ path: String) async throws {
        let url = makeURL(path)
        let request = makeRequest(url, method: "DELETE")
        let (_, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw APIError(message: "Request failed")
        }
    }

    func uploadMultipart<T: Decodable>(_ path: String, imageData: [Data], fieldName: String = "files") async throws -> T {
        let url = makeURL(path)
        var request = URLRequest(url: url)
        request.httpMethod = "POST"

        if let token = KeychainService.shared.getToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let boundary = UUID().uuidString
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        var body = Data()
        for (i, data) in imageData.enumerated() {
            body.append("--\(boundary)\r\n".data(using: .utf8)!)
            body.append("Content-Disposition: form-data; name=\"\(fieldName)\"; filename=\"image\(i).jpg\"\r\n".data(using: .utf8)!)
            body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
            body.append(data)
            body.append("\r\n".data(using: .utf8)!)
        }
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)
        request.httpBody = body

        return try await perform(request)
    }

    private func perform<T: Decodable>(_ request: URLRequest) async throws -> T {
        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError(message: "Invalid response")
        }

        if httpResponse.statusCode == 401 {
            NotificationCenter.default.post(name: .userDidLogout, object: nil)
            throw APIError(message: "Unauthorized")
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            if let errorBody = try? JSONDecoder().decode([String: String].self, from: data),
               let msg = errorBody["message"] {
                throw APIError(message: msg)
            }
            throw APIError(message: "Server error: \(httpResponse.statusCode)")
        }

        return try decoder.decode(T.self, from: data)
    }
}

extension Notification.Name {
    static let userDidLogout = Notification.Name("userDidLogout")
}

// Codable wrapper for dictionary bodies
struct DictionaryBody: Encodable {
    let dict: [String: String]
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: DynamicKey.self)
        for (key, value) in dict {
            let codingKey = DynamicKey(stringValue: key)!
            try container.encode(value, forKey: codingKey)
        }
    }
}

struct DynamicKey: CodingKey {
    var stringValue: String
    init?(stringValue: String) { self.stringValue = stringValue }
    var intValue: Int? { nil }
    init?(intValue: Int) { nil }
}
