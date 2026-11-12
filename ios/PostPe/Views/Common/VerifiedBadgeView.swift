import SwiftUI

struct VerifiedBadgeView: View {
    var showText = false

    var body: some View {
        HStack(spacing: 3) {
            Image(systemName: "checkmark.seal.fill")
                .font(.caption)
                .foregroundColor(.blue)
            if showText {
                Text("Verified")
                    .font(.caption2)
                    .fontWeight(.semibold)
                    .foregroundColor(.blue)
            }
        }
    }
}
