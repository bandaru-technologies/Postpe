import Foundation

struct PostImage: Codable, Identifiable {
    let id: String
    let url: String
    let displayOrder: Int
}

struct Post: Codable, Identifiable {
    let id: String
    let title: String
    let description: String?
    let price: Double?
    let category: Category
    let user: User
    let location: String?
    let city: String?
    let state: String?
    let status: String
    let postType: String
    let featured: Bool
    let views: Int
    let images: [PostImage]
    let createdAt: String
    var isFavorited: Bool?

    var mainImageUrl: String? {
        images.first?.url
    }

    var formattedPrice: String {
        guard let price = price else { return "Contact" }
        return price.formattedAsINR()
    }
}

struct PostFilter {
    var search: String = ""
    var categorySlug: String = ""
    var city: String = ""
    var postType: String = ""
    var minPrice: Double? = nil
    var maxPrice: Double? = nil
    var sort: String = "newest"
    var page: Int = 0
    var size: Int = 12

    func queryItems() -> [URLQueryItem] {
        var items: [URLQueryItem] = []
        items.append(URLQueryItem(name: "page", value: "\(page)"))
        items.append(URLQueryItem(name: "size", value: "\(size)"))
        items.append(URLQueryItem(name: "sort", value: sort))
        if !search.isEmpty { items.append(URLQueryItem(name: "search", value: search)) }
        if !categorySlug.isEmpty { items.append(URLQueryItem(name: "category", value: categorySlug)) }
        if !city.isEmpty { items.append(URLQueryItem(name: "city", value: city)) }
        if !postType.isEmpty { items.append(URLQueryItem(name: "postType", value: postType)) }
        if let min = minPrice { items.append(URLQueryItem(name: "minPrice", value: "\(min)")) }
        if let max = maxPrice { items.append(URLQueryItem(name: "maxPrice", value: "\(max)")) }
        return items
    }
}

struct CreatePostRequest: Codable {
    let title: String
    let description: String
    let price: Double?
    let categoryId: Int
    let location: String
    let city: String
    let state: String
    let postType: String
}
