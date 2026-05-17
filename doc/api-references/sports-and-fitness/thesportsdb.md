# TheSportsDB

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `thesportsdb`
- Official docs/pages used:
  - `https://www.thesportsdb.com/api.php`
  - `https://www.thesportsdb.com/documentation`
  - `https://www.thesportsdb.com/docs_api_examples`
  - `https://www.thesportsdb.com/api/spec/v1/openapi.yaml`
  - `https://www.thesportsdb.com/api/spec/v2/openapi.yaml`
- Current API base URLs:
  - `https://www.thesportsdb.com/api/v1/json/{APIKEY}`
  - `https://www.thesportsdb.com/api/v2/json`
- Auth model:
  - v1 uses a numeric API key in the URL path. The docs explicitly publish free key `123` and say premium users replace it with their own key.
  - v2 uses the `X-API-KEY` request header and is documented as premium-only.
- Response format: JSON throughout the docs; the examples page also shows v1 browser-friendly testing and v2 header-based API clients.
- Public rate-limit note: the documentation page says Free users get `30` requests/minute, Premium `100`/minute, and Business `120`/minute. Exceeding the limit returns HTTP `429` and requests resume after waiting.
- Manually confirmed route count: `78` (`35` v1 routes + `43` v2 routes)

## Canonical endpoints

### v1 search endpoints
1. `GET /searchteams.php`
2. `GET /searchevents.php`
3. `GET /searchplayers.php`
4. `GET /searchvenues.php`

### v1 lookup endpoints
5. `GET /lookupleague.php`
6. `GET /lookuptable.php`
7. `GET /lookupteam.php`
8. `GET /lookupequipment.php`
9. `GET /lookupplayer.php`
10. `GET /lookuphonours.php`
11. `GET /lookupformerteams.php`
12. `GET /lookupmilestones.php`
13. `GET /lookupcontracts.php`
14. `GET /lookupevent.php`
15. `GET /eventresults.php`
16. `GET /lookuplineup.php`
17. `GET /lookuptimeline.php`
18. `GET /lookupeventstats.php`
19. `GET /lookuptv.php`
20. `GET /lookupvenue.php`

### v1 list/schedule/video endpoints
21. `GET /all_sports.php`
22. `GET /all_countries.php`
23. `GET /all_leagues.php`
24. `GET /search_all_leagues.php`
25. `GET /search_all_seasons.php`
26. `GET /search_all_teams.php`
27. `GET /lookup_all_players.php`
28. `GET /eventsnext.php`
29. `GET /eventslast.php`
30. `GET /eventsnextleague.php`
31. `GET /eventspastleague.php`
32. `GET /eventsday.php`
33. `GET /eventsseason.php`
34. `GET /eventstv.php`
35. `GET /eventshighlights.php`

### v2 search endpoints
36. `GET /search/league/{leagueName}`
37. `GET /search/team/{teamName}`
38. `GET /search/player/{playerName}`
39. `GET /search/event/{eventName}`
40. `GET /search/venue/{venueName}`

### v2 lookup endpoints
41. `GET /lookup/league/{idLeague}`
42. `GET /lookup/team/{idTeam}`
43. `GET /lookup/team_equipment/{idTeam}`
44. `GET /lookup/player/{idPlayer}`
45. `GET /lookup/player_contracts/{idPlayer}`
46. `GET /lookup/player_honours/{idPlayer}`
47. `GET /lookup/player_milestones/{idPlayer}`
48. `GET /lookup/player_teams/{idPlayer}`
49. `GET /lookup/event/{idEvent}`
50. `GET /lookup/event_lineup/{idEvent}`
51. `GET /lookup/event_results/{idEvent}`
52. `GET /lookup/event_stats/{idEvent}`
53. `GET /lookup/event_timeline/{idEvent}`
54. `GET /lookup/event_tv/{idEvent}`
55. `GET /lookup/event_highlights/{idEvent}`
56. `GET /lookup/venue/{idVenue}`

### v2 list/filter/all endpoints
57. `GET /list/teams/{idLeague}`
58. `GET /list/seasons/{idLeague}`
59. `GET /list/seasonposters/{idLeague}`
60. `GET /list/players/{idTeam}`
61. `GET /filter/tv/day/{date}`
62. `GET /filter/tv/country/{country}`
63. `GET /filter/tv/sport/{sport}`
64. `GET /filter/tv/channel/{channel}`
65. `GET /all/countries`
66. `GET /all/sports`
67. `GET /all/leagues`

### v2 schedule and livescore endpoints
68. `GET /schedule/next/league/{idLeague}`
69. `GET /schedule/previous/league/{idLeague}`
70. `GET /schedule/next/team/{idTeam}`
71. `GET /schedule/previous/team/{idTeam}`
72. `GET /schedule/next/venue/{idVenue}`
73. `GET /schedule/previous/venue/{idVenue}`
74. `GET /schedule/full/team/{idTeam}`
75. `GET /schedule/league/{idLeague}/{season}`
76. `GET /livescore/{sport}`
77. `GET /livescore/{leagueId}`
78. `GET /livescore/all`

## Parameters and filtering notes
### v1 query parameters explicitly documented in the docs/OpenAPI
- Search parameters: `t`, `e`, `s`, `d`, `p`, `v`, and `f`.
- Lookup/list parameters: `id`, `l`, `c`, and `a`.
- Artwork-related switches visible in the OpenAPI: `poster` and `badge`.
- The v1 docs page also shows some per-endpoint free-tier result limits, for example search endpoints limited to one result on the free key while premium keys unlock larger limits.

### v2 path parameters explicitly documented in the OpenAPI
- Search names: `leagueName`, `teamName`, `playerName`, `eventName`, `venueName`.
- Lookup/list IDs: `idLeague`, `idTeam`, `idPlayer`, `idEvent`, `idVenue`, `leagueId`.
- TV and schedule filters: `date`, `country`, `sport`, `channel`, `season`.

### Auth parameters
- v1 embeds the API key directly in the path segment after `/api/v1/json/`.
- v2 requires `X-API-KEY` in the header.

## Authentication and access notes
- The docs say the free API remains available, but some methods are limited and premium keys unlock larger limits and newer features.
- The free key explicitly published on the docs site is `123`.
- The docs describe v2 as the only version that will continue receiving future development.
- The examples page shows `curl`, PHP, Python, and JavaScript snippets for both v1 and v2.

## Response, rate-limit, and error notes
- The docs are built around REST/JSON usage.
- The documentation page says v2 returns standard HTTP response codes when something goes wrong.
- Exceeding your minute limit returns HTTP `429`.
- The docs site links official Readme.io references, OpenAPI specs, Postman collections, and MCP specs for both API versions.

## Usage notes from the official docs
- The site positions v1 as simpler and browser-friendly because the API key lives in the URL.
- The site positions v2 as the more secure and more modern API because auth moves to headers.
- Premium v2 access is also marketed as including livescores, video highlights, and other upgraded features.
- Image URLs returned by the API can be resized by appending `/medium`, `/small`, or `/tiny` to the image URL path according to the docs.

## fireROUTE normalization notes
- Treat v1 and v2 as separate surfaces because auth, route design, and some feature availability differ materially.
- Preserve v1 endpoint names exactly, including the historical `.php` suffixes.
- Preserve v2 path-parameter names exactly because the official OpenAPI uses semantic placeholders like `leagueName`, `idLeague`, and `season`.
- Expose minute-limit handling and `429` retry behavior in any adapter because the official docs publish hard per-minute caps.