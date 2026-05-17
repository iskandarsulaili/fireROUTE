# Urantia Papers

Official pages manually reviewed:
- https://urantia.dev/
- https://urantia.dev/papers

## Overview
- Public API base URL: `https://api.urantia.dev`
- Authentication: none mentioned on the reviewed public docs pages
- Response format: JSON
- Data coverage claims on the docs: 197 papers, 1,626 sections, and 14,500+ paragraphs

Manual route count confirmed from the reviewed docs: **4**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/toc` | Fetch the full table of contents with parts and nested papers |
| GET | `/papers` | List all papers |
| GET | `/papers/{paper}` | Fetch one full paper |
| GET | `/papers/{paper}/sections` | Fetch section breakdown for a paper |

## Parameters and includes
- `GET /papers?include=topEntities` adds per-paper aggregate entity summaries
- `GET /papers/{paper}?include=entities` adds paragraph-level entity annotations
- `GET /papers/{paper}?include=topEntities` adds only the paper-level aggregate
- The docs also show `include=entities,topEntities`

## Response notes
- `/toc` returns the four parts with nested papers for navigation
- `/papers` returns metadata for all 197 papers, including title, part, and section count
- `/papers/{paper}` returns full paragraphs and the docs explicitly mention `text`, `htmlText`, `standardReferenceId`, audio URLs, and optional entity mentions
- `/papers/{paper}/sections` returns section-level structure for one paper

## Rate limits
No numeric rate limit is published on the reviewed docs pages.

## Pagination
No pagination scheme is documented on the reviewed pages for the listed endpoints.

## Important usage notes
- The docs treat `/papers/{paper}` as the heavy full-content route and `/papers/{paper}/sections` as the lighter navigation route.
- `include=*` parameters materially change payload size.
- The provider publishes a docs index at `https://urantia.dev/llms.txt`.

## fireROUTE notes
- Use `/toc` for navigation/bootstrap, `/papers` for discovery, and `/papers/{paper}` for retrieval.
- Expose the `include` query parameter as passthrough because it is officially documented and useful for enrichment.
