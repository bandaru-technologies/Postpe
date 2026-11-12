import SwiftUI

struct LoadingView: View {
    var message = "Loading..."

    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
                .tint(Theme.accent)
                .scaleEffect(1.5)
            Text(message)
                .foregroundColor(Theme.textSecondary)
                .font(.subheadline)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.background)
    }
}

struct ErrorView: View {
    let message: String
    var retry: (() -> Void)?

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 48))
                .foregroundColor(.orange)
            Text(message)
                .foregroundColor(Theme.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            if let retry = retry {
                Button("Try Again", action: retry)
                    .buttonStyle(.borderedProminent)
                    .tint(Theme.accent)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.background)
    }
}
