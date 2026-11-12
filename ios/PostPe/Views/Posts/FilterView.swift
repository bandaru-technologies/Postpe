import SwiftUI

struct FilterView: View {
    @Binding var filter: PostFilter
    var onApply: () -> Void
    @Environment(\.dismiss) private var dismiss

    private let cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
                          "Pune", "Ahmedabad", "Jaipur", "Lucknow"]
    private let postTypes = [("", "All Types"), ("SELL", "For Sale"), ("BUY", "Wanted"), ("SERVICE", "Service"), ("RENT", "For Rent")]
    private let sortOptions = [("newest", "Newest First"), ("price_asc", "Price: Low to High"), ("price_desc", "Price: High to Low")]

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                Form {
                    Section("Search") {
                        TextField("Keywords...", text: $filter.search)
                            .foregroundColor(.white)
                    }
                    .listRowBackground(Theme.cardBackground)

                    Section("City") {
                        Picker("City", selection: $filter.city) {
                            Text("All Cities").tag("")
                            ForEach(cities, id: \.self) { city in
                                Text(city).tag(city)
                            }
                        }
                        .foregroundColor(.white)
                    }
                    .listRowBackground(Theme.cardBackground)

                    Section("Type") {
                        Picker("Post Type", selection: $filter.postType) {
                            ForEach(postTypes, id: \.0) { type in
                                Text(type.1).tag(type.0)
                            }
                        }
                        .pickerStyle(.menu)
                        .foregroundColor(.white)
                    }
                    .listRowBackground(Theme.cardBackground)

                    Section("Sort By") {
                        Picker("Sort", selection: $filter.sort) {
                            ForEach(sortOptions, id: \.0) { opt in
                                Text(opt.1).tag(opt.0)
                            }
                        }
                        .pickerStyle(.menu)
                        .foregroundColor(.white)
                    }
                    .listRowBackground(Theme.cardBackground)

                    Section {
                        Button {
                            filter = PostFilter()
                        } label: {
                            Text("Reset Filters")
                                .foregroundColor(.red)
                                .frame(maxWidth: .infinity)
                        }
                    }
                    .listRowBackground(Theme.cardBackground)
                }
                .scrollContentBackground(.hidden)
            }
            .navigationTitle("Filter Listings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                        .foregroundColor(Theme.accent)
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Apply") {
                        onApply()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                    .foregroundColor(Theme.accent)
                }
            }
        }
    }
}
