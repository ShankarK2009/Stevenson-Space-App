import CryptoKit
import Foundation
import Testing
@testable import StudentIDKit

@Suite struct StudentWalletTests {
    private func card(number: String = "00123", checksum: Bool = false,
                      name: String? = "Riley Vásquez", year: Int? = 2026,
                      date: Date = .distantPast) -> StudentIDCard {
        StudentIDCard(idNumber: number, barcodePayload: number, requiresCheckDigit: checksum,
                      fullName: name, gradeLevel: 12, schoolYearStart: year, importedAt: date)
    }

    @Test func preservesLeadingZerosAndCode39CheckCharacter() throws {
        let request = try StudentWalletRequest(card: card(checksum: true), format: .code39)
        #expect(request.idNumber == "00123")
        #expect(request.barcodeMessage == "00123" + String(try Code39.checkDigit(for: "00123")))
        #expect(try Code39.encode(request.barcodeMessage).modules == Code39.encode("00123", appendCheckDigit: true).modules)
    }

    @Test func code128DoesNotEncodeCode39CheckCharacter() throws {
        let request = try StudentWalletRequest(card: card(checksum: true), format: .code128)
        #expect(request.barcodeMessage == "00123")
    }

    @Test func repeatedImportsAreIdempotentButUpdatesChangeFingerprint() throws {
        let first = try StudentWalletRequest(card: card(), format: .code39)
        let reimport = try StudentWalletRequest(card: card(date: .now), format: .code39)
        let updated = try StudentWalletRequest(card: card(name: "New Name", year: 2027), format: .code39)
        let other = try StudentWalletRequest(card: card(number: "54321"), format: .code39)
        #expect(first == reimport)
        #expect(try first.fingerprint == reimport.fingerprint)
        #expect(first.serialNumber == updated.serialNumber)
        #expect(try first.fingerprint != updated.fingerprint)
        #expect(first.serialNumber != other.serialNumber)
    }

    @Test func requestOmitsPrivateImageDataAndHandlesMissingFields() throws {
        let request = try StudentWalletRequest(card: card(name: nil, year: nil), format: .code39)
        let object = try #require(JSONSerialization.jsonObject(with: request.encoded()) as? [String: Any])
        #expect(Set(object.keys) == ["version", "idNumber", "gradeLevel", "barcodeFormat", "barcodeMessage", "serialNumber"])
        #expect(object["idNumber"] as? String == "00123")
        let digest = SHA256.hash(data: try request.encoded()).map { String(format: "%02x", $0) }.joined()
        #expect(try request.fingerprint == digest)
    }

    @Test func rejectsUnsafeEndpointsAndUnconfiguredBuilds() {
        for endpoint in ["", "$(STUDENT_WALLET_ENDPOINT)", "http://example.com/pass", "https://user:secret@example.com/pass", "https://example.com/pass?student=12345", "https://example.com/pass#fragment"] {
            #expect(StudentWalletConfiguration(endpoint: endpoint, passTypeIdentifier: "pass.org.example.id") == nil)
        }
        #expect(StudentWalletConfiguration(endpoint: "https://example.com/pass", passTypeIdentifier: "") == nil)
    }

    @Test func olderOSRequiresExplicitScannerVerification() throws {
        let config = try #require(StudentWalletConfiguration(endpoint: "https://example.com/pass", passTypeIdentifier: "pass.org.example.id"))
        #expect(config.barcodeFormat(majorOSVersion: 18) == nil)
        #expect(config.barcodeFormat(majorOSVersion: 26) == nil)
        #expect(config.barcodeFormat(majorOSVersion: 27) == .code39)
        let verified = try #require(StudentWalletConfiguration(endpoint: "https://example.com/pass", passTypeIdentifier: "pass.org.example.id", allowsCode128: true))
        #expect(verified.barcodeFormat(majorOSVersion: 18) == .code128)
        #expect(verified.barcodeFormat(majorOSVersion: 27) == .code39)
    }

    @Test func responseMustBeSuccessfulBoundedPassData() throws {
        let url = try #require(URL(string: "https://example.com/pass"))
        for (status, mime, length) in [(200, "text/html", "100"), (302, "application/vnd.apple.pkpass", "100"), (429, "application/vnd.apple.pkpass", "100"), (500, "application/vnd.apple.pkpass", "100"), (200, "application/vnd.apple.pkpass", "2097153")] {
            let response = try #require(HTTPURLResponse(url: url, statusCode: status, httpVersion: nil, headerFields: ["Content-Type": mime, "Content-Length": length]))
            #expect(throws: StudentWalletError.self) { try StudentWalletClient.validate(response) }
        }
        let valid = try #require(HTTPURLResponse(url: url, statusCode: 200, httpVersion: nil, headerFields: ["Content-Type": "application/vnd.apple.pkpass"]))
        try StudentWalletClient.validate(valid)
    }
}
