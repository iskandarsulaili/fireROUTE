# Storj

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `storj`
- Official docs/pages reviewed manually:
  - `https://docs.storj.io/dcs/`
  - `https://storj.dev/dcs/api/s3/s3-compatibility`
  - `https://storj.dev/dcs/api/s3/credentials`
  - `https://storj.dev/dcs/api/s3/s3-compatible-gateway`
  - `https://storj.dev/dcs/api/s3/presigned-urls`
  - `https://storj.dev/dcs/api/s3/multipart-upload`
  - `https://storj.dev/dcs/api/s3/object-lock`
  - `https://storj.dev/dcs/api/s3/object-versioning`
- Confirmed API style: S3-compatible object-storage API exposed through Storj's hosted gateway
- Confirmed hosted gateway base URL: `https://gateway.storjshare.io`
- Path style confirmed in official examples: `https://gateway.storjshare.io/{bucket}/{key}`
- Authentication model:
  - S3-compatible access key + secret key + endpoint generated from the Storj console
  - requests use standard S3 authentication/signing semantics against the Storj gateway
  - presigned URL flows are officially documented for unauthenticated upload/download access
- Primary request/response formats:
  - S3-style HTTP API using XML for control/listing/configuration responses
  - raw object bytes for object upload/download operations
  - metadata and compatibility features conveyed through standard S3 headers/query parameters
- Manually confirmed route count in this pass: `42`
- Counting note: `41` supported S3 action families from Storj's compatibility table plus `1` Storj-specific `ListBucketsWithAttribution` extension

## Scope and interpretation notes
- Storj documents this surface by S3 action name rather than by a standalone Storj-only REST reference.
- The method/path patterns below therefore follow the standard S3 REST request forms for the exact actions that Storj's official compatibility pages mark as supported (`Full`, `Partial`, or `Yes`).
- Where Storj documents caveats or feature limits for a supported action, those caveats are called out explicitly below.

## Authentication and onboarding
From the reviewed Storj docs:
- you create S3 credentials in the Storj console under `Access Keys`
- the credentials consist of:
  - access key
  - secret key
  - endpoint
- the console flow lets you choose:
  - `Read`
  - `Write`
  - `List`
  - `Delete`
- the same flow also exposes object-lock permissions:
  - `PutObjectRetention`
  - `GetObjectRetention`
  - `BypassGovernanceRetention`
  - `PutObjectLegalHold`
  - `GetObjectLegalHold`
  - `PutObjectLockConfiguration`
  - `GetObjectLockConfiguration`
- if a project has opted out of Storj-managed passphrases, the docs say you must unlock the bucket with the correct passphrase while creating the S3 credentials
- the hosted gateway page says Storj's S3 authorization service maps the S3-compatible credentials to a Storj access grant
- the hosted gateway page says `https://gateway.storjshare.io` automatically routes traffic to the closest hosted gateway instance
- the presigned URL page shows SDK/client configuration using `endpoint_url="https://gateway.storjshare.io"`

## Common parameters, headers, and request parts
Common path parameters seen across the reviewed S3-compatible actions:
- `{bucket}` - bucket name
- `{key}` - object key/path inside the bucket

Common query patterns and action selectors used by the reviewed compatible surface:
- `?attribution`
- `?location`
- `?notification`
- `?policy`
- `?tagging`
- `?versioning`
- `?uploads`
- `?uploadId={uploadId}`
- `?partNumber={partNumber}`
- `?versions`
- `?list-type=2`
- `?delete`
- `?attributes`
- `?retention`
- `?legal-hold`
- `?object-lock`
- `versionId` for versioned object retrieval/deletion workflows described on the versioning page

Important headers/body elements confirmed in the reviewed docs:
- `x-amz-copy-source` for copy-based flows
- `x-amz-bucket-object-lock-enabled` on `CreateBucket` when enabling object lock
- `x-amz-object-lock-mode`
- `x-amz-object-lock-retain-until-date`
- `X-Amz-Meta-Object-Expires` for Storj's object-level TTL extension
- multipart completion requires part numbers and their corresponding `ETag` values
- presigned URL examples expose standard S3 query-signature fields including:
  - `AWSAccessKeyId`
  - `Signature`
  - `Expires`

## Confirmed route inventory

### Service and bucket-level actions
| Action | Method | Canonical path/query form on `gateway.storjshare.io` | Storj support | Important official notes |
|---|---|---|---|---|
| `ListBuckets` | `GET` | `/` | `Full` | standard S3 bucket listing is supported |
| `ListBucketsWithAttribution` | `GET` | `/?attribution` | `Storj extension` | Gateway-MT-only alternate `ListBuckets` response that adds `<Attribution>` per bucket |
| `CreateBucket` | `PUT` | `/{bucket}` | `Full` | object-lock page says this now accepts `x-amz-bucket-object-lock-enabled` |
| `DeleteBucket` | `DELETE` | `/{bucket}` | `Full` | object-lock page says forced deletion is prevented when locked objects exist |
| `HeadBucket` | `HEAD` | `/{bucket}` | `Full` | bucket existence/metadata check supported |
| `GetBucketLocation` | `GET` | `/{bucket}?location` | `Full` | compatibility page says this is currently supported in `Gateway-MT` only |
| `GetBucketNotification (deprecated)` | `GET` | `/{bucket}?notification` | `Yes` | docs note an AWS CLI JSON-output bug |
| `GetBucketNotificationConfiguration` | `GET` | `/{bucket}?notification` | `Yes` | documented under bucket event notifications |
| `PutBucketNotification (deprecated)` | `PUT` | `/{bucket}?notification` | `Yes` | deprecated action still marked supported |
| `PutBucketNotificationConfiguration` | `PUT` | `/{bucket}?notification` | `Yes` | documented under bucket event notifications |
| `GetBucketPolicy` | `GET` | `/{bucket}?policy` | `Partial` | only in `Gateway-ST` with `--website` |
| `GetBucketTagging` | `GET` | `/{bucket}?tagging` | `Full` | bucket tagging supported |
| `PutBucketTagging` | `PUT` | `/{bucket}?tagging` | `Full` | bucket tagging supported |
| `DeleteBucketTagging` | `DELETE` | `/{bucket}?tagging` | `Full` | bucket tagging deletion supported |
| `GetBucketVersioning` | `GET` | `/{bucket}?versioning` | `Yes` | versioning page documents bucket versioning status retrieval |
| `PutBucketVersioning` | `PUT` | `/{bucket}?versioning` | `Yes` | versioning page documents enable/suspend behavior |
| `GetObjectLockConfiguration` | `GET` | `/{bucket}?object-lock` | `Yes` | returns `ObjectLockConfiguration`; rule omission is noted as initially out of scope |
| `PutObjectLockConfiguration` | `PUT` | `/{bucket}?object-lock` | `Yes` | enables bucket object-lock configuration; optional rule supports days/years |
| `ListMultipartUploads` | `GET` | `/{bucket}?uploads` | `Partial` | only trailing-slash prefixes and `/` delimiter are supported; `UploadIdMarker` and `NextUploadIdMarker` are not supported |
| `ListObjectVersions` | `GET` | `/{bucket}?versions` | `Yes` | versioning page documents listing object versions and delete markers |
| `ListObjects` | `GET` | `/{bucket}` | `Partial` | encrypted keys may not always be returned in decrypted lexicographic order; exhaustive listing behavior depends on prefix/delimiter shape |
| `ListObjectsV2` | `GET` | `/{bucket}?list-type=2` | `Partial` | same listing caveats as `ListObjects` |

### Object-level actions
| Action | Method | Canonical path/query form on `gateway.storjshare.io` | Storj support | Important official notes |
|---|---|---|---|---|
| `PutObject` | `PUT` | `/{bucket}/{key}` | `Full` | object-lock page says locked object versions cannot be overwritten; request may include object-lock headers |
| `GetObject` | `GET` | `/{bucket}/{key}` | `Partial` | compatibility page says `partNumber` is not yet supported; versioning page says specific versions can be retrieved with `versionId` |
| `HeadObject` | `HEAD` | `/{bucket}/{key}` | `Full` | object-lock page says lock mode and lock-expiry metadata are now returned |
| `DeleteObject` | `DELETE` | `/{bucket}/{key}` | `Full` | versioning page says `versionId` permanently deletes that version; object-lock page says deletion is prevented when retention is set |
| `DeleteObjects` | `POST` | `/{bucket}?delete` | `Full` | multi-object delete supported |
| `CopyObject` | `PUT` | `/{bucket}/{key}` | `Full` | use copy semantics via `x-amz-copy-source`; compatibility page says Storj does not fail copies over 5 GB and currently supports copy size up to about `671 GB` |
| `GetObjectAttributes` | `GET` | `/{bucket}/{key}?attributes` | `Partial` | compatibility page says only `Etag`, `StorageClass`, and `ObjectSize` are supported |
| `GetObjectTagging` | `GET` | `/{bucket}/{key}?tagging` | `Full` | docs note tags can also be modified outside tagging endpoints |
| `PutObjectTagging` | `PUT` | `/{bucket}/{key}?tagging` | `Full` | docs note tags can also be modified outside tagging endpoints |
| `DeleteObjectTagging` | `DELETE` | `/{bucket}/{key}?tagging` | `Full` | docs note tags can also be modified outside tagging endpoints |
| `GetObjectRetention` | `GET` | `/{bucket}/{key}?retention` | `Yes` | object-lock retention retrieval supported |
| `PutObjectRetention` | `PUT` | `/{bucket}/{key}?retention` | `Yes` | object-lock retention placement supported |
| `GetObjectLegalHold` | `GET` | `/{bucket}/{key}?legal-hold` | `Yes` | legal-hold retrieval supported |
| `PutObjectLegalHold` | `PUT` | `/{bucket}/{key}?legal-hold` | `Yes` | legal-hold placement supported |

### Multipart-upload actions
| Action | Method | Canonical path/query form on `gateway.storjshare.io` | Storj support | Important official notes |
|---|---|---|---|---|
| `CreateMultipartUpload` | `POST` | `/{bucket}/{key}?uploads` | `Full` | object-lock page says this can also accept object-lock headers |
| `UploadPart` | `PUT` | `/{bucket}/{key}?partNumber={partNumber}&uploadId={uploadId}` | `Full` | multipart page says `partNumber` is client-chosen and between `1` and `2^31`; returned part metadata includes an `ETag` |
| `UploadPartCopy` | `PUT` | `/{bucket}/{key}?partNumber={partNumber}&uploadId={uploadId}` | `Partial` | compatibility page says this is enabled on request |
| `ListParts` | `GET` | `/{bucket}/{key}?uploadId={uploadId}` | `Full` | multipart page says a single listing returns up to `1000` uploaded parts, while the limits table says up to `10000` parts can be returned per list-parts request |
| `CompleteMultipartUpload` | `POST` | `/{bucket}/{key}?uploadId={uploadId}` | `Full` | completion requires the part-number/ETag list gathered during uploads |
| `AbortMultipartUpload` | `DELETE` | `/{bucket}/{key}?uploadId={uploadId}` | `Full` | multipart page says space is freed after active multipart transactions have completed and the abort operation has been called |

## Pagination, limits, formats, and error notes
### Pagination and listing behavior
- `ListObjects` and `ListObjectsV2` are supported, but the compatibility page says encrypted object keys do not always preserve the decrypted lexicographic order expected by S3.
- For encrypted paths:
  - forward-slash-terminated prefixes and `/` delimiters use the fastest listing mode and sort by encrypted-path order
  - non-forward-slash prefixes/delimiters trigger exhaustive gateway-side filtering and then return lexicographic order
- For unencrypted object keys, listing is lexicographic as expected.
- `ListMultipartUploads` has stricter behavior than normal object listing:
  - only prefixes with a trailing `/` are supported
  - only `/` delimiter is supported
  - `UploadIdMarker` and `NextUploadIdMarker` are not supported
- `ListObjectVersions` is documented as available through the S3-compatible versioning feature, but the reviewed Storj pages did not publish a separate Storj-specific pagination note beyond the standard S3 model.

### Published platform limits from the compatibility page
- maximum number of buckets: `100`
- maximum number of objects per bucket: `No limit`
- maximum object size: `No limit`
- minimum object size: `0 B`
- maximum object size per `PUT` operation: `No limit`
- maximum number of parts per upload: `10000`
- minimum multipart part size: `5 MiB` (last part can be `0 B`)
- maximum number of parts returned per list-parts request: `10000`
- maximum number of objects returned per list-objects request: `1000`
- maximum number of multipart uploads returned per list-multipart-uploads request: `1000`
- maximum bucket-name length: `63`
- minimum bucket-name length: `3`
- maximum encrypted object-name length: `1280`
- maximum metadata size: `2 KiB`

### Format notes
- the hosted gateway page explicitly describes the API as HTTP-based and XML-serialized for core S3 compatibility behavior
- list/configuration operations therefore follow S3-style XML response patterns
- object upload and download flows exchange raw object bytes
- presigned URLs are standard signed URL strings rather than a separate JSON API
- Storj's `ListBucketsWithAttribution` extension returns XML that adds an `Attribution` element inside each `Bucket` entry

### Error and compatibility notes
- the reviewed Storj docs did not publish a standalone numeric request-rate or throttling table
- the reviewed Storj docs also did not expose one centralized error-catalog page for this API surface
- the object-lock page says any request that combines Storj object-level TTL with an object-lock retention period is rejected to avoid conflicts
- the compatibility page calls out several supported-but-limited actions:
  - `GetObject` lacks `partNumber` support
  - `GetObjectAttributes` only supports `Etag`, `StorageClass`, and `ObjectSize`
  - `GetBucketPolicy` is only partial and limited to `Gateway-ST` with `--website`
  - `UploadPartCopy` is enabled only on request
- bucket logging is available only upon request

## Important usage notes
- Storj positions this as a drop-in S3-compatible gateway, so adapters should preserve S3 request signing and path/query conventions rather than inventing a Storj-specific JSON abstraction.
- The hosted gateway example endpoint is `https://gateway.storjshare.io`, and the docs say it routes traffic to the nearest hosted gateway location.
- The presigned URL documentation explicitly recommends this flow for unauthenticated uploads/downloads and shows `put_object` and `get_object` generation via boto3.
- The presigned-URL page also notes you can use location-specific endpoints such as `us1`, `eu1`, or `ap1` depending on location, but the reviewed examples explicitly showed the global hosted gateway hostname.
- The versioning page says buckets created before Storj released object versioning cannot have versioning enabled; such buckets remain `Not Supported` and require a new bucket for versioning.
- The object-lock page warns that Governance Mode override permissions can be unintentionally available through default project access, so sensitive lock workflows should use S3 credentials that explicitly restrict that capability.
- The multipart-upload page notes billing begins when multipart parts are stored, even before the multipart upload is completed.
- The compatibility page says only boto3 up to `1.35.99` is currently working normally; because AWS CLI uses boto3 underneath, that caveat applies to AWS CLI as well.
- Storj has a documented object-level TTL extension using `X-Amz-Meta-Object-Expires`, accepting either duration strings such as `+2h` or an RFC3339 timestamp.
- `GetBucketLocation` returns Storj-specific location constraints such as `global-1`, `regional-1`, and `archive-1`, while older projects may still surface legacy constraints such as `global` and `us-select-1`.

## Verification note
This file was manually rebuilt from Storj's current official documentation using browser-based review only.