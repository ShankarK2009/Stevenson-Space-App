# Apple Wallet integration

The ID tab can request and present a signed personal ID copy. **Signing infrastructure
is not included or deployed.** With no configuration it explains that setup is
pending and continues to offer the existing local scanner. No private key belongs
in the app. Importing remains local; each Wallet request requires an explicit
confirmation before the listed ID fields leave the phone. Photos are never sent.

## Barcode compatibility

Apple documents native Code 39 starting in **iOS 27**. We select it by runtime OS
version without depending on an iOS 27 SDK symbol. Earlier versions are disabled
unless the operator explicitly verifies Code 128 with the school’s actual scanners.
Do not enable the fallback simply because a phone camera can read it. The two
symbologies can produce different scanner identifiers and checksum behavior.
[Apple barcode schema](https://developer.apple.com/documentation/walletpasses/pass/barcodes-data.dictionary)
and [WWDC26 Wallet changes](https://developer.apple.com/videos/play/wwdc2026/209/).

For Code 39, `barcodeMessage` includes the original modulo-43 check character when
required, but no `*` delimiters. For Code 128 it contains only the student number,
including leading zeros; Code 39’s optional check character is never carried over.
The issuer must not add another Code 39 check character. Confirm the actual Wallet
rendering of both checksum variants on an iOS 27 device before enabling production.

Do not substitute a barcode image into a strip/thumbnail or add an untested QR
fallback. Code 128 is unavailable on Apple Watch; the app explicitly describes
that limitation. Native Code 39 on Watch also needs physical-device verification;
this integration makes no Watch-scanning guarantee.
[Apple’s pass design guide](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Creating.html).

## Signing setup

1. In Apple Developer Certificates, Identifiers & Profiles, register a Pass Type
   ID for this app (for example `pass.org.yourorganization.stevenson.id`). Create
   its Pass Type ID certificate using a CSR. This requires an Account Holder or
   Admin. Retain the private key corresponding to that CSR.
2. Install that certificate, its private key, and the appropriate Apple WWDR
   intermediate certificate in your backend’s secret storage. Monitor expiry and
   renew before it expires. Never commit credentials or ship them in an app bundle.
3. Implement the HTTPS endpoint below with a fixed pass template. Create a
   manifest of SHA-1 hashes of every bundle asset, sign it using a detached PKCS #7
   signature including the WWDR certificate, and zip the bundle contents (not an
   enclosing directory) as `.pkpass`. Prefer a maintained signing library. SHA-1
   here is Apple’s manifest format; the request fingerprint uses SHA-256.
4. Supply an appropriate icon and retina variants, truthful issuer branding, and
   issuer support contact information. Keep the description “Personal student ID
   copy” and do not describe it as a school-issued mobile credential or NFC ID.
5. Validate a real signed fixture in Wallet before enabling the endpoint in a
   distributed build. Certificate credentials and device access are required;
   compilation and unit tests cannot establish that Wallet will accept a pass.

Sources: [Apple certificate setup](https://developer.apple.com/help/account/capabilities/create-wallet-identifiers-and-certificates/),
[building and signing passes](https://developer.apple.com/documentation/walletpasses/building-a-pass).

## Build configuration

Set these **user-defined Xcode build settings** on the app target for the intended
configuration (Debug and Release are separate). The project maps them into the
generated Info.plist. They are public configuration, never secrets.

| Build setting | Value |
| --- | --- |
| `STUDENT_WALLET_ENDPOINT` | Final HTTPS issuance URL, with no credentials, query, or fragment |
| `STUDENT_WALLET_PASS_TYPE_IDENTIFIER` | Pass Type ID matching the signing certificate |
| `STUDENT_WALLET_CODE128_SCANNER_VERIFIED` | Leave empty; use `YES` only after school-scanner verification |

Inspect the built app’s Info.plist to confirm these settings resolve. If using an
xcconfig, escape the `//` in an HTTPS URL according to xcconfig syntax rather than
accidentally commenting out its host. No ATS exceptions are needed.

Adding a supplied pass uses `PKAddPassesViewController`; this change does not
request broad Wallet enumeration or Apple Pay entitlements. `containsPass` checks
only the pass just downloaded. There is deliberately no persisted “added” flag:
after app restart the add flow is available again, and the stable serial lets
Wallet identify an existing pass. The same-number pass can be updated through the
system sheet. If you later add enumeration, enable Wallet capability scoped to
this Pass Type ID and update provisioning.
[Apple add-pass controller](https://developer.apple.com/documentation/passkit/pkaddpassesviewcontroller).

## Issuer HTTP contract, version 1

`POST` to the configured endpoint; `Content-Type: application/json`,
`Accept: application/vnd.apple.pkpass`. Input is UTF-8 JSON produced by
`StudentWalletRequest.encoded()`. Optional missing fields are omitted, not null.
An example shape (serial shortened only for illustration):

```json
{
  "version": 1,
  "idNumber": "00123",
  "fullName": "Riley Vásquez",
  "gradeLevel": 12,
  "schoolYearStart": 2026,
  "barcodeFormat": "PKBarcodeFormatCode39",
  "barcodeMessage": "00123",
  "serialNumber": "64 lowercase hexadecimal characters"
}
```

Validate a small bounded request (e.g. 16 KiB), version, types and unknown keys.
Require an ASCII digit number of length 4–8. Preserve it as a string everywhere.
Limit names to a reasonable Unicode length (e.g. 200 characters), disallow control
characters, and treat them as plain text. Grade must be 1–12 and school-year start
2000–2099 when supplied. Reject invalid data; do not silently alter it.

Allow only the two documented barcode formats. Code 128 must equal `idNumber`.
Code 39 must equal `idNumber` or `idNumber` followed by its correct modulo-43 check
character. Apply the scanner-verification gate on the server as well. Recompute
`serialNumber` as lowercase hex SHA-256 of UTF-8
`stevenson-student-id-v1:<idNumber>`; reject any mismatch. The serial is stable
across years to allow replacement and differs across student numbers. It is
predictable and is **not** an authorization credential.

Construct `pass.json` server-side, rather than accepting arbitrary pass files,
URLs, certificate identifiers, or branding from a client. Use these mappings:

| Pass field | Source |
| --- | --- |
| `formatVersion` | `1` |
| `passTypeIdentifier`, `teamIdentifier`, `organizationName` | Fixed issuer configuration |
| `serialNumber` | Validated/recomputed request serial |
| `description` | `Personal student ID copy` |
| `generic.primaryFields` | Student name if present, otherwise student number |
| `generic.secondaryFields` | String student number; grade if present |
| `generic.auxiliaryFields` | School year if present; `Personal copy` notice |
| `generic.backFields` | Issuer contact; personal-copy explanation; manual removal/update instructions |
| `barcodes[0].format` | Validated request barcode format |
| `barcodes[0].message` | Validated request barcode message |
| `barcodes[0].messageEncoding` | `iso-8859-1` |
| `barcodes[0].altText` | Student number |
| `userInfo.studentIDFingerprint` | Lowercase hex SHA-256 of the **exact received HTTP body bytes**, before parsing |
| `sharingProhibited` | `true` (UI restriction, not an anti-copy security boundary) |

Give every generic field a unique `key` and a `label` and `value`. Do not invent
an expiry date from an import timestamp or school-year label: the school’s actual
validity policy is unknown. Do not add NFC, automatic updates, location triggers,
or `webServiceURL` until those features have their own issuer implementation.
[Apple generic pass schema](https://developer.apple.com/documentation/walletpasses/creating-a-generic-pass).

Return `200`, `Content-Type: application/vnd.apple.pkpass`, `Cache-Control: no-store`
and binary signed pass bytes, at most 2 MiB. Errors use appropriate non-200 status
codes; `429` gets a dedicated retry-later message. Do not redirect. The app refuses
all redirects, uses an ephemeral session, times out, bounds the streaming body even
without Content-Length, and permits explicit cancellation. It checks the pass’s
type, serial, and request fingerprint before presenting it. The fingerprint
binds a response to an import revision; the trusted issuer must still render the
correct fields and barcode. It is not a substitute for pass signature validation. PassKit does not expose the
team identifier as a PKPass property; the signing pipeline must ensure pass.json
and the certificate agree on the team. The app pins the globally registered Pass Type ID.

The current client has **no login, App Attest, or bearer-token exchange**. Do not
put a shared API secret in Info.plist. An issuer that requires authenticated
issuance needs a corresponding client authentication flow before activation.
For a personal-copy service, define its abuse controls before exposing it: request
and concurrency limits, per-client rate limits, minimal retention, and no ID/body
logging in application, proxy, analytics, or error reporting. A screenshot is not
proof of identity. Official enrollment/access issuance needs school-backed
verification; the app’s internal initializer and hashes do not provide it.

## Verification before release

Automated tests cover leading zeros, both checksum modes, stable serials,
changed-content fingerprints, missing fields, data minimization, endpoint
validation, OS/scanner gates, and HTTP status/type/size validation. The iOS build
checks the native button and PassKit sheet integration.

With the configured signer and physical devices, verify:

- Add, cancel, swipe-dismiss, repeat-add, and update an existing same-number pass.
  A sheet dismissal must never be reported as proof of addition.
- Delete in Wallet and return to the app; replace/remove the app ID while a
  request is outstanding; cancel then immediately retry; switch tabs mid-request.
- Wrong certificate/type/team/serial/fingerprint, corrupt or expired signatures,
  malformed ZIP, wrong MIME, empty body, chunked body over 2 MiB, timeout, offline,
  redirects, HTTP 429/500, and unsupported/managed devices.
- Long and non-Latin names, absent name/grade/year, leading zeros, four/eight-digit
  IDs, old and unknown school years, hidden photos, VoiceOver, and large text.
- Scan every barcode variant on actual school hardware. Verify Code 39 checksum
  behavior on iOS 27 and explicitly test Code 128 before enabling its flag.
- Confirm no photo/screenshot uploads or disk/network logs of student data.
  Update privacy disclosures to describe the chosen signing service’s processing.

Wallet copies are independent of app storage. Removing/replacing the app ID does
not revoke an already issued pass. Changing student number creates a different
pass; users must remove the old one in Wallet. There is no automatic refresh,
revocation service, NFC credential, or verified enrollment in this change.
