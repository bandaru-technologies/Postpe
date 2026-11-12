import SwiftUI
import PhotosUI

struct CreatePostView: View {
    @EnvironmentObject private var authVM: AuthViewModel
    @Environment(\.dismiss) private var dismiss

    @State private var step = 1
    @State private var categories: [Category] = []
    @State private var selectedCategoryId: Int?
    @State private var title = ""
    @State private var description = ""
    @State private var price = ""
    @State private var city = ""
    @State private var location = ""
    @State private var postType = "SELL"
    @State private var selectedItems: [PhotosPickerItem] = []
    @State private var selectedImages: [UIImage] = []
    @State private var submitting = false
    @State private var createdPost: Post?

    let postTypes = ["SELL", "BUY", "SERVICE", "RENT"]
    let cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"]

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()

                VStack(spacing: 0) {
                    stepIndicator
                    Divider().overlay(Theme.navyBorder)

                    ScrollView {
                        VStack(spacing: 20) {
                            switch step {
                            case 1: categoryStep
                            case 2: detailsStep
                            case 3: photosStep
                            default: previewStep
                            }
                        }
                        .padding()
                    }

                    navigationButtons
                }
            }
            .navigationTitle("Post Free Ad")
            .navigationBarTitleDisplayMode(.inline)
        }
        .task { categories = (try? await PostService.shared.getCategories()) ?? [] }
        .onChange(of: selectedItems) { _, items in
            Task {
                selectedImages = []
                for item in items {
                    if let data = try? await item.loadTransferable(type: Data.self),
                       let image = UIImage(data: data) {
                        selectedImages.append(image)
                    }
                }
            }
        }
    }

    private var stepIndicator: some View {
        HStack {
            ForEach(1...4, id: \.self) { s in
                HStack(spacing: 0) {
                    Circle()
                        .frame(width: 28, height: 28)
                        .foregroundColor(step >= s ? Theme.accent : Theme.cardBackground)
                        .overlay(
                            Group {
                                if step > s {
                                    Image(systemName: "checkmark").font(.caption).fontWeight(.bold).foregroundColor(Color(hex: "0f1535"))
                                } else {
                                    Text("\(s)").font(.caption).fontWeight(.bold).foregroundColor(step == s ? Color(hex: "0f1535") : Theme.textSecondary)
                                }
                            }
                        )
                    if s < 4 {
                        Rectangle()
                            .frame(height: 2)
                            .foregroundColor(step > s ? Theme.accent : Theme.navyBorder)
                    }
                }
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 12)
        .background(Color(hex: "1a2456"))
    }

    @ViewBuilder
    private var categoryStep: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("What are you posting?").font(.title3).fontWeight(.bold).foregroundColor(.white)

            let cats = categories.isEmpty ? (Constants.defaultCategories.enumerated().map { i, c in
                Category(id: i + 1, name: c.0, slug: c.2, iconName: c.1, displayOrder: i + 1)
            }) : categories

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ForEach(cats) { cat in
                    Button {
                        selectedCategoryId = cat.id
                    } label: {
                        HStack {
                            if selectedCategoryId == cat.id {
                                Image(systemName: "checkmark.circle.fill").foregroundColor(Theme.accent)
                            }
                            Text(cat.name).font(.subheadline).fontWeight(.medium).foregroundColor(.white)
                            Spacer()
                        }
                        .padding(12)
                        .background(selectedCategoryId == cat.id ? Theme.accent.opacity(0.1) : Theme.cardBackground)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(selectedCategoryId == cat.id ? Theme.accent : Theme.navyBorder)
                        )
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var detailsStep: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Ad Details").font(.title3).fontWeight(.bold).foregroundColor(.white)

            formField("Title") {
                TextField("e.g. iPhone 13 Pro Max 256GB", text: $title)
                    .textFieldStyle(PostpeFieldStyle())
            }

            formField("Description") {
                TextEditor(text: $description)
                    .frame(height: 100)
                    .padding(8)
                    .background(Color(hex: "1a2456"))
                    .cornerRadius(12)
                    .foregroundColor(.white)
                    .tint(Theme.accent)
            }

            formField("Price (₹) — leave empty for free") {
                TextField("0", text: $price)
                    .keyboardType(.numberPad)
                    .textFieldStyle(PostpeFieldStyle())
            }

            formField("Type") {
                Picker("Type", selection: $postType) {
                    ForEach(postTypes, id: \.self) { t in Text(t).tag(t) }
                }
                .pickerStyle(.segmented)
            }

            formField("City") {
                Picker("City", selection: $city) {
                    Text("Select...").tag("")
                    ForEach(cities, id: \.self) { c in Text(c).tag(c) }
                }
                .pickerStyle(.menu)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(Color(hex: "1a2456"))
                .cornerRadius(12)
                .foregroundColor(.white)
            }

            formField("Location/Area") {
                TextField("e.g. Koramangala", text: $location)
                    .textFieldStyle(PostpeFieldStyle())
            }
        }
    }

    @ViewBuilder
    private var photosStep: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Add Photos").font(.title3).fontWeight(.bold).foregroundColor(.white)
            Text("Up to 5 photos. First photo is the cover.").font(.caption).foregroundColor(Theme.textSecondary)

            PhotosPicker(selection: $selectedItems, maxSelectionCount: 5, matching: .images) {
                VStack(spacing: 12) {
                    Image(systemName: "photo.on.rectangle.angled")
                        .font(.system(size: 40))
                        .foregroundColor(Theme.accent)
                    Text("Tap to add photos")
                        .foregroundColor(Theme.textSecondary)
                }
                .frame(maxWidth: .infinity)
                .frame(height: 140)
                .background(Theme.accent.opacity(0.05))
                .cornerRadius(16)
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Theme.accent.opacity(0.3), style: StrokeStyle(lineWidth: 2, dash: [8])))
            }

            if !selectedImages.isEmpty {
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 8) {
                    ForEach(selectedImages.indices, id: \.self) { i in
                        ZStack(alignment: .topLeading) {
                            Image(uiImage: selectedImages[i])
                                .resizable()
                                .aspectRatio(1, contentMode: .fill)
                                .clipped()
                                .cornerRadius(10)
                            if i == 0 {
                                Text("COVER")
                                    .font(.system(size: 9)).fontWeight(.bold)
                                    .padding(.horizontal, 6).padding(.vertical, 2)
                                    .background(Theme.accent)
                                    .foregroundColor(Color(hex: "0f1535"))
                                    .cornerRadius(4)
                                    .padding(4)
                            }
                        }
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var previewStep: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Review Your Ad").font(.title3).fontWeight(.bold).foregroundColor(.white)

            VStack(alignment: .leading, spacing: 12) {
                if let first = selectedImages.first {
                    Image(uiImage: first)
                        .resizable()
                        .aspectRatio(16/9, contentMode: .fill)
                        .cornerRadius(12)
                        .clipped()
                }

                Text(title).font(.title3).fontWeight(.bold).foregroundColor(.white)

                if let p = Double(price), p > 0 {
                    Text(p.formattedAsINR()).font(.title2).fontWeight(.black).foregroundColor(Theme.accent)
                } else {
                    Text("Free").font(.title2).fontWeight(.black).foregroundColor(.green)
                }

                if !city.isEmpty {
                    Label(city, systemImage: "mappin.circle.fill").foregroundColor(Theme.textSecondary).font(.subheadline)
                }

                if !description.isEmpty {
                    Text(description).foregroundColor(Theme.textSecondary).font(.subheadline)
                }
            }
            .padding()
            .cardStyle()
        }
    }

    private var navigationButtons: some View {
        HStack(spacing: 12) {
            if step > 1 {
                Button {
                    step -= 1
                } label: {
                    Label("Back", systemImage: "chevron.left")
                        .frame(maxWidth: .infinity, minHeight: 50)
                        .background(Theme.cardBackground)
                        .foregroundColor(.white)
                        .cornerRadius(14)
                }
            }

            Button {
                if step < 4 { step += 1 }
                else { Task { await submitPost() } }
            } label: {
                Group {
                    if submitting {
                        ProgressView().tint(Color(hex: "0f1535"))
                    } else {
                        Label(step == 4 ? "Publish" : "Next", systemImage: step == 4 ? "checkmark" : "chevron.right")
                    }
                }
                .frame(maxWidth: .infinity, minHeight: 50)
                .background(Theme.accent)
                .foregroundColor(Color(hex: "0f1535"))
                .cornerRadius(14)
                .fontWeight(.bold)
            }
            .disabled(submitting)
        }
        .padding()
        .background(Theme.background)
    }

    private func submitPost() async {
        guard let catId = selectedCategoryId, !title.isEmpty else { return }
        submitting = true
        do {
            let req = CreatePostRequest(
                title: title,
                description: description,
                price: Double(price),
                categoryId: catId,
                location: location,
                city: city,
                state: "",
                postType: postType
            )
            let post = try await PostService.shared.createPost(req)
            if !selectedImages.isEmpty {
                _ = try? await PostService.shared.uploadImages(postId: post.id, images: selectedImages)
            }
            createdPost = post
            step = 1
        } catch {}
        submitting = false
    }

    @ViewBuilder
    private func formField<C: View>(_ label: String, @ViewBuilder content: () -> C) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label).font(.subheadline).fontWeight(.medium).foregroundColor(Theme.textSecondary)
            content()
        }
    }
}

struct PostpeFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .foregroundColor(.white)
            .tint(Theme.accent)
            .padding()
            .background(Color(hex: "1a2456"))
            .cornerRadius(12)
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Theme.navyBorder))
    }
}
