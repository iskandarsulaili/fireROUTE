# Board Game Geek

## Overview
- Provider: BoardGameGeek XML API2
- Category: Games & Comics
- Official docs: `https://boardgamegeek.com/wiki/page/BGG_XML_API2`
- Preferred base URL: `https://boardgamegeek.com/xmlapi2`
- Official alternate base URLs: `https://rpggeek.com/xmlapi2`, `https://videogamegeek.com/xmlapi2`
- Auth: the official XMLAPI2 wiki does not document API keys or OAuth flows and presents the API as public, but live sample requests in this pass returned `401` with `WWW-Authenticate: Bearer realm="xml api"`, so current production auth behavior is stricter than the docs imply
- HTTPS: yes
- Response format: XML
- Pagination: endpoint-specific `page` parameters on forum, thing comments/ratings, user, guild, plays, and collection workflows
- Rate limits: the official docs say to wait about `5` seconds between requests or the server may return `500` or `503` because it is too busy

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/thing` | `id`, `type`, `versions`, `videos`, `stats`, `historical`, `marketplace`, `comments`, `ratingcomments`, `page`, `pagesize`, `from`, `to` | Main item lookup for things such as board games, accessories, videogames, and RPG items. |
| GET | `/family` | `id`, `type` | Family lookup for higher-level families such as `boardgamefamily` and `rpg`. |
| GET | `/forumlist` | `id`, `type` | Lists forums for a `thing` or `family`. |
| GET | `/forum` | `id`, `page` | Returns threads in a forum; docs say page size is `50`. |
| GET | `/thread` | `id`, `minarticleid`, `minarticledate`, `count`, `username` | Returns one forum thread and its articles; docs cap `count` at `1000`. |
| GET | `/user` | `name`, `buddies`, `guilds`, `hot`, `top`, `domain`, `page` | Public user profile and optional buddy/guild/top/hot data. |
| GET | `/guild` | `id`, `members`, `sort`, `page` | Guild info and optional member roster. |
| GET | `/plays` | `username`, `id`, `type`, `mindate`, `maxdate`, `subtype`, `page` | Logged plays by user or by item/family. |
| GET | `/collection` | `username`, `version`, `subtype`, `excludesubtype`, `id`, `brief`, `stats`, ownership/status filters, ratings filters, plays filters, `showprivate`, `collid`, `modifiedsince` | User collection export endpoint; official docs warn it can return queued `202` responses. |
| GET | `/hot` | `type` | Returns one of the documented hot lists. |
| GET | `/search` | `query`, `type`, `exact` | Name search across items in the database. |

Route count note:
- The official XMLAPI2 wiki also has a `Geeklist` heading, but it explicitly says `Not yet updated to XMLAPI2.` It is excluded from the confirmed route count because no XMLAPI2 path or parameters are documented there.

## Parameter details by endpoint

### `/thing`
- `id=NNN` — required for useful results; accepts a comma-delimited list, maximum `20` IDs.
- `type=THINGTYPE` — filters by thing types such as `boardgame`, `boardgameexpansion`, `boardgameaccessory`, `videogame`, `rpgitem`, `rpgissue`.
- `versions=1` — include version info.
- `videos=1` — include videos.
- `stats=1` — include ranking and rating stats.
- `historical=1` — documented as not currently supported.
- `marketplace=1` — include marketplace data.
- `comments=1` — include comments and ratings when commented.
- `ratingcomments=1` — include ratings and comments when rated; docs say it cannot be used together with `comments` because both map to the same XML node and `comments` takes precedence.
- `page=NNN` — paging for historical, comments, and ratings data.
- `pagesize=NNN` — minimum `10`, maximum `100`.
- `from=YYYY-MM-DD`, `to=YYYY-MM-DD` — both documented as not currently supported.

### `/family`
- `id=NNN` — one or more family IDs.
- `type=FAMILYTYPE` — supports `rpg`, `rpgperiodical`, `boardgamefamily`.

### `/forumlist`
- `id=NNN` — database entry ID.
- `type` — `thing` or `family`.

### `/forum`
- `id=NNN` — forum ID.
- `page=NNN` — page size `50`; sorted by most recent post.

### `/thread`
- `id=NNN` — thread ID.
- `minarticleid=NNN` — minimum article ID filter.
- `minarticledate=YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS` — minimum article date/time filter.
- `count=NNN` — maximum `1000` articles.
- `username=NAME` — documented as not currently supported.

### `/user`
- `name=NAME` — single username lookup.
- `buddies=1` — include buddies; paged.
- `guilds=1` — include guilds; paged.
- `hot=1` — include user hot 10 list if present.
- `top=1` — include user top 10 list if present.
- `domain=DOMAIN` — `boardgame`, `rpg`, or `videogame`; default `boardgame`.
- `page=NNN` — controls buddy and guild paging; docs say page size `100` though the current implementation may return `1000`.

### `/guild`
- `id=NNN` — guild ID.
- `members=1` — include member roster.
- `sort=SORTTYPE` — `username` or `date`; default `username`.
- `page=NNN` — page size `25`.

### `/plays`
- `username=NAME` — user whose plays should be returned.
- `id=NNN` plus `type=TYPE` — alternate item/family-based lookup.
- `type=TYPE` — `thing` or `family`.
- `mindate=YYYY-MM-DD`, `maxdate=YYYY-MM-DD` — date range filters.
- `subtype=TYPE` — documented values include `boardgame`, `boardgameexpansion`, `boardgameaccessory`, `boardgameintegration`, `boardgamecompilation`, `boardgameimplementation`, `rpg`, `rpgitem`, `videogame`.
- `page=NNN` — page size `100`.

### `/collection`
- `username=NAME` — user whose collection is requested.
- `version=1` — include version info.
- `subtype=TYPE` — `boardgame`, `boardgameexpansion`, `boardgameaccessory`, `rpgitem`, `rpgissue`, or `videogame`; default `boardgame`.
- `excludesubtype=TYPE` — exclude a subtype.
- `id=NNN` — filter to one or more item IDs.
- `brief=1` — abbreviated results.
- `stats=1` — expanded rating/ranking info.
- Ownership/status filters: `own`, `rated`, `played`, `comment`, `trade`, `want`, `wishlist`, `wishlistpriority`, `preordered`, `wanttoplay`, `wanttobuy`, `prevowned`, `hasparts`, `wantparts`.
- Rating filters: `minrating`, `rating`, `minbggrating`, `bggrating`.
- Play-count filters: `minplays`, `maxplays`.
- `showprivate=1` — only for your own logged-in collection with cookies.
- `collid=NNN` — restrict to a specific collection ID.
- `modifiedsince=YY-MM-DD` or `YY-MM-DD HH:MM:SS` — only changed/added entries since that date.

### `/hot`
Documented `type` values:
- `boardgame`
- `rpg`
- `videogame`
- `boardgameperson`
- `rpgperson`
- `boardgamecompany`
- `rpgcompany`
- `videogamecompany`

### `/search`
- `query=SEARCH_QUERY` — search string; spaces become `+`.
- `type=TYPE` — single or comma-delimited types such as `rpgitem`, `videogame`, `boardgame`, `boardgameaccessory`, `boardgameexpansion`, `boardgamedesigner`.
- `exact=1` — exact-name match mode.

## Response, pagination, and format notes
- The official XMLAPI2 wiki documents XML responses for all routes.
- `/forum` pages thread lists at `50` items per page.
- `/guild` member lists page at `25` items.
- `/plays` pages at `100` records.
- `/thing` comment/rating/history views use `page` and `pagesize`.
- `/user` buddy and guild lists share the same `page` parameter.
- `/collection` may not be ready immediately; the docs explicitly say a `202` response means the export was queued and should be retried later.
- Separate from XMLAPI2, the docs also point to the official CSV dump at `https://boardgamegeek.com/data_dumps/bg_ranks` for names, IDs, ranks, and average ratings across the database.

## Error handling
Official docs and notes reviewed in this pass state:
- Sending requests too frequently may produce `500` or `503` responses because the server is too busy; the docs recommend a roughly five-second delay between requests.
- `/collection` may return `202` while the export is being prepared.
- No formal XML error schema is published on the main XMLAPI2 wiki page.

Live behavior observed in this pass:
- Sample unauthenticated requests to `/thing`, `/search`, and `/hot` returned `401`.
- A sample unauthenticated `/collection` request also returned `401` and exposed `WWW-Authenticate: Bearer realm="xml api"`.
- Because this live behavior conflicts with the public wiki's no-key presentation, integrations should verify current auth requirements before depending on anonymous access.

## Usage notes
- The docs explicitly say requests can be made on any of the three official geek domains and are interchangeable.
- The docs explicitly warn to avoid the `www.` subdomains because they may interfere with request authorization.
- The XMLAPI2 wiki points readers to the official intro guide (`Using the XML API`) and official `XML API terms of use` before integrating heavily.
- On `/collection`, the docs call out a subtype quirk where the default boardgame collection includes expansions but may label them as `boardgame`; the documented workaround is to make a separate `subtype=boardgameexpansion` call and/or use `excludesubtype=boardgameexpansion`.

## Integration notes for fireROUTE
- Model this provider as an 11-route XML API, not JSON.
- Preserve XML semantics and endpoint-specific pagination behaviors instead of flattening everything into one generic list model.
- Treat `/collection` as an asynchronous export-style endpoint because of the documented `202` queue behavior.
- Do not assume anonymous access is still available just because the wiki says so; current live checks in this pass encountered `401` responses.
- Keep the official alternate domains in mind for resilience, but prefer `boardgamegeek.com/xmlapi2` as the canonical base URL.

## Sources inspected
- `https://boardgamegeek.com/wiki/page/BGG_XML_API2`
- `https://boardgamegeek.com/xmlapi2/thing?id=174430&stats=1`
- `https://boardgamegeek.com/xmlapi2/search?query=catan&type=boardgame`
- `https://boardgamegeek.com/xmlapi2/hot?type=boardgame`
- `https://boardgamegeek.com/xmlapi2/collection?username=geekdo`
