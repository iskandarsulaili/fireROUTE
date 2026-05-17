# OpenStreetMap

## Provider metadata
- Category: `Geocoding`
- Provider slug: `openstreetmap`
- Docs URL from category index: `https://wiki.openstreetmap.org/wiki/API`
- Manual review outcome: `manual_blocker_documented`
- Official pages checked manually in this pass:
  - `https://wiki.openstreetmap.org/wiki/API`
  - `https://nominatim.org/release-docs/latest/api/Overview/`
- Transport attempted on reviewed pages: `HTTPS`

## What the official pages currently show
- The indexed page `https://wiki.openstreetmap.org/wiki/API` loads successfully as `API - OpenStreetMap Wiki`.
- Its visible lead text says `OpenStreetMap has an editing API for fetching and saving raw geodata from/to the OpenStreetMap database` and explicitly adds `If you just want to embed a map into a webpage, you don't want this API.`
- The same page labels its route section as `REST specifications for the editing API`, confirming that the indexed provider URL documents the editing/data API rather than a geocoding contract.
- The official geocoding-specific alternative `https://nominatim.org/release-docs/latest/api/Overview/` loads as `Overview - Nominatim 5.3.2 Manual`.
- That official Nominatim overview states `This section describes the API V1 of the Nominatim web service` and lists endpoints including `/search`, `/reverse`, `/lookup`, `/status`, `/deletable`, `/polygons`, and `/details`.
- The OpenStreetMap-backed geocoding surface is therefore documented separately under Nominatim, which already has its own provider entry in this category.

## Confirmed API surface for this provider entry
- Confirmed geocoding base URL for the indexed `OpenStreetMap` provider entry: none
- Confirmed geocoding endpoint paths for the indexed `OpenStreetMap` provider entry: none
- Confirmed geocoding methods for the indexed `OpenStreetMap` provider entry: none
- Confirmed geocoding parameters for the indexed `OpenStreetMap` provider entry: none
- Confirmed geocoding authentication contract for the indexed `OpenStreetMap` provider entry: none
- Confirmed geocoding pagination model for the indexed `OpenStreetMap` provider entry: none
- Confirmed geocoding rate-limit policy for the indexed `OpenStreetMap` provider entry: none
- Confirmed geocoding error schema for the indexed `OpenStreetMap` provider entry: none
- Confirmed geocoding response formats for the indexed `OpenStreetMap` provider entry: none
- Confirmed route count for this provider entry: `0`

## Explicit blocker
- The indexed provider page is an OpenStreetMap editing-API reference, not a standalone geocoding contract for this geocoding provider row.
- The official OpenStreetMap-backed geocoding surface is published separately as Nominatim, which already has its own provider entry in this category.
- fireROUTE should keep this `OpenStreetMap` row at `manual_blocker_documented` instead of misclassifying the generic OpenStreetMap API wiki page as geocoding routes.

## Important usage notes
- Do not build a geocoding adapter from the indexed generic OpenStreetMap API wiki page.
- Use the separately documented `Nominatim` provider entry when OpenStreetMap-backed geocoding is required.
- This row should remain blocked unless its source URL is changed to an official geocoding-specific OpenStreetMap surface.

## Verification notes
- This file was manually rebuilt from live official-page checks using browser CDP tools and file tools only.
