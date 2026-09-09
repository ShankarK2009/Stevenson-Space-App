import PassKit
import StudentIDKit
import SwiftUI

/// Wallet owns the final Add/Cancel decision. A delegate callback alone does
/// not mean a pass was added; only containsPass confirms its presence.
struct StudentIDWalletView: View {
    let card: StudentIDCard
    @Environment(\.scenePhase) private var scenePhase
    @State private var consentPresented = false
    @State private var operation: Task<Void, Never>?
    @State private var operationID: UUID?
    @State private var presentation: WalletPresentation?
    @State private var errorMessage: String?
    @State private var confirmedPass: PKPass?
    @State private var isInWallet = false

    private var configuration: StudentWalletConfiguration? {
        let info = Bundle.main.infoDictionary ?? [:]
        return StudentWalletConfiguration(
            endpoint: info["StudentWalletEndpoint"] as? String ?? "",
            passTypeIdentifier: info["StudentWalletPassTypeIdentifier"] as? String ?? "",
            allowsCode128: (info["StudentWalletCode128ScannerVerified"] as? String) == "YES"
                || (info["StudentWalletCode128ScannerVerified"] as? Bool) == true)
    }

    private var format: StudentWalletRequest.BarcodeFormat? {
        configuration?.barcodeFormat(majorOSVersion: ProcessInfo.processInfo.operatingSystemVersion.majorVersion)
    }

    var body: some View {
        VStack(spacing: 10) {
            if !PKAddPassesViewController.canAddPasses() {
                explanation("Apple Wallet is not available on this device.")
            } else if configuration == nil {
                explanation("Apple Wallet support is awaiting setup. You can still scan your ID from this app.")
            } else if format == nil {
                explanation("Wallet on this iOS version cannot display your ID’s Code 39 barcode. Use Show for Scanning.")
            } else {
                if operationID != nil {
                    ProgressView("Preparing Wallet pass…")
                    Button("Cancel", action: cancel)
                } else {
                    AddPassToWalletButton { consentPresented = true }
                        .frame(height: 44)
                        .accessibilityLabel(isInWallet ? "Update ID in Apple Wallet" : "Add ID to Apple Wallet")
                }
                if isInWallet {
                    Label("ID is in Apple Wallet", systemImage: "checkmark.circle")
                        .font(.caption)
                }
                explanation("Wallet keeps a separate copy. Replacing or removing your ID here does not remove it from Wallet.")
                if format == .code128 {
                    explanation("This Wallet pass uses Code 128 for iPhone scanning. Apple Watch scanning is not supported. The app keeps your original Code 39 barcode.")
                }
            }
        }
        .alert("Create a Wallet copy?", isPresented: $consentPresented) {
            Button("Continue") { prepare() }
            Button("Cancel", role: .cancel) { }
        } message: {
            Text("Your student number, name, grade, school year, and barcode will be sent to \(configuration?.endpoint.host ?? "the Wallet service") to sign a pass. Your photo and screenshot stay on this phone. This is a personal copy, not a school-issued mobile credential. If your ID is outdated, import a fresh screenshot first.")
        }
        .alert("Could not add to Wallet", isPresented: Binding(
            get: { errorMessage != nil }, set: { if !$0 { errorMessage = nil } })) {
                Button("OK", role: .cancel) { errorMessage = nil }
            } message: { Text(errorMessage ?? "Try again later.") }
        .sheet(item: $presentation, onDismiss: refreshPresence) { item in
            WalletAddSheet(controller: item.controller) {
                presentation = nil
                refreshPresence()
            }
        }
        .onChange(of: card) { _, _ in
            cancel()
            presentation = nil
            confirmedPass = nil
            isInWallet = false
            consentPresented = false
        }
        .onChange(of: scenePhase) { _, phase in
            if phase == .active { refreshPresence() }
        }
        .onDisappear { cancel() }
    }

    private func explanation(_ text: String) -> some View {
        Text(text).font(.caption).foregroundStyle(.secondary)
            .multilineTextAlignment(.center).fixedSize(horizontal: false, vertical: true)
    }

    private func cancel() {
        operation?.cancel()
        operation = nil
        operationID = nil
    }

    private func refreshPresence() {
        isInWallet = confirmedPass.map { PKPassLibrary().containsPass($0) } ?? false
    }

    private func prepare() {
        guard operationID == nil, let configuration, let format,
              PKAddPassesViewController.canAddPasses() else { return }
        let id = UUID()
        operationID = id
        operation = Task { @MainActor in
            defer {
                if operationID == id { operationID = nil; operation = nil }
            }
            do {
                let request = try StudentWalletRequest(card: card, format: format)
                let data = try await StudentWalletClient().fetch(request, configuration: configuration)
                try Task.checkCancellation()
                guard operationID == id else { return }
                let pass = try PKPass(data: data)
                guard pass.passTypeIdentifier == configuration.passTypeIdentifier,
                      pass.serialNumber == request.serialNumber,
                      pass.userInfo?["studentIDFingerprint"] as? String == (try request.fingerprint) else {
                    throw StudentWalletError.mismatchedPass
                }
                guard let controller = PKAddPassesViewController(pass: pass) else {
                    throw StudentWalletError.invalidResponse
                }
                confirmedPass = pass
                presentation = WalletPresentation(controller: controller)
            } catch {
                guard !Task.isCancelled, operationID == id else { return }
                if let walletError = error as? StudentWalletError {
                    errorMessage = walletError.localizedDescription
                } else if (error as? URLError) != nil {
                    errorMessage = "Could not reach the Wallet service. Check your connection and try again."
                } else {
                    errorMessage = "The pass could not be opened. Try again later."
                }
            }
        }
    }
}

private struct WalletPresentation: Identifiable {
    let id = UUID()
    let controller: PKAddPassesViewController
}

private struct WalletAddSheet: UIViewControllerRepresentable {
    let controller: PKAddPassesViewController
    let onFinish: () -> Void

    func makeCoordinator() -> Coordinator { Coordinator(onFinish: onFinish) }
    func makeUIViewController(context: Context) -> PKAddPassesViewController {
        controller.delegate = context.coordinator
        return controller
    }
    func updateUIViewController(_ controller: PKAddPassesViewController, context: Context) { }

    final class Coordinator: NSObject, PKAddPassesViewControllerDelegate {
        let onFinish: () -> Void
        init(onFinish: @escaping () -> Void) { self.onFinish = onFinish }
        func addPassesViewControllerDidFinish(_ controller: PKAddPassesViewController) { onFinish() }
    }
}
