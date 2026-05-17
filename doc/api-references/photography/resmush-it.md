# ReSmush.it

## Overview
- Provider: reSmush.it API
- Category: Photography
- Official docs: `https://resmush.it/api/`
- Base URLs seen in the inspected docs: `https://api.resmush.it/ws.php` for URL-based GET compression and `http://api.resmush.it/` for direct upload examples
- Auth: none
- HTTPS: the docs page is HTTPS; the API examples include both `https://api.resmush.it/ws.php` and `http://api.resmush.it/`
- Response format: JSON (`XML is deprecated` per the inspected docs)
- Pagination: none
- Rate limits: the docs say the API is free with no usage restriction except uploaded-file size limits for personal use only

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/ws.php` | required `img`; optional `qlty`; optional `exif` | Compress an image referenced by URL and return JSON metadata including the optimized image URL. |
| POST | `/` | file upload in `files`; optional `qlty` | Recommended direct-upload method from the official PHP example. The docs note the service can also accept `POST – Parameter img` and `FILES – Binary sent files`. |

Confirmed route count: **2**.

## Parameter and format notes
- `img` — source image URL for GET-based compression.
- `qlty` — JPG quality from `0` to `100`; the docs say the default is `92` and recommend values above `90` for good quality.
- `exif=true` — preserve EXIF data; default behavior is to remove EXIF.
- The output JSON can include: `src`, `dest`, `src_size`, `dest_size`, `percent`, `expires`, `error`, `error_log`.

## Request header notes
The official docs explicitly say these request headers/details are mandatory for security reasons:
- custom `User-Agent`
- website `Referer`

## Error notes
The inspected docs list these service-specific errors:
- `301` — old endpoint used
- `400` — no image URL provided
- `401` — image cannot be fetched from URL
- `402` — image cannot be fetched from `$_FILES`
- `403` — forbidden file format
- `404` — unknown method or resource
- `501` — internal error creating local copy
- `502` — image too large (must be less than 5 MB)
- `503` — optimization server could not be reached
- `504` — image could not be retrieved from reSmush.it servers

## Usage notes
- The docs say the API is provided for free and, as of March 2024, has no usage restriction except file-size limits for personal use.
- For business or commercial use, the docs direct users to contact reSmush.it for a personalized solution.
- The docs also say reSmush.it is compatible with the old Yahoo Smush.it calling style.

## fireROUTE integration notes
- Model this provider as a compact image-optimization API with two practical entry modes: URL compression and direct file upload.
- Preserve required caller identity headers (`User-Agent`, `Referer`) in any adapter guidance.
- Expect JSON only for new integrations; the docs explicitly mark XML as deprecated.

## Sources inspected
- `https://resmush.it/api/`
