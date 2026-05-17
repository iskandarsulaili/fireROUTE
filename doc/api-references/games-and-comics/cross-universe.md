# Cross Universe

## Overview
- Provider: `CUA00001` / Cross Universe API by Psychpsyo
- Category: Games & Comics
- Indexed docs URL: `https://crossuniverse.psychpsyo.com/apiDocs.html`
- Official docs reviewed in this pass: `https://crossuniverse.net/apiDocs/`
- Base URL: `https://crossuniverse.net`
- Auth: none documented
- HTTPS: yes
- Response formats: JSON for card data/search, JPEG for card images
- Pagination: none documented
- Rate limits: no numeric rate limit documented on the official docs page
- CORS note: live GET responses in this pass included `Access-Control-Allow-Origin: *`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/images/cards/{lang}/{cardID}.jpg` | `lang` path (`en` or `ja`), `cardID` path | Returns the card image file. Docs say missing cards return `404`. |
| GET | `/cardInfo/` | required `lang`, required `cardID` query parameters | Returns one card object in JSON format. |
| POST | `/cardInfo/` | JSON request body with search fields | Search endpoint; returns a list of card objects matching the provided criteria. |

## GET `/cardInfo/` parameters
- `lang` — required; official docs say `en` and `ja` are the supported values.
- `cardID` — required; card ID without the leading `CU` prefix.

## POST `/cardInfo/` search body
The official docs describe the POST body as a JSON object where any property may be omitted to ignore that filter.

Documented properties:
- `name` — string; searches English and Japanese names, including hiragana for Japanese names.
- `textbox` — string; full-text search against the card text box.
- `cardID` — string; partial ID search is supported; docs also say a leading `CU` is ignored.
- `levels` — array[number]; includes `-1` for cards with `?` level.
- `types` — array[string]; matches the documented base types.
- `cardTypes` — array[string]; matches the documented card-type enum.
- `deckLimit` — string; supports `less`, `more`, `inf`, or an exact numeric value as a string.
- `counters` — array[string]; matches any mentioned counter.
- `attackMin` — number; `-1` means ignore.
- `attackMax` — number; `-1` means ignore.
- `defenseMin` — number; `-1` means ignore.
- `defenseMax` — number; `-1` means ignore.
- `releaseDate` — string in `YYYY-MM-DD` format.
- `illustrator` — string; one of the documented illustrator enum values.
- `idea` — string; one of the documented contest-winner enum values.
- `characters` — string; comma-separated character names, with substring matching.
- `exactCharacters` — array[string]; exact documented character enum values.
- `sortBy` — string; documented values: `level`, `name`, `releaseDate`, `cardID`, `attack`, `defense`.
- `language` — string; `en` or `ja`, default `en`.

## Response notes
The official docs describe the GET card response as a JSON object and the POST search response as a list of the same card objects.

Common documented card fields include:
- `cardID`
- `name`
- `level`
- `cardType`
- `types`
- `effectsPlain`
- `effects`
- `deckLimit`
- `releaseDate`
- `counterMentions`
- `typeMentions`
- `visibleCards`
- `cardMentions`
- `mentionedOn`
- `visibleOn`
- `characters`
- `illustrator`
- `idea`
- `jpSiteLink`
- `webLore`
- `webDescription`
- `variantOf`
- `variant`
- `legacyExID`
- `occasions`
- `novelAppearances`

Japanese-only documented fields:
- `nameHiragana`
- `nameFurigana`

Live sample checks in this pass confirmed JSON responses for `GET /cardInfo/?lang=en&cardID=U00107` and JPEG image responses for `GET /images/cards/en/U00031.jpg`.

## Error handling
Official docs state:
- Image route returns `404` if the card does not exist.
- `GET /cardInfo/` returns `400 Bad Request` for nonexistent cards, unsupported languages, or omitted `cardID` / `lang`.
- `GET /cardInfo/` returns `500 Internal Server Error` for unexpected processing failures.
- `POST /cardInfo/` returns `400 Bad Request` on processing errors and, per the docs, the body will be a list containing three copies of `U00107`.

Live behavior observed in this pass:
- `GET /cardInfo/?lang=en` returned `400`.
- `GET /cardInfo/?lang=en&cardID=NOPE` returned `404`.
- `GET /images/cards/en/NOPE.jpg` returned `404`.
- `GET /cardInfo/?lang=fr&cardID=U00107` returned `200` with the same payload as the English request instead of the documented `400`, so current production behavior appears more permissive than the docs claim.

## Usage notes
- Card IDs used by this API omit the leading `CU`; the docs explicitly call this out.
- `/cardInfo/` is method-sensitive: `GET` fetches a single card by query parameters, while `POST` performs structured search on the same path.
- The docs include extensive enum sections for card types, counters, effect types, base types, characters, illustrators, contest winners, and novel-owner identifiers; preserve those values exactly when building strict integrations.
- The search `language` property affects both returned card language and name-sort behavior.

## Integration notes for fireROUTE
- Model this provider as a compact 3-route API with two JSON operations and one image asset route.
- Keep `cardID` as a query parameter for the single-card lookup, not a path segment.
- Do not prepend `CU` to card IDs sent to the API.
- Treat the invalid-language behavior as implementation drift: the official docs document `400`, but current live behavior fell back to a successful response in this pass.

## Sources inspected
- `https://crossuniverse.psychpsyo.com/apiDocs.html`
- `https://crossuniverse.net/apiDocs/`
- `https://crossuniverse.net/cardInfo/?lang=en&cardID=U00107`
- `https://crossuniverse.net/cardInfo/?lang=en`
- `https://crossuniverse.net/cardInfo/?lang=en&cardID=NOPE`
- `https://crossuniverse.net/cardInfo/?lang=fr&cardID=U00107`
- `https://crossuniverse.net/images/cards/en/U00031.jpg`
- `https://crossuniverse.net/images/cards/en/NOPE.jpg`
