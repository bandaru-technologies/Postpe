import SwiftUI

struct RegisterView: View {
    @EnvironmentObject private var authVM: AuthViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var password = ""

    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()
            ScrollView {
                VStack(spacing: 24) {
                    Spacer(minLength: 20)

                    VStack(spacing: 6) {
                        Text("Create Account")
                            .font(.largeTitle)
                            .fontWeight(.black)
                            .foregroundColor(.white)
                        Text("Join thousands of buyers and sellers")
                            .foregroundColor(Theme.textSecondary)
                            .font(.subheadline)
                    }

                    VStack(spacing: 16) {
                        inputField("Full Name", text: $name, icon: "person", type: .name)
                        inputField("Email Address", text: $email, icon: "envelope", type: .emailAddress)
                        inputField("Phone Number", text: $phone, icon: "phone", type: .telephoneNumber)

                        VStack(alignment: .leading, spacing: 8) {
                            Text("Password").font(.subheadline).fontWeight(.medium).foregroundColor(Theme.textSecondary)
                            SecureField("At least 6 characters", text: $password)
                                .textContentType(.newPassword)
                                .padding()
                                .background(Color(hex: "1a2456"))
                                .cornerRadius(12)
                                .foregroundColor(.white)
                                .tint(Theme.accent)
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Theme.navyBorder))
                        }

                        if let error = authVM.error {
                            Text(error)
                                .font(.caption)
                                .foregroundColor(.red)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }

                        Button {
                            Task {
                                await authVM.register(name: name, email: email, phone: phone, password: password)
                            }
                        } label: {
                            HStack {
                                if authVM.isLoading {
                                    ProgressView().tint(Color(hex: "0f1535"))
                                } else {
                                    Text("Create Account").fontWeight(.bold)
                                }
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 52)
                            .background(Theme.accent)
                            .foregroundColor(Color(hex: "0f1535"))
                            .cornerRadius(14)
                        }
                        .disabled(authVM.isLoading || name.isEmpty || email.isEmpty || phone.isEmpty || password.count < 6)
                    }
                    .padding()
                    .cardStyle()

                    Spacer(minLength: 20)
                }
                .padding(.horizontal)
            }
        }
        .navigationTitle("Sign Up")
        .navigationBarTitleDisplayMode(.inline)
    }

    @ViewBuilder
    private func inputField(_ label: String, text: Binding<String>, icon: String, type: UIKeyboardType) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label).font(.subheadline).fontWeight(.medium).foregroundColor(Theme.textSecondary)
            HStack {
                Image(systemName: icon).foregroundColor(Theme.textSecondary).frame(width: 20)
                TextField(label, text: text)
                    .keyboardType(type)
                    .autocapitalization(type == .name ? .words : .none)
            }
            .padding()
            .background(Color(hex: "1a2456"))
            .cornerRadius(12)
            .foregroundColor(.white)
            .tint(Theme.accent)
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Theme.navyBorder))
        }
    }
}
