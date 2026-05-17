# PoetryDB

Official pages manually reviewed:
- https://raw.githubusercontent.com/thundercomb/poetrydb/master/README.md
- https://poetrydb.org/

## Overview
- Public API base URL used in the official README examples: `https://poetrydb.org`
- Authentication: none mentioned
- Response formats documented: JSON by default, optional plain text with `.text`

Manual route count confirmed from the official docs: **6**.

## Confirmed route families
The README documents one general route template:

```text
/<input field>/<search term>[;<search term>][..][:<search type>][/<output field>][,<output field>][..][.<format>]
```

Confirmed input-field families:
- `GET /author/...`
- `GET /title/...`
- `GET /lines/...`
- `GET /linecount/...`
- `GET /poemcount/...`
- `GET /random/...`

## Confirmed parameters and modifiers
- `<search type>`: `:abs` for exact matching; empty means partial matching
- Output fields can be any combination of `author`, `title`, `lines`, and `linecount`
- `all` returns the full poem object
- Formats: `.json` or `.text`
- Multiple search terms are separated with semicolons

## Response notes
- Full poem objects include `title`, `author`, `lines`, and `linecount`
- Collection endpoints like `/author` and `/title` can return top-level arrays such as `authors[]` or `titles[]`
- `.text` responses flatten the selected output fields into plain text

## Rate limits
No numeric rate limit is published in the reviewed README.

## Pagination
No pagination scheme is documented in the reviewed README.

## Errors
The reviewed README does not publish a dedicated error schema table.

## Important usage notes
- The API is shape-driven: the same path grammar works across multiple searchable poem fields.
- `random` and `poemcount` are documented as mutually exclusive.
- For deterministic fireROUTE mappings, treat the input-field families as the stable route surface and the output/format suffixes as modifiers.

## fireROUTE notes
- Expose the six documented input-field families rather than hard-coding only example URLs.
- Preserve semicolon-separated search terms and `:abs` matching semantics.
- Allow output-field and format suffix passthrough because the official API encodes them in the path, not query params.
