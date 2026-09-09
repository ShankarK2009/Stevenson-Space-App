import CryptoKit
import Foundation

/// Versioned input to the trusted pass issuer. This is a personal copy of an
/// imported ID, not proof of enrollment. No screenshot, photo, or import date.
public struct StudentWalletRequest: Encodable, Equatable, Sendable {
    public enum BarcodeFormat: String, Encodable, Sendable {
        case code39 = "PKBarcodeFormatCode39"
        case code128 = "PKBarcodeFormatCode128"
    }

    public let version = 1
    public let idNumber: String
    public let fullName: String?
    public let gradeLevel: Int?
    public let schoolYearStart: Int?
    public let barcodeFormat: BarcodeFormat
    public let barcodeMessage: String
    public let serialNumber: String

    public init(card: StudentIDCard, format: BarcodeFormat) throws {
        idNumber = card.idNumber
        fullName = card.fullName
        gradeLevel = card.gradeLevel
        schoolYearStart = card.schoolYearStart
        barcodeFormat = format
        // A Code 39 check character belongs to the symbol, not the student
        // number. Preserve it for Code 39; never transfer it into Code 128.
        barcodeMessage = card.barcodePayload + (format == .code39 && card.requiresCheckDigit
            ? String(try Code39.checkDigit(for: card.barcodePayload)) : "")
        // Stable across imports/year changes so Wallet can replace the same ID.
        // This digest is an identifier, NOT a secret or authentication token.
        serialNumber = Self.digest(Data("stevenson-student-id-v1:\(card.idNumber)".utf8))
    }

    public func encoded() throws -> Data {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.sortedKeys, .withoutEscapingSlashes]
        return try encoder.encode(self)
    }

    /// Issuer echoes SHA-256 of the exact HTTP request body in pass.userInfo.
    public var fingerprint: String { get throws { Self.digest(try encoded()) } }

    private static func digest(_ data: Data) -> String {
        SHA256.hash(data: data).map { String(format: "%02x", $0) }.joined()
    }
}

public struct StudentWalletConfiguration: Sendable {
    public let endpoint: URL
    public let passTypeIdentifier: String
    public let allowsCode128: Bool

    public init?(endpoint: String, passTypeIdentifier: String,
                 allowsCode128: Bool = false) {
        guard let url = URL(string: endpoint), url.scheme == "https",
              let host = url.host, !host.isEmpty,
              url.user == nil, url.password == nil, url.query == nil, url.fragment == nil,
              passTypeIdentifier.hasPrefix("pass."), passTypeIdentifier.count > 5,
              !passTypeIdentifier.contains(where: { $0.isWhitespace }) else { return nil }
        self.endpoint = url
        self.passTypeIdentifier = passTypeIdentifier
        self.allowsCode128 = allowsCode128
    }

    public func barcodeFormat(majorOSVersion: Int) -> StudentWalletRequest.BarcodeFormat? {
        if majorOSVersion >= 27 { return .code39 }
        return allowsCode128 ? .code128 : nil
    }
}
