# Lichess

## Overview
- Provider: Lichess API
- Category: Games & Comics
- Official docs: `https://lichess.org/api`
- Official OpenAPI document: `https://lichess.org/openapi.yaml`
- Base URL: `https://lichess.org`
- Additional documented servers: `https://lichess.dev`, `http://localhost:{port}`, `http://l.org`
- Auth: OAuth2 authorization-code flow with PKCE and personal access tokens via `Authorization: Bearer {token}`
- HTTPS: yes
- Response formats: JSON, PGN, NDJSON, and selected plain-text/export formats
- Confirmed routes: `184`

## Global notes from the official docs
- The official docs page is a Scalar/OpenAPI reference backed by the public `openapi.yaml` file.
- The docs explicitly say all requests go to `https://lichess.org` unless otherwise specified.
- The inspected spec contains `184` operations across users, puzzles, account, games, TV, arena/swiss tournaments, teams, studies, broadcasts, board/bot play, challenges, bulk pairings, OAuth, opening explorer, and tablebase endpoints.
- Some endpoints stream NDJSON rather than returning one JSON document.
- The docs mention several specialized export surfaces: PGN, NDJSON, TRF, and tablebase/opening-explorer style read endpoints.

## Auth and rate limits
- The docs support two official auth patterns:
  - personal access tokens sent as `Authorization: Bearer {token}`
  - OAuth authorization-code flow with PKCE for end-user login and scoped delegated access
- Official PKCE notes from the docs:
  - unregistered/public clients are supported
  - no client authentication is required
  - the only accepted code challenge method is `S256`
  - access tokens are long-lived, expected to last about one year unless revoked
  - refresh tokens are not supported
- Official token-format notes:
  - access tokens and authorization codes match `^[A-Za-z0-9_]+$`
  - applications should safely handle token lengths of at least 512 characters
- Official rate-limit guidance:
  - only make one request at a time
  - if you receive `429`, you exceeded one of the rate limits
  - in most cases, waiting one minute before retrying is enough, though some limits can require longer
- In the inspected spec, `64` routes are explicitly public and `120` inherit token-auth requirements.

## Confirmed endpoint inventory

### Users (13)
- GET `/api/users/status` — Get real-time users status; params: ids* {query}, withSignal {query}, withGameIds {query}, withGameMetas {query}; auth: none; responses: 200.
- GET `/api/player` — Get all top 10; params: none; auth: none; responses: 200.
- GET `/api/player/top/{nb}/{perfType}` — Get one leaderboard; params: nb* {path}, perfType* {path}; auth: none; responses: 200.
- GET `/api/user/{username}` — Get user public data; params: username* {path}, trophies {query}, profile {query}, rank {query}, fideId {query}; auth: OAuth2/PAT; responses: 200.
- GET `/api/user/{username}/rating-history` — Get rating history of a user; params: username* {path}; auth: none; responses: 200.
- GET `/api/user/{username}/perf/{perf}` — Get performance statistics of a user; params: username* {path}, perf* {path}; auth: none; responses: 200.
- GET `/api/user/{username}/activity` — Get user activity; params: username* {path}; auth: none; responses: 200.
- POST `/api/users` — Get users by ID; params: profile {query}, rank {query}; auth: none; responses: 200; request body: yes.
- GET `/api/streamer/live` — Get live streamers; params: none; auth: none; responses: 200.
- GET `/api/crosstable/{user1}/{user2}` — Get crosstable; params: user1* {path}, user2* {path}, matchup {query}; auth: none; responses: 200.
- GET `/api/player/autocomplete` — Autocomplete usernames; params: term* {query}, exists {query}, object {query}, names {query}, friend {query}, team {query}, tour {query}, swiss {query}, teacher {query}; auth: OAuth2/PAT; responses: 200.
- POST `/api/user/{username}/note` — Add a note for a user; params: username* {path}; auth: OAuth2/PAT; responses: 200; request body: yes.
- GET `/api/user/{username}/note` — Get notes for a user; params: username* {path}; auth: OAuth2/PAT; responses: 200.

### Puzzles (11)
- GET `/api/puzzle/daily` — Get the daily puzzle; params: none; auth: none; responses: 200.
- GET `/api/puzzle/{id}` — Get a puzzle by its ID; params: id* {path}; auth: none; responses: 200.
- GET `/api/puzzle/next` — Get a new puzzle; params: angle {query}, difficulty {query}, color {query}; auth: OAuth2/PAT; responses: 200.
- GET `/api/puzzle/batch/{angle}` — Get multiple puzzles at once; params: angle* {path}, difficulty {query}, nb {query}, color {query}; auth: OAuth2/PAT; responses: 200.
- POST `/api/puzzle/batch/{angle}` — Solve multiple puzzles at once; params: angle* {path}, nb {query}; auth: OAuth2/PAT; responses: 200; request body: yes.
- GET `/api/puzzle/activity` — Get your puzzle activity; params: max {query}, before {query}, since {query}; auth: OAuth2/PAT; responses: 200.
- GET `/api/puzzle/replay/{days}/{theme}` — Get puzzles to replay; params: days* {path}, theme* {path}; auth: OAuth2/PAT; responses: 200, 404.
- GET `/api/puzzle/dashboard/{days}` — Get your puzzle dashboard; params: days* {path}; auth: OAuth2/PAT; responses: 200.
- GET `/api/storm/dashboard/{username}` — Get the storm dashboard of a player; params: username* {path}, days {query}; auth: none; responses: 200.
- POST `/api/racer` — Create and join a puzzle race; params: none; auth: OAuth2/PAT; responses: 200.
- GET `/api/racer/{id}` — Get puzzle race results; params: id* {path}; auth: OAuth2/PAT; responses: 200, 404.

### Account (6)
- GET `/api/account` — Get my profile; params: none; auth: OAuth2/PAT; responses: 200.
- GET `/api/account/email` — Get my email address; params: none; auth: OAuth2/PAT; responses: 200.
- GET `/api/account/preferences` — Get my preferences; params: none; auth: OAuth2/PAT; responses: 200.
- GET `/api/account/kid` — Get my kid mode status; params: none; auth: OAuth2/PAT; responses: 200.
- POST `/api/account/kid` — Set my kid mode status; params: v* {query}; auth: OAuth2/PAT; responses: 200.
- GET `/api/timeline` — Get my timeline; params: since {query}, nb {query}; auth: OAuth2/PAT; responses: 200.

### Games (13)
- GET `/game/export/{gameId}` — Export one game; params: gameId* {path}, moves {query}, pgnInJson {query}, tags {query}, clocks {query}, evals {query}, accuracy {query}, opening {query}, division {query}, literate {query}, withBookmarked {query}; auth: none; responses: 200.
- GET `/game/{gameId}/chat` — Fetch the spectator game chat; params: none; auth: none; responses: 200.
- GET `/api/user/{username}/current-game` — Export ongoing game of a user; params: username* {path}, moves {query}, pgnInJson {query}, tags {query}, clocks {query}, evals {query}, accuracy {query}, opening {query}, division {query}, literate {query}; auth: none; responses: 200.
- GET `/api/games/user/{username}` — Export games of a user; params: username* {path}, since {query}, until {query}, max {query}, vs {query}, rated {query}, perfType {query}, color {query}, analysed {query}, moves {query}, pgnInJson {query}, tags {query}, clocks {query}, evals {query}, accuracy {query}, opening {query}, division {query}, ongoing {query}, finished {query}, literate {query}, lastFen {query}, withBookmarked {query}, sort {query}; auth: OAuth2/PAT; responses: 200.
- POST `/api/games/export/_ids` — Export games by IDs; params: moves {query}, pgnInJson {query}, tags {query}, clocks {query}, evals {query}, accuracy {query}, opening {query}, division {query}, literate {query}; auth: none; responses: 200; request body: yes.
- POST `/api/stream/games-by-users` — Stream games of users; params: withCurrentGames {query}; auth: none; responses: 200; request body: yes.
- POST `/api/stream/games/{streamId}` — Stream games by IDs; params: streamId* {path}; auth: none; responses: 200; request body: yes.
- POST `/api/stream/games/{streamId}/add` — Add game IDs to stream; params: streamId* {path}; auth: none; responses: 200; request body: yes.
- GET `/api/account/playing` — Get my ongoing games; params: nb {query}; auth: OAuth2/PAT; responses: 200.
- GET `/api/stream/game/{id}` — Stream moves of a game; params: id* {path}; auth: none; responses: 200, 429.
- POST `/api/import` — Import one game; params: none; auth: OAuth2/PAT; responses: 200; request body: yes.
- GET `/api/games/export/imports` — Export your imported games; params: none; auth: OAuth2/PAT; responses: 200.
- GET `/api/games/export/bookmarks` — Export your bookmarked games; params: since {query}, until {query}, max {query}, moves {query}, pgnInJson {query}, tags {query}, clocks {query}, evals {query}, accuracy {query}, opening {query}, division {query}, literate {query}, lastFen {query}, sort {query}; auth: OAuth2/PAT; responses: 200.

### TV (4)
- GET `/api/tv/channels` — Get current TV games; params: none; auth: none; responses: 200.
- GET `/api/tv/feed` — Stream current TV game; params: none; auth: none; responses: 200.
- GET `/api/tv/{channel}/feed` — Stream current TV game of a TV channel; params: channel* {path}; auth: none; responses: 200.
- GET `/api/tv/{channel}` — Get best ongoing games of a TV channel; params: channel* {path}, nb {query}, moves {query}, pgnInJson {query}, tags {query}, clocks {query}, opening {query}; auth: none; responses: 200.

### Tournaments (Arena) (13)
- GET `/api/tournament` — Get current tournaments; params: none; auth: none; responses: 200.
- POST `/api/tournament` — Create a new Arena tournament; params: none; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- GET `/api/tournament/{id}` — Get info about an Arena tournament; params: page {query}; auth: none; responses: 200.
- POST `/api/tournament/{id}` — Update an Arena tournament; params: none; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- POST `/api/tournament/{id}/join` — Join an Arena tournament; params: id* {path}; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- POST `/api/tournament/{id}/withdraw` — Pause or leave an Arena tournament; params: id* {path}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/tournament/{id}/terminate` — Terminate an Arena tournament; params: id* {path}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/tournament/team-battle/{id}` — Update a team battle; params: id* {path}; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- GET `/api/tournament/{id}/games` — Export games of an Arena tournament; params: id* {path}, player {query}, moves {query}, pgnInJson {query}, tags {query}, clocks {query}, evals {query}, accuracy {query}, opening {query}, division {query}; auth: none; responses: 200.
- GET `/api/tournament/{id}/results` — Get results of an Arena tournament; params: id* {path}, nb {query}, sheet {query}; auth: none; responses: 200.
- GET `/api/tournament/{id}/teams` — Get team standing of a team battle; params: id* {path}; auth: none; responses: 200.
- GET `/api/user/{username}/tournament/created` — Get tournaments created by a user; params: username* {path}, nb {query}, status {query}; auth: OAuth2/PAT; responses: 200.
- GET `/api/user/{username}/tournament/played` — Get tournaments played by a user; params: username* {path}, nb {query}, performance {query}; auth: OAuth2/PAT; responses: 200.

### Tournaments (Swiss) (10)
- POST `/api/swiss/new/{teamId}` — Create a new Swiss tournament; params: teamId* {path}; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- GET `/api/swiss/{id}` — Get info about a Swiss tournament; params: none; auth: none; responses: 200.
- POST `/api/swiss/{id}/edit` — Update a Swiss tournament; params: id* {path}; auth: OAuth2/PAT; responses: 200, 400, 401; request body: yes.
- POST `/api/swiss/{id}/schedule-next-round` — Manually schedule the next round; params: id* {path}; auth: OAuth2/PAT; responses: 204, 400, 401; request body: yes.
- POST `/api/swiss/{id}/join` — Join a Swiss tournament; params: id* {path}; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- POST `/api/swiss/{id}/withdraw` — Pause or leave a swiss tournament; params: id* {path}; auth: OAuth2/PAT; responses: 200.
- POST `/api/swiss/{id}/terminate` — Terminate a Swiss tournament; params: id* {path}; auth: OAuth2/PAT; responses: 200, 400.
- GET `/swiss/{id}.trf` — Export TRF of a Swiss tournament; params: id* {path}; auth: none; responses: 200.
- GET `/api/swiss/{id}/games` — Export games of a Swiss tournament; params: id* {path}, player {query}, moves {query}, pgnInJson {query}, tags {query}, clocks {query}, evals {query}, accuracy {query}, opening {query}, division {query}; auth: none; responses: 200.
- GET `/api/swiss/{id}/results` — Get results of a swiss tournament; params: id* {path}, nb {query}; auth: none; responses: 200.

### Teams (14)
- GET `/api/team/{teamId}/swiss` — Get team swiss tournaments; params: teamId* {path}, max {query}, status {query}, createdBy {query}, name {query}; auth: none; responses: 200.
- GET `/api/team/{teamId}` — Get a single team; params: teamId* {path}; auth: none; responses: 200.
- GET `/api/team/all` — Get popular teams; params: page {query}; auth: none; responses: 200.
- GET `/api/team/of/{username}` — Teams of a player; params: username* {path}; auth: OAuth2/PAT; responses: 200.
- GET `/api/team/search` — Search teams; params: text {query}, page {query}; auth: none; responses: 200.
- GET `/api/team/{teamId}/users` — Get members of a team; params: teamId* {path}, full {query}; auth: OAuth2/PAT; responses: 200.
- GET `/api/team/{teamId}/arena` — Get team Arena tournaments; params: teamId* {path}, max {query}, status {query}, createdBy {query}, name {query}; auth: none; responses: 200.
- POST `/team/{teamId}/join` — Join a team; params: teamId* {path}; auth: OAuth2/PAT; responses: 200; request body: yes.
- POST `/team/{teamId}/quit` — Leave a team; params: teamId* {path}; auth: OAuth2/PAT; responses: 200.
- GET `/api/team/{teamId}/requests` — Get join requests; params: teamId* {path}, declined {query}; auth: OAuth2/PAT; responses: 200.
- POST `/api/team/{teamId}/request/{userId}/accept` — Accept join request; params: teamId* {path}, userId* {path}; auth: OAuth2/PAT; responses: 200.
- POST `/api/team/{teamId}/request/{userId}/decline` — Decline join request; params: teamId* {path}, userId* {path}; auth: OAuth2/PAT; responses: 200.
- POST `/api/team/{teamId}/kick/{userId}` — Kick a user from your team; params: teamId* {path}, userId* {path}; auth: OAuth2/PAT; responses: 200.
- POST `/team/{teamId}/pm-all` — Message all members; params: teamId* {path}; auth: OAuth2/PAT; responses: 200, 400; request body: yes.

### Studies (9)
- GET `/api/study/{studyId}/{chapterId}.pgn` — Export one study chapter; params: studyId* {path}, chapterId* {path}, clocks {query}, comments {query}, variations {query}, orientation {query}; auth: OAuth2/PAT; responses: 200.
- GET `/api/study/{studyId}.pgn` — Study metadata; params: studyId* {path}, clocks {query}, comments {query}, variations {query}, orientation {query}, studyId* {path}; auth: none; responses: 200, 204.
- POST `/api/study` — Create a new Study; params: none; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- POST `/api/study/{studyId}/import-pgn` — Import PGN into a study; params: studyId* {path}; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- POST `/api/study/{studyId}/{chapterId}/tags` — Update PGN tags of a study chapter; params: studyId* {path}, chapterId* {path}; auth: OAuth2/PAT; responses: 204, 400; request body: yes.
- POST `/api/study/{studyId}/{chapterId}/moves` — Update the moves of a study chapter; params: studyId* {path}, chapterId* {path}; auth: OAuth2/PAT; responses: 204, 400; request body: yes.
- GET `/api/study/by/{username}/export.pgn` — Export all studies of a user; params: username* {path}, clocks {query}, comments {query}, variations {query}, orientation {query}; auth: OAuth2/PAT; responses: 200.
- GET `/api/study/by/{username}` — List studies of a user; params: username* {path}; auth: OAuth2/PAT; responses: 200.
- DELETE `/api/study/{studyId}/{chapterId}` — Delete a study chapter; params: studyId* {path}, chapterId* {path}; auth: OAuth2/PAT; responses: 204.

### Broadcasts (19)
- GET `/api/broadcast` — Get official broadcasts; params: nb {query}, html {query}, live {query}; auth: none; responses: 200.
- GET `/api/broadcast/top` — Get paginated top broadcast previews; params: page {query}, html {query}; auth: none; responses: 200.
- GET `/api/broadcast/by/{username}` — Get broadcasts created by a user; params: username* {path}, page {query}, html {query}; auth: OAuth2/PAT; responses: 200.
- GET `/api/broadcast/search` — Search broadcasts; params: page {query}, q {query}; auth: none; responses: 200.
- POST `/broadcast/new` — Create a broadcast tournament; params: none; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- GET `/api/broadcast/{broadcastTournamentId}` — Get a broadcast tournament; params: broadcastTournamentId* {path}; auth: OAuth2/PAT; responses: 200.
- GET `/broadcast/{broadcastTournamentId}/players` — Get players of a broadcast; params: broadcastTournamentId* {path}; auth: none; responses: 200.
- GET `/broadcast/{broadcastTournamentId}/players/{playerId}` — Get a player of a broadcast; params: broadcastTournamentId* {path}, playerId* {path}; auth: none; responses: 200, 404.
- GET `/broadcast/{broadcastTournamentId}/teams/standings` — Get the team leaderboard of a broadcast; params: broadcastTournamentId* {path}; auth: none; responses: 200, 404.
- POST `/broadcast/{broadcastTournamentId}/edit` — Update your broadcast tournament; params: broadcastTournamentId* {path}; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- POST `/broadcast/{broadcastTournamentId}/new` — Create a broadcast round; params: broadcastTournamentId* {path}; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- GET `/api/broadcast/{broadcastTournamentSlug}/{broadcastRoundSlug}/{broadcastRoundId}` — Get a broadcast round; params: broadcastTournamentSlug* {path}, broadcastRoundSlug* {path}, broadcastRoundId* {path}; auth: none; responses: 200.
- POST `/broadcast/round/{broadcastRoundId}/edit` — Update a broadcast round; params: broadcastRoundId* {path}; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- POST `/api/broadcast/round/{broadcastRoundId}/reset` — Reset a broadcast round; params: broadcastRoundId* {path}; auth: OAuth2/PAT; responses: 200.
- POST `/api/broadcast/round/{broadcastRoundId}/push` — Push PGN to a broadcast round; params: broadcastRoundId* {path}; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- GET `/api/stream/broadcast/round/{broadcastRoundId}.pgn` — Stream an ongoing broadcast round as PGN; params: broadcastRoundId* {path}, clocks {query}, comments {query}; auth: none; responses: 200.
- GET `/api/broadcast/round/{broadcastRoundId}.pgn` — Export one round as PGN; params: broadcastRoundId* {path}, clocks {query}, comments {query}; auth: none; responses: 200.
- GET `/api/broadcast/{broadcastTournamentId}.pgn` — Export all rounds as PGN; params: broadcastTournamentId* {path}, clocks {query}, comments {query}; auth: OAuth2/PAT; responses: 200.
- GET `/api/broadcast/my-rounds` — Get your broadcast rounds; params: nb {query}; auth: OAuth2/PAT; responses: 200.

### FIDE (3)
- GET `/api/fide/player/{playerId}` — Get a FIDE player; params: playerId* {path}; auth: none; responses: 200.
- GET `/api/fide/player/{playerId}/ratings` — Get ratings history of a FIDE player; params: playerId* {path}; auth: none; responses: 200.
- GET `/api/fide/player` — Search FIDE players; params: q* {query}; auth: none; responses: 200.

### Simuls (1)
- GET `/api/simul` — Get current simuls; params: none; auth: none; responses: 200.

### Relations (5)
- GET `/api/rel/following` — Get users followed by the logged in user; params: none; auth: OAuth2/PAT; responses: 200.
- POST `/api/rel/follow/{username}` — Follow a player; params: username* {path}; auth: OAuth2/PAT; responses: 200.
- POST `/api/rel/unfollow/{username}` — Unfollow a player; params: username* {path}; auth: OAuth2/PAT; responses: 200.
- POST `/api/rel/block/{username}` — Block a player; params: username* {path}; auth: OAuth2/PAT; responses: 200.
- POST `/api/rel/unblock/{username}` — Unblock a player; params: username* {path}; auth: OAuth2/PAT; responses: 200.

### Board (13)
- GET `/api/stream/event` — Stream incoming events; params: none; auth: OAuth2/PAT; responses: 200.
- POST `/api/board/seek` — Create a seek; params: none; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- GET `/api/board/game/stream/{gameId}` — Stream Board game state; params: gameId* {path}; auth: OAuth2/PAT; responses: 200, 404.
- POST `/api/board/game/{gameId}/move/{move}` — Make a Board move; params: gameId* {path}, move* {path}, offeringDraw {query}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/board/game/{gameId}/chat` — Write in the chat; params: none; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- GET `/api/board/game/{gameId}/chat` — Fetch the player chat; params: none; auth: OAuth2/PAT; responses: 200.
- POST `/api/board/game/{gameId}/abort` — Abort a game; params: gameId* {path}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/board/game/{gameId}/resign` — Resign a game; params: gameId* {path}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/board/game/{gameId}/draw/{accept}` — Handle draw offers; params: gameId* {path}, accept* {path}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/board/game/{gameId}/takeback/{accept}` — Handle takeback offers; params: gameId* {path}, accept* {path}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/board/game/{gameId}/claim-victory` — Claim victory of a game; params: gameId* {path}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/board/game/{gameId}/claim-draw` — Claim draw of a game; params: gameId* {path}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/board/game/{gameId}/berserk` — Berserk a tournament game; params: gameId* {path}; auth: OAuth2/PAT; responses: 200, 400.

### Bot (12)
- GET `/api/bot/online` — Get online bots; params: nb {query}; auth: none; responses: 200.
- POST `/api/bot/account/upgrade` — Upgrade to Bot account; params: none; auth: OAuth2/PAT; responses: 200, 400.
- GET `/api/bot/game/stream/{gameId}` — Stream Bot game state; params: gameId* {path}; auth: OAuth2/PAT; responses: 200, 404.
- POST `/api/bot/game/{gameId}/move/{move}` — Make a Bot move; params: gameId* {path}, move* {path}, offeringDraw {query}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/bot/game/{gameId}/chat` — Write in the chat; params: gameId* {path}; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- GET `/api/bot/game/{gameId}/chat` — Fetch the game chat; params: gameId* {path}; auth: OAuth2/PAT; responses: 200.
- POST `/api/bot/game/{gameId}/abort` — Abort a game; params: gameId* {path}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/bot/game/{gameId}/resign` — Resign a game; params: gameId* {path}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/bot/game/{gameId}/draw/{accept}` — Handle draw offers; params: gameId* {path}, accept* {path}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/bot/game/{gameId}/takeback/{accept}` — Handle takeback offers; params: gameId* {path}, accept* {path}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/bot/game/{gameId}/claim-victory` — Claim victory of a game; params: gameId* {path}; auth: OAuth2/PAT; responses: 200, 400.
- POST `/api/bot/game/{gameId}/claim-draw` — Claim draw of a game; params: gameId* {path}; auth: OAuth2/PAT; responses: 200, 400.

### Challenges (11)
- GET `/api/challenge` — List your challenges; params: none; auth: OAuth2/PAT; responses: 200.
- POST `/api/challenge/{username}` — Create a challenge; params: username* {path}; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- GET `/api/challenge/{challengeId}/show` — Show one challenge; params: challengeId* {path}; auth: OAuth2/PAT; responses: 200.
- POST `/api/challenge/{challengeId}/accept` — Accept a challenge; params: challengeId* {path}, color {query}; auth: OAuth2/PAT; responses: 200, 404.
- POST `/api/challenge/{challengeId}/decline` — Decline a challenge; params: challengeId* {path}; auth: OAuth2/PAT; responses: 200, 404; request body: yes.
- POST `/api/challenge/{challengeId}/cancel` — Cancel a challenge; params: challengeId* {path}, opponentToken {query}; auth: OAuth2/PAT; responses: 200, 404.
- POST `/api/challenge/ai` — Challenge the AI; params: none; auth: OAuth2/PAT; responses: 201, 400; request body: yes.
- POST `/api/challenge/open` — Open-ended challenge; params: none; auth: none; responses: 200, 400; request body: yes.
- POST `/api/challenge/{gameId}/start-clocks` — Start clocks of a game; params: gameId* {path}, token1* {query}, token2 {query}; auth: OAuth2/PAT; responses: 200.
- POST `/api/round/{gameId}/add-time/{seconds}` — Add time to the opponent clock; params: gameId* {path}, seconds* {path}; auth: OAuth2/PAT; responses: 200.
- POST `/api/token/admin-challenge` — Admin challenge tokens; params: none; auth: OAuth2/PAT; responses: 200, 400; request body: yes.

### Bulk pairings (6)
- GET `/api/bulk-pairing` — View your bulk pairings; params: none; auth: OAuth2/PAT; responses: 200.
- POST `/api/bulk-pairing` — Create a bulk pairing; params: none; auth: OAuth2/PAT; responses: 200, 400; request body: yes.
- POST `/api/bulk-pairing/{id}/start-clocks` — Manually start clocks; params: id* {path}; auth: OAuth2/PAT; responses: 200, 404.
- GET `/api/bulk-pairing/{id}` — Show a bulk pairing; params: id* {path}; auth: OAuth2/PAT; responses: 200, 404.
- DELETE `/api/bulk-pairing/{id}` — Cancel a bulk pairing; params: id* {path}; auth: OAuth2/PAT; responses: 200, 404.
- GET `/api/bulk-pairing/{id}/games` — Export games of a bulk pairing; params: id* {path}, moves {query}, pgnInJson {query}, tags {query}, clocks {query}, evals {query}, accuracy {query}, opening {query}, division {query}, literate {query}; auth: OAuth2/PAT; responses: 200.

### Messaging (1)
- POST `/inbox/{username}` — Send a private message; params: username* {path}; auth: OAuth2/PAT; responses: 200, 400; request body: yes.

### Analysis (1)
- GET `/api/cloud-eval` — Get cloud evaluation of a position.; params: fen* {query}, multiPv {query}, variant {query}; auth: none; responses: 200, 404.

### External engine (8)
- GET `/api/external-engine` — List external engines; params: none; auth: OAuth2/PAT; responses: 200.
- POST `/api/external-engine` — Create external engine; params: none; auth: OAuth2/PAT; responses: 200; request body: yes.
- GET `/api/external-engine/{id}` — Get external engine; params: none; auth: OAuth2/PAT; responses: 200.
- PUT `/api/external-engine/{id}` — Update external engine; params: none; auth: OAuth2/PAT; responses: 200; request body: yes.
- DELETE `/api/external-engine/{id}` — Delete external engine; params: none; auth: OAuth2/PAT; responses: 200.
- POST `/api/external-engine/{id}/analyse` — Analyse with external engine; params: none; auth: none; responses: 200; request body: yes.
- POST `/api/external-engine/work` — Acquire analysis request; params: none; auth: none; responses: 200, 204; request body: yes.
- POST `/api/external-engine/work/{id}` — Answer analysis request; params: none; auth: none; responses: 200; request body: yes.

### OAuth (4)
- GET `/oauth` — Request authorization code; params: response_type* {query}, client_id* {query}, redirect_uri* {query}, code_challenge_method* {query}, code_challenge* {query}, scope {query}, username {query}, state {query}; auth: none; responses: 200.
- POST `/api/token` — Obtain access token; params: none; auth: none; responses: 200, 400; request body: yes.
- DELETE `/api/token` — Revoke access token; params: none; auth: OAuth2/PAT; responses: 204.
- POST `/api/token/test` — Test multiple OAuth tokens; params: none; auth: none; responses: 200; request body: yes.

### Opening Explorer (4)
- GET `/masters` — Masters database; params: fen {query}, play {query}, since {query}, until {query}, moves {query}, topGames {query}; auth: OAuth2/PAT; responses: 200.
- GET `/lichess` — Lichess games; params: variant {query}, fen {query}, play {query}, speeds {query}, ratings {query}, since {query}, until {query}, moves {query}, topGames {query}, recentGames {query}, history {query}; auth: OAuth2/PAT; responses: 200.
- GET `/player` — Player games; params: player* {query}, color* {query}, variant {query}, fen {query}, play {query}, speeds {query}, modes {query}, since {query}, until {query}, moves {query}, recentGames {query}; auth: OAuth2/PAT; responses: 200.
- GET `/masters/pgn/{gameId}` — OTB master game; params: gameId* {path}; auth: OAuth2/PAT; responses: 200.

### Tablebase (3)
- GET `/standard` — Tablebase lookup; params: fen* {query}, dtc {query}; auth: none; responses: 200.
- GET `/atomic` — Tablebase lookup for Atomic chess; params: fen* {query}; auth: none; responses: 200.
- GET `/antichess` — Tablebase lookup for Antichess; params: fen* {query}; auth: none; responses: 200.

## Pagination, formats, and error notes
- The API is not one-format-only:
  - many endpoints return JSON
  - export routes can return PGN
  - stream routes can return NDJSON
  - some tournament/study routes expose specialist export formats such as `.trf` and `.pgn`
- Common route-specific pagination/filter knobs include `since`, `until`, `max`, `nb`, `page`, `sort`, and resource-specific query flags.
- Live checks in this pass:
  - `GET /api/puzzle/daily` returned `200` JSON
  - `GET /api/user/lichess` returned `200` JSON
  - `GET /api/account` without auth returned `401` JSON `{"error":"Missing authorization header"}`
  - `GET /api/tv/feed` returned `200` with content type `application/x-ndjson`
  - `GET /api/user/this_user_should_not_exist_123456789` returned `404`
- The inspected spec explicitly documents `429` on selected streaming and rate-sensitive endpoints such as `GET /api/stream/game/{id}`.

## Important usage notes
- Treat Lichess as a mixed public/private API: many read endpoints are anonymous, but account, board, bot, challenge, relation, study-authoring, and management workflows require token scopes.
- The docs are explicit that tokens must be kept secret and should not be hardcoded into frontend bundles or shipped apps.
- NDJSON streaming endpoints need stream-capable clients; do not assume one complete JSON document per response.
- Export endpoints frequently expose many toggles (`moves`, `tags`, `clocks`, `evals`, `accuracy`, `opening`, `division`, `literate`, etc.); preserve these provider-native options in any passthrough mode.
- OAuth PKCE support is friendly to public clients, but refresh tokens are not available, so integrations must handle re-auth differently from providers with refresh flows.

## Integration notes for fireROUTE
- Model Lichess as a large multi-surface API with clear public-vs-token-required boundaries rather than one uniformly authenticated service.
- Preserve streaming vs one-shot response semantics explicitly.
- Support bearer-token auth and scoped OAuth delegation for write or account-sensitive flows.
- Keep export endpoints close to raw provider behavior because many parameters materially change returned format and payload size.
- Handle route-specific status behavior instead of assuming a uniform JSON error envelope across every endpoint.

## Sources inspected
- `https://lichess.org/api`
- `https://lichess.org/openapi.yaml`
- Live checks via browser fetch against:
  - `https://lichess.org/api/puzzle/daily`
  - `https://lichess.org/api/account`
  - `https://lichess.org/api/user/lichess`
  - `https://lichess.org/api/games/user/lichess?max=1`
  - `https://lichess.org/api/tv/feed`
  - `https://lichess.org/api/user/this_user_should_not_exist_123456789`
