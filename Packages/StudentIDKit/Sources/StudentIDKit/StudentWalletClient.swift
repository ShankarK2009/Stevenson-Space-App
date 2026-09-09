import Foundation

public enum StudentWalletError: Error, LocalizedError {
    case invalidResponse, serviceUnavailable, rateLimited, tooLarge, mismatchedPass

    public var errorDescription: String? {
        switch self {
        case .invalidResponse, .mismatchedPass:
            return "The Wallet service returned an invalid or different ID. Your saved ID has not changed."
        case .serviceUnavailable:
            return "The Wallet service is unavailable. Try again later."
        case .rateLimited:
            return "Too many Wallet requests. Wait a few minutes before trying again."
        case .tooLarge:
            return "The Wallet pass is too large to open. Try again later."
        }
    }
}

/// Ephemeral, bounded transport. Never redirect student information to another
/// URL, cache a pass to disk, retry issuance automatically, or log response data.
public final class StudentWalletClient: NSObject, URLSessionTaskDelegate, @unchecked Sendable {
    public static let maximumPassBytes = 2 * 1024 * 1024

    public func fetch(_ request: StudentWalletRequest,
                      configuration: StudentWalletConfiguration) async throws -> Data {
        let settings = URLSessionConfiguration.ephemeral
        settings.timeoutIntervalForRequest = 30
        settings.timeoutIntervalForResource = 45
        settings.urlCache = nil
        settings.httpCookieStorage = nil
        let session = URLSession(configuration: settings, delegate: self, delegateQueue: nil)
        defer { session.invalidateAndCancel() }
        var http = URLRequest(url: configuration.endpoint)
        http.httpMethod = "POST"
        http.setValue("application/json", forHTTPHeaderField: "Content-Type")
        http.setValue("application/vnd.apple.pkpass", forHTTPHeaderField: "Accept")
        http.setValue("no-store", forHTTPHeaderField: "Cache-Control")
        http.httpBody = try request.encoded()
        let (bytes, response) = try await session.bytes(for: http)
        try Self.validate(response)
        var data = Data()
        for try await byte in bytes {
            try Task.checkCancellation()
            guard data.count < Self.maximumPassBytes else { throw StudentWalletError.tooLarge }
            data.append(byte)
        }
        guard !data.isEmpty else { throw StudentWalletError.invalidResponse }
        return data
    }

    static func validate(_ response: URLResponse) throws {
        guard let response = response as? HTTPURLResponse else { throw StudentWalletError.invalidResponse }
        if response.statusCode == 429 { throw StudentWalletError.rateLimited }
        guard response.statusCode == 200 else { throw StudentWalletError.serviceUnavailable }
        guard response.mimeType?.lowercased() == "application/vnd.apple.pkpass" else {
            throw StudentWalletError.invalidResponse
        }
        guard response.expectedContentLength <= maximumPassBytes else { throw StudentWalletError.tooLarge }
    }

    public func urlSession(_ session: URLSession, task: URLSessionTask,
                           willPerformHTTPRedirection response: HTTPURLResponse,
                           newRequest request: URLRequest,
                           completionHandler: @escaping (URLRequest?) -> Void) {
        completionHandler(nil)
    }
}
