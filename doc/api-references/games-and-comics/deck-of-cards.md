# Deck of Cards

## Overview
- Provider: Deck of Cards API
- Category: Games & Comics
- Official docs: `https://deckofcardsapi.com/`
- Base URL: `https://deckofcardsapi.com`
- Auth: none
- HTTPS: yes (the indexed `http://` URL currently redirects to HTTPS)
- Response formats: JSON for API operations; PNG/SVG for card images
- Pagination: none documented
- Rate limits: no numeric rate limit documented on the official site

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/deck/new/shuffle/` | optional `deck_count` | Creates and shuffles one or more new decks. |
| GET | `/api/deck/{deck_id}/draw/` | `deck_id` path; optional `count` | Draw cards from an existing deck. Docs note `deck_id` can be replaced with `new` to shuffle and draw in one request. |
| GET | `/api/deck/{deck_id}/shuffle/` | `deck_id` path | Reshuffles all cards in an existing deck. |
| GET | `/api/deck/{deck_id}/shuffle/` | `deck_id` path; query `remaining=true` | Reshuffles only the remaining cards in the deck. |
| GET | `/api/deck/new/` | optional `jokers_enabled=true` | Creates a new unshuffled deck. |
| GET | `/api/deck/new/shuffle/` | query `cards` | Creates a shuffled partial deck from explicit card codes. |
| GET | `/api/deck/{deck_id}/pile/{pile_name}/add/` | `deck_id`, `pile_name` path; required `cards` | Adds cards to a named pile. |
| GET | `/api/deck/{deck_id}/pile/{pile_name}/shuffle/` | `deck_id`, `pile_name` path | Shuffles a named pile. |
| GET | `/api/deck/{deck_id}/pile/{pile_name}/list/` | `deck_id`, `pile_name` path | Lists cards in one or more piles. |
| GET | `/api/deck/{deck_id}/pile/{pile_name}/draw/` | `deck_id`, `pile_name` path; query `cards` | Draws specific cards from a pile. |
| GET | `/api/deck/{deck_id}/pile/{pile_name}/draw/` | `deck_id`, `pile_name` path; query `count` | Draws a number of cards from a pile. |
| GET | `/api/deck/{deck_id}/pile/{pile_name}/draw/bottom/` | `deck_id`, `pile_name` path | Draws from the bottom of a pile. |
| GET | `/api/deck/{deck_id}/pile/{pile_name}/draw/random/` | `deck_id`, `pile_name` path | Draws random cards from a pile. |
| GET | `/api/deck/{deck_id}/return/` | `deck_id` path | Returns all drawn cards to the deck. |
| GET | `/api/deck/{deck_id}/pile/{pile_name}/return/` | `deck_id`, `pile_name` path | Returns all cards from a pile to the deck. |
| GET | `/api/deck/{deck_id}/return/` | `deck_id` path; query `cards` | Returns specific cards to the deck. |
| GET | `/api/deck/{deck_id}/pile/{pile_name}/return/` | `deck_id`, `pile_name` path; query `cards` | Returns specific cards from a pile to the deck. |
| GET | `/static/img/back.png` | none | Back-of-card image asset documented on the homepage. |

## Parameter and card-code notes
- `deck_count` controls how many standard 52-card decks are combined when creating/shuffling new decks.
- The docs explicitly note `jokers_enabled=true` can be passed as a GET or POST parameter when creating a brand new deck to include both Jokers.
- `cards` accepts comma-separated card codes like `AS,2S,KS`.
- Pile operations do not work with multiple-deck shoes according to the official notes on the page.

## Response format notes
Common response fields shown across the docs examples:
- `success`
- `deck_id`
- `shuffled`
- `remaining`
- `cards[]`
- `piles`

Observed card object fields from the draw examples:
- `code`
- `image`
- `images.svg`
- `images.png`
- `value`
- `suit`

Observed pile response structure includes nested pile names with:
- `remaining`
- optional `cards[]`

## Error handling
- The homepage does not publish a formal error-object schema.
- The API examples only show success payloads.
- Consumers should handle normal HTTP failures for invalid deck IDs, card codes, or impossible pile operations.

## Integration notes for fireROUTE
- This provider is entirely resource-oriented around deck IDs and pile names.
- Preserve the documented route variants for pile drawing and return operations; the docs present them as separate URL forms, not just parameter tweaks.
- Treat `/static/img/back.png` as a documented media helper route rather than a JSON API operation.

## Sources inspected
- `https://deckofcardsapi.com/`
