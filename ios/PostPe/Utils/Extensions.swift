import Foundation
import SwiftUI

extension Double {
    func formattedAsINR() -> String {
        if self == 0 { return "Free" }
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "INR"
        formatter.currencySymbol = "₹"
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: self)) ?? "₹\(Int(self))"
    }
}

extension String {
    func timeAgo() -> String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        guard let date = formatter.date(from: self) else { return self }

        let now = Date()
        let diff = now.timeIntervalSince(date)
        let minutes = Int(diff / 60)
        let hours = Int(diff / 3600)
        let days = Int(diff / 86400)

        if days > 30 {
            let df = DateFormatter()
            df.dateStyle = .medium
            return df.string(from: date)
        } else if days > 0 {
            return "\(days) day\(days > 1 ? "s" : "") ago"
        } else if hours > 0 {
            return "\(hours) hour\(hours > 1 ? "s" : "") ago"
        } else if minutes > 0 {
            return "\(minutes) min ago"
        } else {
            return "Just now"
        }
    }

    func yearJoined() -> String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        guard let date = formatter.date(from: self) else { return "" }
        return Calendar.current.component(.year, from: date).description
    }
}

struct CardModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .background(Theme.cardBackground)
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Theme.navyBorder, lineWidth: 1)
            )
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardModifier())
    }
}
