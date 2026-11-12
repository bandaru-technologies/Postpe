import SwiftUI

struct SearchBarView: View {
    @Binding var text: String
    var onSearch: () -> Void
    var placeholder = "Search listings..."

    var body: some View {
        HStack(spacing: 10) {
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(Theme.textSecondary)
                TextField(placeholder, text: $text)
                    .foregroundColor(.white)
                    .tint(Theme.accent)
                    .onSubmit(onSearch)
                if !text.isEmpty {
                    Button {
                        text = ""
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(Theme.textSecondary)
                    }
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(Color(hex: "1a2456"))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Theme.navyBorder, lineWidth: 1)
            )

            Button(action: onSearch) {
                Image(systemName: "arrow.right")
                    .fontWeight(.semibold)
                    .foregroundColor(Color(hex: "0f1535"))
                    .frame(width: 44, height: 44)
                    .background(Theme.accent)
                    .cornerRadius(12)
            }
        }
    }
}
