# Destiny The Game

## Overview
- Provider: Bungie Platform API
- Category: Games & Comics
- Official docs: `https://bungie-net.github.io/multi/index.html`
- Preferred base URL: `https://www.bungie.net/Platform`
- Auth: official docs say every request requires `X-API-Key`; a subset of endpoints also require Bungie OAuth 2 user authorization with endpoint-specific scopes
- HTTPS: yes
- Response format: JSON
- Confirmed route count: `135` operations in the official route index
- Official docs version shown on the landing page: `2.21.8`

## Confirmed route inventory by official tag

| Tag | Count | Notes |
|---|---:|---|
| `App` | 2 | Application usage and registered-application listing routes. |
| `User` | 9 | Bungie account, membership, theme, and Bungie-name search routes. |
| `Content` | 7 | CMS/content-type, article, tag, help-search, and RSS routes. |
| `Forum` | 10 | Topic/post/poll/recruitment forum routes. |
| `GroupV2` | 35 | Clan/group lookup, membership, invites, approvals, bans, and admin operations. |
| `Tokens` | 8 | Partner offer and Bungie Rewards / drops repair routes. |
| `Destiny2` | 43 | Manifest, profile, inventory, vendors, stats, loadouts, milestones, transfers, and AWA routes. |
| `CommunityContent` | 1 | Community content feed route. |
| `Trending` | 3 | Trending categories and entry detail routes. |
| `Fireteam` | 5 | Clan fireteam discovery and summary routes. |
| `Social` | 8 | Friend list and friend-request routes. |
| `Global/System` | 4 | `GetAvailableLocales`, `GetCommonSettings`, `GetUserSystemOverrides`, `GetGlobalAlerts`. |

Route-count confirmation note:
- The official index exposes `135` operation links under endpoint tags.
- The separate `oauth2` section in the docs is a scope list, not additional REST operations, and is excluded from the route count.

## Full operation inventory from the official index

### App (`2`)
- `GET App.GetApplicationApiUsage`
- `GET App.GetBungieApplications`

### User (`9`)
- `GET User.GetBungieNetUserById`
- `GET User.GetSanitizedPlatformDisplayNames`
- `GET User.GetCredentialTypesForTargetAccount`
- `GET User.GetAvailableThemes`
- `GET User.GetMembershipDataById`
- `GET User.GetMembershipDataForCurrentUser`
- `GET User.GetMembershipFromHardLinkedCredential`
- `GET User.SearchByGlobalNamePrefix`
- `POST User.SearchByGlobalNamePost`

### Content (`7`)
- `GET Content.GetContentType`
- `GET Content.GetContentById`
- `GET Content.GetContentByTagAndType`
- `GET Content.SearchContentWithText`
- `GET Content.SearchContentByTagAndType`
- `GET Content.SearchHelpArticles`
- `GET Content.RssNewsArticles`

### Forum (`10`)
- `GET Forum.GetTopicsPaged`
- `GET Forum.GetCoreTopicsPaged`
- `GET Forum.GetPostsThreadedPaged`
- `GET Forum.GetPostsThreadedPagedFromChild`
- `GET Forum.GetPostAndParent`
- `GET Forum.GetPostAndParentAwaitingApproval`
- `GET Forum.GetTopicForContent`
- `GET Forum.GetForumTagSuggestions`
- `GET Forum.GetPoll`
- `POST Forum.GetRecruitmentThreadSummaries`

### GroupV2 (`35`)
- `GET GroupV2.GetAvailableAvatars`
- `GET GroupV2.GetAvailableThemes`
- `GET GroupV2.GetUserClanInviteSetting`
- `POST GroupV2.GetRecommendedGroups`
- `POST GroupV2.GroupSearch`
- `GET GroupV2.GetGroup`
- `GET GroupV2.GetGroupByName`
- `POST GroupV2.GetGroupByNameV2`
- `GET GroupV2.GetGroupOptionalConversations`
- `POST GroupV2.EditGroup`
- `POST GroupV2.EditClanBanner`
- `POST GroupV2.EditFounderOptions`
- `POST GroupV2.AddOptionalConversation`
- `POST GroupV2.EditOptionalConversation`
- `GET GroupV2.GetMembersOfGroup`
- `GET GroupV2.GetAdminsAndFounderOfGroup`
- `POST GroupV2.EditGroupMembership`
- `POST GroupV2.KickMember`
- `POST GroupV2.BanMember`
- `POST GroupV2.UnbanMember`
- `GET GroupV2.GetBannedMembersOfGroup`
- `GET GroupV2.GetGroupEditHistory`
- `POST GroupV2.AbdicateFoundership`
- `GET GroupV2.GetPendingMemberships`
- `GET GroupV2.GetInvitedIndividuals`
- `POST GroupV2.ApproveAllPending`
- `POST GroupV2.DenyAllPending`
- `POST GroupV2.ApprovePendingForList`
- `POST GroupV2.ApprovePending`
- `POST GroupV2.DenyPendingForList`
- `GET GroupV2.GetGroupsForMember`
- `GET GroupV2.RecoverGroupForFounder`
- `GET GroupV2.GetPotentialGroupsForMember`
- `POST GroupV2.IndividualGroupInvite`
- `POST GroupV2.IndividualGroupInviteCancel`

### Tokens (`8`)
- `POST Tokens.ForceDropsRepair`
- `POST Tokens.ClaimPartnerOffer`
- `POST Tokens.ApplyMissingPartnerOffersWithoutClaim`
- `GET Tokens.GetPartnerOfferSkuHistory`
- `GET Tokens.GetPartnerRewardHistory`
- `GET Tokens.GetBungieRewardsForUser`
- `GET Tokens.GetBungieRewardsForPlatformUser`
- `GET Tokens.GetBungieRewardsList`

### Destiny2 (`43`)
- `GET Destiny2.GetDestinyManifest`
- `GET Destiny2.GetDestinyEntityDefinition`
- `POST Destiny2.SearchDestinyPlayerByBungieName`
- `GET Destiny2.GetLinkedProfiles`
- `GET Destiny2.GetProfile`
- `GET Destiny2.GetCharacter`
- `GET Destiny2.GetClanWeeklyRewardState`
- `GET Destiny2.GetClanBannerSource`
- `GET Destiny2.GetItem`
- `GET Destiny2.GetVendors`
- `GET Destiny2.GetVendor`
- `GET Destiny2.GetPublicVendors` (`Preview` in the docs)
- `GET Destiny2.GetCollectibleNodeDetails`
- `POST Destiny2.TransferItem`
- `POST Destiny2.PullFromPostmaster`
- `POST Destiny2.EquipItem`
- `POST Destiny2.EquipItems`
- `POST Destiny2.EquipLoadout`
- `POST Destiny2.SnapshotLoadout`
- `POST Destiny2.UpdateLoadoutIdentifiers`
- `POST Destiny2.ClearLoadout`
- `POST Destiny2.SetItemLockState`
- `POST Destiny2.SetQuestTrackedState`
- `POST Destiny2.InsertSocketPlug` (`Preview`)
- `POST Destiny2.InsertSocketPlugFree` (`Preview`)
- `GET Destiny2.GetPostGameCarnageReport`
- `POST Destiny2.ReportOffensivePostGameCarnageReportPlayer`
- `GET Destiny2.GetHistoricalStatsDefinition`
- `GET Destiny2.GetClanLeaderboards` (`Preview`)
- `GET Destiny2.GetClanAggregateStats` (`Preview`)
- `GET Destiny2.GetLeaderboards` (`Preview`)
- `GET Destiny2.GetLeaderboardsForCharacter` (`Preview`)
- `GET Destiny2.SearchDestinyEntities`
- `GET Destiny2.GetHistoricalStats`
- `GET Destiny2.GetHistoricalStatsForAccount`
- `GET Destiny2.GetActivityHistory`
- `GET Destiny2.GetUniqueWeaponHistory`
- `GET Destiny2.GetDestinyAggregateActivityStats`
- `GET Destiny2.GetPublicMilestoneContent`
- `GET Destiny2.GetPublicMilestones`
- `POST Destiny2.AwaInitializeRequest`
- `POST Destiny2.AwaProvideAuthorizationResult`
- `GET Destiny2.AwaGetActionToken`

### CommunityContent (`1`)
- `GET CommunityContent.GetCommunityContent`

### Trending (`3`)
- `GET Trending.GetTrendingCategories`
- `GET Trending.GetTrendingCategory`
- `GET Trending.GetTrendingEntryDetail`

### Fireteam (`5`)
- `GET Fireteam.GetActivePrivateClanFireteamCount`
- `GET Fireteam.GetAvailableClanFireteams`
- `GET Fireteam.SearchPublicAvailableClanFireteams`
- `GET Fireteam.GetMyClanFireteams`
- `GET Fireteam.GetClanFireteam`

### Social (`8`)
- `GET Social.GetFriendList`
- `GET Social.GetFriendRequestList`
- `POST Social.IssueFriendRequest`
- `POST Social.AcceptFriendRequest`
- `POST Social.DeclineFriendRequest`
- `POST Social.RemoveFriend`
- `POST Social.RemoveFriendRequest`
- `GET Social.GetPlatformFriendList`

### Global/System (`4`)
- `GET GetAvailableLocales`
- `GET GetCommonSettings`
- `GET GetUserSystemOverrides`
- `GET GetGlobalAlerts`

## Representative route details from official operation pages

| Method | Path | Auth / scope | Important parameters and notes |
|---|---|---|---|
| GET | `/User/GetBungieNetUserById/{id}/` | `X-API-Key` | `id` is a Bungie.net membership id (`int64`). Returns `User.GeneralUser` inside the standard response envelope. |
| GET | `/Destiny2/Manifest/` | `X-API-Key` per docs | Returns `Destiny.Config.DestinyManifest`. This is the lightweight manifest-version endpoint used by many clients before downloading content databases. |
| POST | `/Destiny2/SearchDestinyPlayerByBungieName/{membershipType}/` | `X-API-Key` | `membershipType` accepts a non-Bungie membership type or `All`; request body is `User.ExactSearchRequest`; response is an array of `User.UserInfoCard`. |
| GET | `/Destiny2/{membershipType}/Profile/{destinyMembershipId}/` | `X-API-Key`; private data additionally needs OAuth | Path params: `membershipType`, `destinyMembershipId`; query `components` is required to receive useful results and must be a comma-separated list of component ids / names. |
| GET | `/Destiny2/{membershipType}/Account/{destinyMembershipId}/Character/{characterId}/Stats/Activities/` | `X-API-Key` | Path params: `membershipType`, `destinyMembershipId`, `characterId`; query params: `count`, `mode`, `page`; docs say page numbering starts at `0`. |
| POST | `/Destiny2/Actions/Items/TransferItem/` | OAuth `MoveEquipDestinyItems` | Body is `Destiny.Requests.DestinyItemTransferRequest`; docs also expose `ThrottleSecondsBetweenActionPerUser: 0.1`. |
| POST | `/GroupV2/Search/` | `X-API-Key` | Request body is `GroupsV2.GroupQuery`; returns `GroupsV2.GroupSearchResponse`. |
| GET | `/GroupV2/{groupId}/Members/` | `X-API-Key` | `groupId` path param; query params include `memberType` and `nameSearch`; docs text also mentions `currentpage` with `50` items per page, but the shown path template omits it, so this page currently has a documentation inconsistency. |
| GET | `/Forum/GetTopicsPaged/{page}/{pageSize}/{group}/{sort}/{quickDate}/{categoryFilter}/` | `X-API-Key` | Path params include `page`, `pageSize`, `group`, `sort`, `quickDate`, `categoryFilter`; query params include `locales` and `tagstring`; docs say `page` is zero-based and `pageSize` is currently unused. |
| POST | `/Tokens/Partner/ClaimOffer/` | OAuth `PartnerOfferGrant` | Body is `Tokens.PartnerOfferClaimRequest`; returns a boolean `Response`. |
| GET | `/Fireteam/Clan/{groupId}/Summary/{fireteamId}/` | OAuth `ReadGroups` | Path params: `groupId`, `fireteamId`; returns `Fireteam.FireteamResponse`. |
| GET | `/Social/Friends/` | OAuth `ReadUserData` | Returns `Social.Friends.BungieFriendListResponse`. |

## Headers, auth, and OAuth
Official connection/auth sections state:
- API root path: `https://www.bungie.net/Platform`
- Common required header: `X-API-Key`
- The docs say every request requires an API key obtained from `https://www.bungie.net/en/Application`
- OAuth authorize URL: `https://www.bungie.net/en/OAuth/Authorize`
- OAuth token URL: `https://www.bungie.net/Platform/App/OAuth/token/`
- OAuth refresh URL: `https://www.bungie.net/Platform/App/OAuth/token/`

Official OAuth scopes exposed in the docs:
- `ReadBasicUserProfile`
- `ReadGroups`
- `WriteGroups`
- `AdminGroups`
- `BnetWrite`
- `MoveEquipDestinyItems`
- `ReadDestinyInventoryAndVault`
- `ReadUserData`
- `EditUserData`
- `ReadDestinyVendorsAndAdvisors` (docs mark it obsolete / Destiny 1 only)
- `ReadAndApplyTokens`
- `AdvancedWriteActions`
- `PartnerOfferGrant`
- `DestinyUnlockValueQuery`
- `UserPiiRead`

Practical auth interpretation from the reviewed pages:
- Public reference endpoints still use the same JSON envelope as authenticated ones.
- Sensitive user/group/social/item-action routes add explicit `Required Scope(s)` sections on their operation pages.
- For Destiny 2 private read routes, the scope description says `ReadDestinyInventoryAndVault` is the main read scope needed for private Destiny 2 inventory/vendor/progression data.

## Parameters, pagination, and format notes
- The docs consistently use JSON response envelopes with these top-level fields:
  - `Response`
  - `ErrorCode`
  - `ThrottleSeconds`
  - `ErrorStatus`
  - `Message`
  - `MessageData`
  - `DetailedErrorTrace`
- Several list/search routes use explicit page/count parameters rather than opaque cursors.
- Confirmed pagination / filtering examples from reviewed operation pages:
  - `Destiny2.GetActivityHistory` uses `count`, `mode`, and zero-based `page`
  - `Forum.GetTopicsPaged` uses a zero-based path `page`; `pageSize` is documented as unused; optional `locales` and `tagstring` refine results
  - `GroupV2.GetMembersOfGroup` mentions `50` items per page and a `currentpage` concept despite the displayed path template omitting it
- Destiny profile reads require a `components` query parameter; the docs say you must request at least one component to receive results.
- Search endpoints that accept POST bodies use typed JSON request objects rather than form-encoded payloads.

## Error handling and throttling
- Every reviewed operation page uses the same Bungie response envelope with `ErrorCode`, `ThrottleSeconds`, `ErrorStatus`, and `Message` alongside `Response`.
- Action routes can publish extra throttle metadata inside the docs themselves. Example: `Destiny2.TransferItem` includes `ThrottleSecondsBetweenActionPerUser: 0.1`.
- The docs pages reviewed in this pass do not publish one universal numeric requests-per-minute quota for the whole API.
- Instead, callers are expected to inspect Bungie's error envelope and any route-specific throttling notes.

## Live checks observed in this pass
- Anonymous `GET https://www.bungie.net/Platform/User/GetBungieNetUserById/1/` returned HTTP `500` with JSON body containing `ErrorCode: 2102`, `ErrorStatus: "ApiKeyMissingFromRequest"`, and message `Please add valid X-API-Key header to request.`
- Anonymous `GET https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018469271297/?components=100` returned the same HTTP `500` / `ApiKeyMissingFromRequest` payload.
- Anonymous `GET https://www.bungie.net/Platform/Destiny2/Manifest/` currently returned HTTP `200` with normal manifest JSON even without an `X-API-Key` header.
- Because the live manifest behavior conflicts with the docs' blanket `every request requires an API key` statement, integrations should not assume the public exception applies broadly; treat it as a current production discrepancy, not a contract.

## Usage notes
- The official multi-page reference is broader than Destiny 2 alone; it is the full Bungie Platform surface and includes clan, social, forum, token, and global-service operations alongside Destiny 2 routes.
- The docs explicitly label several Destiny2 routes as `Preview`.
- The landing page links Bungie's separate OAuth wiki for fuller auth-flow detail: `https://github.com/Bungie-net/api/wiki/OAuth-Documentation`.
- The docs are static per-operation HTML pages, which makes route names stable and directly linkable even when operation details are spread across multiple files.

## Integration notes for fireROUTE
- Model this provider as a large JSON API with `135` officially indexed operations, not as a small Destiny-only surface.
- Preserve the official tag groupings because they cleanly separate public content/forum/group/social routes from OAuth-gated user/item-action flows.
- Expect Bungie's standard envelope on both success and error responses, not raw resource bodies.
- Surface the manifest endpoint separately from private profile/inventory operations because live behavior currently suggests broader public access than the docs claim.
- Mark reviewed doc inconsistencies in adapter notes, especially the `GroupV2.GetMembersOfGroup` `currentpage` mismatch.

## Sources inspected
- `https://bungie-net.github.io/multi/index.html`
- `https://bungie-net.github.io/multi/operation_get_User-GetBungieNetUserById.html#operation_get_User-GetBungieNetUserById`
- `https://bungie-net.github.io/multi/operation_get_Destiny2-GetDestinyManifest.html#operation_get_Destiny2-GetDestinyManifest`
- `https://bungie-net.github.io/multi/operation_post_Destiny2-SearchDestinyPlayerByBungieName.html#operation_post_Destiny2-SearchDestinyPlayerByBungieName`
- `https://bungie-net.github.io/multi/operation_get_Destiny2-GetProfile.html#operation_get_Destiny2-GetProfile`
- `https://bungie-net.github.io/multi/operation_get_Destiny2-GetActivityHistory.html#operation_get_Destiny2-GetActivityHistory`
- `https://bungie-net.github.io/multi/operation_post_Destiny2-TransferItem.html#operation_post_Destiny2-TransferItem`
- `https://bungie-net.github.io/multi/operation_post_GroupV2-GroupSearch.html#operation_post_GroupV2-GroupSearch`
- `https://bungie-net.github.io/multi/operation_get_GroupV2-GetMembersOfGroup.html#operation_get_GroupV2-GetMembersOfGroup`
- `https://bungie-net.github.io/multi/operation_get_Forum-GetTopicsPaged.html#operation_get_Forum-GetTopicsPaged`
- `https://bungie-net.github.io/multi/operation_post_Tokens-ClaimPartnerOffer.html#operation_post_Tokens-ClaimPartnerOffer`
- `https://bungie-net.github.io/multi/operation_get_Fireteam-GetClanFireteam.html#operation_get_Fireteam-GetClanFireteam`
- `https://bungie-net.github.io/multi/operation_get_Social-GetFriendList.html#operation_get_Social-GetFriendList`
- live fetch check: `https://www.bungie.net/Platform/User/GetBungieNetUserById/1/`
- live fetch check: `https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018469271297/?components=100`
- live fetch check: `https://www.bungie.net/Platform/Destiny2/Manifest/`
