# Cloudmersive Document and Data Conversion

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `cloudmersive-document-and-data-conversion`
- Docs/pages reviewed manually:
  - `https://cloudmersive.com/convert-api`
  - `https://api.cloudmersive.com/docs/convert.asp`
  - `https://api-console.cloudmersive.com/swagger/index.html?urls.primaryName=Convert%20API`
- Confirmed API base URL: `https://api.cloudmersive.com`
- Confirmed API style: HTTPS REST API with mostly non-versioned `/convert/...` routes
- Primary exchange formats: `multipart/form-data` uploads plus mixed `application/json`, `application/octet-stream`, image, HTML, PDF, and text responses
- Manually confirmed routes in this pass: `319`
- Route-method breakdown confirmed from the current official reference:
  - `315` `POST`
  - `4` `GET`

## What the official docs confirm
- Cloudmersive publishes a large document/data-conversion surface rooted at `https://api.cloudmersive.com`.
- The official Convert API reference currently exposes `319` concrete method+path operations across `16` route families/tags.
- The reviewed docs expose operation-level parameter tables rather than one compact machine-readable OpenAPI document for this product page.
- The API mixes direct conversion, validation, editing, transformation, merge/split, viewer, and zip/archive workflows in one product.
- Many operations accept file uploads as `formData`; many behavior switches are passed in headers rather than JSON bodies.

## Authentication
From the current official Convert API reference:
- Security scheme type: `apiKey`
- Header name: `Apikey`
- Header location: `header`
- The reviewed operation pages consistently show the `Apikey` requirement beside each endpoint.

## Rate limits and pagination
- No global numeric rate-limit ceiling was published on the reviewed landing page or the current API reference page.
- No conventional list-pagination scheme was surfaced in the reviewed Convert API docs.
- The only clearly asynchronous flow in the reviewed pages is the batch-job conversion pattern, which uses a status lookup route instead of a paginated collection.

## Request, format, and parameter conventions
From the reviewed operation pages:
- The API primarily uses `POST` for conversion/edit/transform operations, even for many read-like file-analysis utilities.
- Many routes accept uploaded files with names such as:
  - `inputFile`
  - `inputFile1`
  - `inputFile2`
- Frequently reused header parameters include behavior switches such as:
  - `autorepair`
  - `headersAndFooters`
  - `quality`
  - route-specific flags for formatting, rendering, OCR-like behavior, or output controls
- Output media type varies by operation, including JSON objects, binary file downloads, images, HTML, plain text, and PDFs.
- The web-conversion routes support URL- and HTML-driven rendering flows.
- Template routes support both HTML and DOCX template application.

## Error notes
- The reviewed docs prominently show operation-level `200 OK` success responses.
- The reviewed Convert API page did not expose one global shared error-schema section for this product.
- Authentication is enforced through the `Apikey` header.
- The product landing page and reference do not publish one shared numeric retry/backoff policy.

## Important usage notes
- The compare-document endpoints expose an `advanced` comparison mode that the official page says requires Cloudmersive Managed Instance or Private Cloud deployment.
- The document-editing chunk workflow is explicitly positioned for large files and the temporary editing URL is documented as in-memory only and expiring after `30 minutes`.
- The API includes an asynchronous batch PDF conversion flow:
  - create batch job with `POST /convert/autodetect/to/pdf/batch-job`
  - check status with `GET /convert/batch-job/status`
- A large number of conversion behaviors are controlled with headers rather than nested JSON bodies, so adapters should preserve provider-specific header passthrough.

## Confirmed route surface summary
The current official Convert API reference exposes `319` operations across these route families:
- `ConvertDocument` -> `86`
- `EditDocument` -> `71`
- `ValidateDocument` -> `30`
- `EditPdf` -> `27`
- `MergeDocument` -> `22`
- `ConvertData` -> `18`
- `EditHtml` -> `13`
- `EditText` -> `13`
- `SplitDocument` -> `9`
- `ConvertWeb` -> `8`
- `ZipArchive` -> `7`
- `TransformDocument` -> `6`
- `ConvertImage` -> `4`
- `CompareDocument` -> `2`
- `ConvertTemplate` -> `2`
- `ViewerTools` -> `1`

## Representative exact route inventory from the current official docs
The full surface is too large to inline exhaustively here, but the following routes were directly confirmed from the current first-party reference.

### CompareDocument (`2` routes)
- `POST /convert/compare/docx`
- `POST /convert/compare/doc`

### ConvertData (`18` routes)
Representative routes:
- `POST /convert/csv/to/json`
- `POST /convert/csv/to/xml`
- `POST /convert/xlsx/to/json`
- `POST /convert/xlsx/to/xml`
- `POST /convert/xls/to/json`
- `POST /convert/xml/to/json`
- `POST /convert/xml/select/xpath`
- `POST /convert/xml/query/xquery`
- `POST /convert/xml/query/xquery/multi`
- `POST /convert/xml/edit/xpath/set-value`
- `POST /convert/xml/edit/xpath/replace`
- `POST /convert/xml/transform/xslt/to/xml`
- `POST /convert/json/to/xml`
- `POST /convert/json-string/to/xml`

### ConvertDocument (`86` routes)
Representative routes:
- `POST /convert/docx/to/pdf`
- `POST /convert/docx/to/txt`
- `POST /convert/docx/to/rtf`
- `POST /convert/docx/to/png`
- `POST /convert/docx/to/odt`
- `POST /convert/docx/to/jpg`
- `POST /convert/docx/to/html`
- `POST /convert/doc/to/pdf`
- `POST /convert/doc/to/docx`
- `POST /convert/docx/to/doc`
- `POST /convert/xlsx/to/xls`
- `POST /convert/pptx/to/ppt`
- `POST /convert/pptx/to/pdf`
- `POST /convert/xlsx/to/pdf`
- `POST /convert/xlsx/to/csv`
- `POST /convert/xlsx/to/csv/multi`
- `POST /convert/html/to/pdf`
- `POST /convert/html/to/png`
- `POST /convert/html/to/txt`
- `POST /convert/autodetect/get-info`
- `POST /convert/autodetect/get-icon/advanced`
- `POST /convert/autodetect/get-icon`
- `POST /convert/autodetect/to/pdf`
- `POST /convert/autodetect/to/pdf/batch-job`
- `GET /convert/batch-job/status`
- `POST /convert/autodetect/to/txt`
- `POST /convert/autodetect/to/png`
- `POST /convert/autodetect/to/jpg`
- `POST /convert/autodetect/to/thumbnail/advanced`
- `POST /convert/autodetect/to/thumbnail`
- `POST /convert/pdf/to/png`
- `POST /convert/pdf/to/png/direct`
- `POST /convert/pdf/to/jpg`
- `POST /convert/pdf/to/tiff`
- `POST /convert/png/to/pdf`
- `POST /convert/pdf/to/txt`
- `POST /convert/pdf/to/docx`
- `POST /convert/pdf/to/docx/rasterize`
- `POST /convert/pdf/to/pptx`
- `POST /convert/eml/to/html`
- `POST /convert/msg/to/pdf`
- `POST /convert/odt/to/docx`
- `POST /convert/ods/to/xlsx`
- `POST /convert/odp/to/pptx`
- `POST /convert/key/to/pptx`
- `POST /convert/rtf/to/docx`

### ConvertImage (`4` routes)
- `POST /convert/image/{format1}/to/{format2}`
- `POST /convert/image-multipage/{format1}/to/{format2}`
- `POST /convert/image/set-dpi/{dpi}`
- `POST /convert/image/get-info`

### ConvertTemplate (`2` routes)
- `POST /convert/template/html/apply`
- `POST /convert/template/docx/apply`

### ConvertWeb (`8` routes)
- `POST /convert/web/url/to/screenshot`
- `POST /convert/web/url/to/pdf`
- `POST /convert/web/url/to/txt`
- `POST /convert/web/html/to/pdf`
- `POST /convert/web/html/to/png`
- `POST /convert/web/html/to/txt`
- `POST /convert/html/to/docx`
- `POST /convert/web/md/to/html`

### EditDocument (`71` routes)
Representative routes visible in the current docs include document-session, DOCX, XLSX, and PowerPoint editing helpers such as:
- `POST /convert/edit/begin-editing`
- `POST /convert/edit/begin-editing-chunk`
- `POST /convert/edit/finish-editing`
- `POST /convert/edit/docx/replace-all-multi/edit-session`
- `POST /convert/edit/docx/get-headers-and-footers`
- `POST /convert/edit/docx/set-header`
- `POST /convert/edit/docx/remove-headers-and-footers`
- plus many additional DOCX/XLSX/PPTX inspection and mutation routes listed under the current `EditDocument` tag

### EditHtml (`13` routes)
Representative routes visible in the current docs include HTML cleanup/editing helpers such as:
- HTML sanitization / extraction helpers under the `EditHtml` tag
- HTML manipulation routes documented in the current reference page

### EditPdf (`27` routes)
Representative routes:
- `POST /convert/edit/pdf/optimize/pdf-a`
- plus additional PDF edit, optimize, split, and protection-related helpers documented under the `EditPdf` tag

### EditText (`13` routes)
Representative routes:
- `POST /convert/edit/text/encoding/base64/encode`
- `POST /convert/edit/text/encoding/base64/decode`
- plus additional text transformation helpers under the `EditText` tag

### MergeDocument (`22` routes)
Representative routes:
- `POST /convert/merge/docx`
- `POST /convert/merge/docx/multi`
- plus additional merge helpers for PDF and other office formats under the `MergeDocument` tag

### SplitDocument (`9` routes)
Representative routes:
- split helpers for DOCX, PDF, and other document types under the `SplitDocument` tag

### TransformDocument (`6` routes)
Representative routes:
- transformation helpers documented under the `TransformDocument` tag

### ValidateDocument (`30` routes)
Representative routes visible in the current docs include file-validity checks such as:
- `POST /convert/validate/docx`
- `POST /convert/validate/xlsx`
- `POST /convert/validate/pptx`
- `POST /convert/validate/pdf`
- `POST /convert/validate/eml`
- `POST /convert/validate/msg`
- plus many additional format-specific validation routes under the `ValidateDocument` tag

### ViewerTools (`1` route)
- `POST /convert/viewer/create-web-simple`

### ZipArchive (`7` routes)
- `POST /convert/archive/zip/create`
- `POST /convert/archive/zip/create-encrypted`
- `POST /convert/archive/zip/create-quarantine`
- `POST /convert/archive/zip/create-advanced`
- `POST /convert/archive/zip/extract`
- `POST /convert/archive/zip/encrypt-advanced`
- `POST /convert/archive/zip/decrypt`

## Integration notes for fireROUTE
- Treat Cloudmersive as a large provider-specific passthrough surface rather than a small canonical adapter.
- Preserve header passthrough because many official options are header-controlled.
- Expect mixed binary vs JSON response types depending on route.
- Distinguish synchronous conversions from the documented batch-job status flow.