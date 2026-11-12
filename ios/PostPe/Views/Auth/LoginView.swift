import SwiftUI

struct LoginView: View {
    @EnvironmentObject private var authVM: AuthViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var showPassword = false
    @State private var showRegister = false

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                ScrollView {
                    VStack(spacing: 32) {
                        Spacer(minLength: 40)

                        VStack(spacing: 8) {
                            Image(systemName: "bolt.fill")
                                .font(.system(size: 40))
                                .foregroundColor(Theme.accent)
                                .padding(16)
                                .background(Theme.accent.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 20))

                            Text("PostPe")
                                .font(.largeTitle)
                                .fontWeight(.black)
                                .foregroundColor(.white)
                            Text("Sign in to your account")
                                .foregroundColor(Theme.textSecondary)
                        }

                        VStack(spacing: 20) {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Email").font(.subheadline).fontWeight(.medium).foregroundColor(Theme.textSecondary)
                                TextField("you@example.com", text: $email)
                                    .keyboardType(.emailAddress)
                                    .autocapitalization(.none)
                                    .textContentType(.emailAddress)
                                    .padding()
                                    .background(Color(hex: "1a2456"))
                                    .cornerRadius(12)
                                    .foregroundColor(.white)
                                    .tint(Theme.accent)
                                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Theme.navyBorder))
                            }

                            VStack(alignment: .leading, spacing: 8) {
                                Text("Password").font(.subheadline).fontWeight(.medium).foregroundColor(Theme.textSecondary)
                                HStack {
                                    if showPassword {
                                        TextField("Enter password", text: $password)
                                    } else {
                                        SecureField("Enter password", text: $password)
                                    }
                                    Button {
                                        showPassword.toggle()
                                    } label: {
                                        Image(systemName: showPassword ? "eye.slash" : "eye")
                                            .foregroundColor(Theme.textSecondary)
                                    }
                                }
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
                                Task { await authVM.login(email: email, password: password) }
                            } label: {
                                HStack {
                                    if authVM.isLoading {
                                        ProgressView().tint(Color(hex: "0f1535"))
                                    } else {
                                        Text("Sign In")
                                            .fontWeight(.bold)
                                    }
                                }
                                .frame(maxWidth: .infinity)
                                .frame(height: 52)
                                .background(Theme.accent)
                                .foregroundColor(Color(hex: "0f1535"))
                                .cornerRadius(14)
                            }
                            .disabled(authVM.isLoading || email.isEmpty || password.isEmpty)
                        }
                        .padding()
                        .cardStyle()

                        Button {
                            showRegister = true
                        } label: {
                            HStack {
                                Text("Don't have an account?").foregroundColor(Theme.textSecondary)
                                Text("Sign up free").fontWeight(.bold).foregroundColor(Theme.accent)
                            }
                            .font(.subheadline)
                        }

                        Spacer(minLength: 40)
                    }
                    .padding(.horizontal)
                }
            }
            .navigationDestination(isPresented: $showRegister) {
                RegisterView()
            }
        }
    }
}
