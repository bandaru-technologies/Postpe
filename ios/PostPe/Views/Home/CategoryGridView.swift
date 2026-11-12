import SwiftUI

struct CategoryGridView: View {
    let categories: [Category]
    var onSelect: (Category) -> Void

    let columns = [GridItem(.adaptive(minimum: 90), spacing: 12)]

    var body: some View {
        LazyVGrid(columns: columns, spacing: 12) {
            ForEach(categories) { cat in
                Button {
                    onSelect(cat)
                } label: {
                    VStack(spacing: 8) {
                        Image(systemName: sfSymbol(for: cat.iconName))
                            .font(.title2)
                            .foregroundColor(Theme.accent)
                            .frame(width: 44, height: 44)
                            .background(Theme.accent.opacity(0.1))
                            .cornerRadius(12)
                        Text(cat.name)
                            .font(.caption)
                            .fontWeight(.medium)
                            .foregroundColor(.white)
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .padding(.horizontal, 8)
                    .background(Theme.cardBackground)
                    .cornerRadius(16)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Theme.navyBorder, lineWidth: 1)
                    )
                }
            }
        }
    }

    private func sfSymbol(for iconName: String) -> String {
        let map: [String: String] = [
            "car": "car.fill",
            "bike": "bicycle",
            "truck": "truck.box.fill",
            "smartphone": "iphone",
            "briefcase": "briefcase.fill",
            "building-2": "building.2.fill",
            "hotel": "bed.double.fill",
            "sofa": "sofa.fill",
            "car-taxi-front": "car.2.fill",
            "paw-print": "pawprint.fill",
            "shirt": "tshirt.fill",
            "book-open": "book.fill",
            "calendar": "calendar",
            "wrench": "wrench.fill",
            "monitor": "laptopcomputer",
            "chart-line": "chart.line.uptrend.xyaxis",
            "folder": "folder.fill",
        ]
        return map[iconName] ?? "tag.fill"
    }
}
