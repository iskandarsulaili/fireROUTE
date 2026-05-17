# RuneScape

## Overview
- Provider: RuneScape / Old School RuneScape public APIs documented on the official RuneScape Wiki API page
- Category: Games & Comics
- Official docs: `https://runescape.wiki/w/Application_programming_interface`
- Base URLs:
  - `https://secure.runescape.com`
  - `https://apps.runescape.com`
  - `https://www.runescape.com`
  - `https://content.runescape.com`
- Auth: no API key is documented, but several endpoints require an authenticated RuneScape web session and in some cases a live session token embedded in the path as `c=0`
- HTTPS: yes
- Response formats: JSON, JSONP-style JavaScript, CSV/plain-text `.ws` feeds, binary/text avatar assets, and installer metadata JSON
- Pagination: mixed; some endpoints use `page` starting at `0`, some use `page` starting at `1`, some use `size`, and the friends-list endpoint uses `resultsPerPage` + `currentPage`
- Rate limits: no explicit public rate-limit policy is documented on the official page
- CORS: the official page explicitly warns that most official RuneScape APIs do not send the CORS headers needed for frontend use on external sites
- Confirmed routes: `43`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/m=itemdb_rs/api/info.json` | none | Grand Exchange database configuration metadata. |
| GET | `/m=itemdb_rs/api/catalogue/category.json` | `category` query | Returns per-letter item counts for one GE category. |
| GET | `/m=itemdb_rs/api/catalogue/items.json` | `category`, `alpha`, `page` query | Returns item list for one category/letter page. `page` starts at `1`. |
| GET | `/m=itemdb_rs/api/catalogue/detail.json` | `item` query | Returns one GE item detail record. |
| GET | `/m=itemdb_rs/obj_big.gif` | `id` query | Large GE item image. |
| GET | `/m=itemdb_rs/obj_sprite.gif` | `id` query | Small GE item sprite. |
| GET | `/m=itemdb_rs/api/graph/{item}.json` | `item` path | Returns 180-day GE daily and average price history for one item. |
| GET | `/m=hiscore/ranking.json` | `table`, `category`, `size` query | Returns up to top 50 players for one RuneScape skill/activity leaderboard. |
| GET | `/c={session}/m=hiscore/userRanking.json` | `session` path fragment | Logged-in user's overall hiscore rank; official docs use `c=0` as placeholder for current session id. |
| GET | `/m=hiscore/index_lite.ws` | `player` query | RuneScape hiscores lite feed. |
| GET | `/m=hiscore_ironman/index_lite.ws` | `player` query | RuneScape Ironman hiscores lite feed. |
| GET | `/m=hiscore_hardcore_ironman/index_lite.ws` | `player` query | RuneScape Hardcore Ironman hiscores lite feed. |
| GET | `/m=hiscore_leagues/index_lite.ws` | `player` query | RuneScape Leagues hiscores lite feed. |
| GET | `/m=temp-hiscores/getRankings.json` | `player`, optional `status` query | Seasonal hiscore results for one player; `status=archived` returns past seasonals. |
| GET | `/m=temp-hiscores/getHiscoreDetails.json` | optional `status` query | Seasonal event metadata; `status=archived` returns previous events. |
| GET | `/m=clan-hiscores/clanRanking.json` | none | Top three clans. |
| GET | `/c={session}/m=clan-hiscores/userClanRanking.json` | `session` path fragment | Logged-in user's clan and clan rank. |
| GET | `/m=clan-hiscores/members_lite.ws` | `clanName` query | CSV/plain-text clan member list sorted by clan rank. |
| GET | `/m=group_hiscores/v1//groups` | `groupSize`, `size`, `bossId`, `page` query | Boss group-hiscore board. Official docs show the double slash before `groups`. |
| GET | `/m=runescape_gim_hiscores//v1/groupScores` | `groupSize`, `size`, `page`, `isCompetitive` query | Group Ironman hiscore board. Official docs show the double slash before `v1`. |
| GET | `/m=hiscore_oldschool/index_lite.ws` | `player` query | Old School RuneScape hiscores lite feed. |
| GET | `/m=hiscore_oldschool/index_lite.json` | `player` query | Old School RuneScape hiscores JSON variant. |
| GET | `/m=hiscore_oldschool_ironman/index_lite.ws` | `player` query | OSRS Ironman hiscores lite feed. |
| GET | `/m=hiscore_oldschool_hardcore_ironman/index_lite.ws` | `player` query | OSRS Hardcore Ironman hiscores lite feed. |
| GET | `/m=hiscore_oldschool_ultimate/index_lite.ws` | `player` query | OSRS Ultimate Ironman hiscores lite feed. |
| GET | `/m=hiscore_oldschool_deadman/index_lite.ws` | `player` query | OSRS Deadman Mode hiscores lite feed. |
| GET | `/m=hiscore_oldschool_seasonal/index_lite.ws` | `player` query | OSRS Seasonal hiscores lite feed. |
| GET | `/m=hiscore_oldschool_tournament/index_lite.ws` | `player` query | OSRS Tournament hiscores lite feed. |
| GET | `/m=hiscore_oldschool_fresh_start/index_lite.ws` | `player` query | OSRS Fresh Start Worlds hiscores lite feed. |
| GET | `/m=mtxn_rs_shop/api/config` | `context[0]` query | Solomon's General Store configuration. |
| GET | `/m=website-data/playerDetails.ws` | `names`, optional JSONP callback params | Batch player title/clan details. |
| GET | `/c={session}/m=website-data/playerFriendsDetails.json` | `session` path fragment, `resultsPerPage`, `currentPage`, optional callback params | Logged-in player's friends list. Official page says `resultsPerPage` max is `24`. |
| GET | `/m=adventurers-log/avatardetails.json` | `details` query | Adventurer's Log avatar equipment data. |
| GET | `/m=avatar-rs/{name}/appearance.dat` | `name` path | Raw avatar appearance data used by `avatardetails`. |
| GET | `/m=avatar-rs/{name}/chat.png` | `name` path | Avatar portrait image. Use `%20` for spaces in names. |
| GET | `/runemetrics/profile/profile` | `user`, `activities` query | RuneMetrics player profile, skills, quest totals, and recent activity. |
| GET | `/runemetrics/xp-monthly` | `searchName`, `skillid` query | Monthly XP history for one skill. |
| GET | `/runemetrics/quests` | `user` query | Quest completion data. |
| GET | `/player_count.js` | `varname`, optional `callback`, cache-buster query | Current combined RuneScape + OSRS online-player count. Official docs say `varname` is always `iPlayerCount`. |
| GET | `/m=account-creation-reports/rsusertotal.ws` | none | Total number of RuneScape-accessible accounts created. |
| GET | `/downloads/changelog.json` | none | Latest NXT client changelog. |
| GET | `/downloads-info/windows/RuneScape-Setup.exe.json` | none | Windows installer metadata including file size and CRC. |
| GET | `/downloads-info/osx/RuneScape.dmg.json` | none | macOS installer metadata including file size and CRC. |

## Parameter and schema notes
- General query/path conventions:
  - `player`, `user`, `searchName`, and avatar path names are player-name selectors.
  - `category` in Grand Exchange catalogue routes is a numeric GE category id.
  - `alpha` is a lowercase starting letter for item browsing; items starting with numbers must use `%23` instead of `#`.
  - `item` is a Grand Exchange item id.
  - `table`, `category`, and `size` on `/m=hiscore/ranking.json` select the leaderboard and requested row count; the official docs cap `size` at `50`.
  - `groupSize`, `bossId`, `size`, and `page` drive the boss and GIM board endpoints.
  - `status=archived` is the documented switch for historical seasonal data.
- Session/cookie-dependent routes:
  - The official docs explicitly say `/c={session}/m=hiscore/userRanking.json`, `/c={session}/m=clan-hiscores/userClanRanking.json`, and `/c={session}/m=website-data/playerFriendsDetails.json` require the current logged-in RuneScape web session id in the `c=` path fragment.
  - `playerDetails.ws` can expose `world` and `online` only when called with appropriate authenticated runescape.com cookies and when the target player's privacy settings allow it.
- RuneMetrics-specific fields documented on the official page:
  - `/runemetrics/profile/profile` returns totals such as `totalskill`, `totalxp`, `combatlevel`, quest counts, `activities`, and a `skillvalues` array.
  - `/runemetrics/xp-monthly` returns `monthlyXpGain` data with `averageXpGain`, `monthData`, `skillId`, `totalGain`, and `totalXp`.
  - `/runemetrics/quests` returns an array of quest objects with `title`, `status`, `difficulty`, `members`, `questPoints`, and `userEligible`.

## Format, pagination, and error notes
- Formats:
  - Grand Exchange, seasonal, clan ranking, group-hiscore, GIM, RuneMetrics, and download metadata routes are JSON.
  - `playerDetails.ws`, `player_count.js`, and some website-data routes are documented for JSONP-style use.
  - `index_lite.ws`, `members_lite.ws`, and `rsusertotal.ws` are `.ws` text feeds rather than JSON.
  - `obj_big.gif`, `obj_sprite.gif`, and `chat.png` are image assets; `appearance.dat` is raw avatar detail data.
- Pagination:
  - `/m=itemdb_rs/api/catalogue/items.json` uses `page` beginning at `1`.
  - `/m=group_hiscores/v1//groups` and `/m=runescape_gim_hiscores//v1/groupScores` expose `page`, `size`, `totalPages`, `totalElements`, and related paging fields; examples use `page=0`.
  - `/c={session}/m=website-data/playerFriendsDetails.json` uses `resultsPerPage` and `currentPage`, and the official docs cap `resultsPerPage` at `24`.
- Errors and live behavior seen in this pass:
  - A live request to `https://secure.runescape.com/m=itemdb_rs/api/info.json` returned JSON like `{"lastConfigUpdateRuneday":8841}`.
  - A live request to `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=zezima` returned the expected line-oriented hiscores feed.
  - A live request to `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=this_user_should_not_exist_zzzz` produced the generic RuneScape site `Page not found` HTML, so invalid usernames do not have one consistent JSON/text error schema.
  - A live request to `https://apps.runescape.com/runemetrics/profile/profile?user=zezima&activities=1` returned `{"error":"PROFILE_PRIVATE","loggedIn":"false"}`, confirming at least one RuneMetrics error payload shape for private profiles.

## Important usage notes
- The official wiki page says most official RuneScape APIs should be called from a backend because they generally do not emit CORS headers suitable for third-party frontend sites.
- The official page documents several endpoints that depend on the caller being logged in to runescape.com and sending the right cookies; do not treat those as anonymous public APIs.
- The official page includes a `Bestiary API` heading, but the current page content does not expose a usable endpoint pattern there; it is not counted in the confirmed route total.
- The page also mentions MediaWiki developer resources for the RuneScape Wiki itself, but those wiki APIs are separate from the RuneScape/OSRS game-service endpoints and are not counted here.
- The official route examples preserve unusual path spellings such as double slashes in `/m=group_hiscores/v1//groups` and `/m=runescape_gim_hiscores//v1/groupScores`; the manual doc keeps those exact documented paths rather than normalizing them away.

## Integration notes for fireROUTE
- Model this provider as a multi-origin read-mostly API family rather than one clean single-base REST service.
- Preserve route-level response-format differences: JSON, JSONP-ish JavaScript, plain-text `.ws` feeds, and binary asset endpoints all coexist here.
- Treat session-bound `/c={session}/...` routes as privileged browser-session endpoints, not interchangeable with anonymous API calls.
- Keep pagination semantics per endpoint instead of trying to infer one global convention.
- Expect inconsistent failure behavior across families; some errors are JSON, others are generic RuneScape HTML pages.

## Sources inspected
- `https://runescape.wiki/w/Application_programming_interface`
- `https://secure.runescape.com/m=itemdb_rs/api/info.json`
- `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=zezima`
- `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=this_user_should_not_exist_zzzz`
- `https://apps.runescape.com/runemetrics/profile/profile?user=zezima&activities=1`
