# Steam

## Overview
- Provider: Steam Web API documentation mirror at `steamapi.xpaw.me`, cross-checked against the official Steamworks partner docs
- Category: Games & Comics
- Indexed docs inspected: `https://steamapi.xpaw.me/`
- Official partner docs inspected: `https://partner.steamgames.com/doc/webapi/` and `https://partner.steamgames.com/doc/webapi_overview`
- Canonical base hosts documented on the mirror:
  - `https://api.steampowered.com`
  - `https://community.steam-api.com`
  - `https://partner.steam-api.com`
- Auth:
  - no auth for some public methods
  - user Web API key for many public-account methods
  - publisher Web API key for protected partner methods
  - some Steam web flows also accept `access_token`
- HTTPS: yes
- Response formats: JSON, VDF, XML
- Pagination: interface-specific; array arguments use indexed parameter notation and some methods use row-version cursors or count limits instead of generic paging
- Rate limits: no single published global policy; the mirror warns many methods have undocumented limits and that limit events usually surface as HTTP `429`, or `x-eresult` `25` / `84`
- Confirmed route inventory from the indexed mirror: `1091` methods across `207` interface pages
- Public official partner reference visible at inspection time: `31` interface pages
- Manual status: `manually_documented`

## What the provider actually is
- `steamapi.xpaw.me` is not Valve's official host; it is a static reference maintained by xPaw.
- The mirror explicitly says it is generated from `GetSupportedAPIList` using public and publisher keys, with additional service methods parsed from Steam client protobuf files.
- The official Steamworks partner docs are the authority for authentication, host usage, and the officially documented subset.
- The xPaw mirror is the widest public route inventory available in this pass, and it includes many undocumented or partner-only methods.

## Base URL and request conventions
- Public URI template:
  - `https://api.steampowered.com/<interface>/<method>/<version>/`
- Alternate public/community host documented by the mirror:
  - `https://community.steam-api.com/<interface>/<method>/<version>/`
- Partner host documented by the mirror:
  - `https://partner.steam-api.com/<interface>/<method>/<version>/`
- Request conventions documented on the mirror:
  - GET parameters go in the query string
  - POST parameters use `application/x-www-form-urlencoded`
  - requests must use UTF-8
  - arrays use zero-based index suffixes like `steamids[0]`, `steamids[1]`, with a count parameter where required
  - interfaces ending in `Service` can accept `input_json` or `input_protobuf_encoded`

## Authentication and host usage notes
- The xPaw mirror documents three access levels:
  - public methods with no auth
  - user-key methods with a Steam account's Web API key
  - publisher-key methods for protected data/actions
- The mirror says keys can be sent either as:
  - `key` query parameter
  - `x-webapi-key` header
- Access tokens, when supported, are sent as the `access_token` parameter.
- The mirror warns that not all APIs support access tokens; some support only API keys, some only access tokens.
- The partner host has stricter behavior:
  - HTTPS only
  - every request requires a publisher key
  - missing/invalid publisher keys return `403`
  - repeated `403` responses can temporarily deny-list the caller IP

## Formats, errors, and pagination
- Output formats offered by the mirror UI:
  - JSON
  - VDF
  - XML (marked "not recommended")
- Error/rate-limit behavior documented on the mirror:
  - many limits are undocumented and vary by method
  - rate limiting usually appears as HTTP `429`
  - some failures expose `x-eresult` values `25` (`LimitExceeded`) or `84` (`RateLimitExceeded`)
- Pagination is not global across Steam Web API:
  - some methods page with `count` / `start` / cursor-like row versions
  - some accept comma-delimited lists with hard caps (for example, max `100` ids on some user-summary methods)
  - many methods are simple one-shot calls with no pagination at all

## Representative confirmed routes and parameters
These examples were manually verified from the xPaw mirror pages and are representative of how the larger 1091-method inventory is structured.

| Interface | Method | HTTP | Host shown | Path | Key parameters | Notes |
|---|---|---|---|---|---|---|
| `ISteamWebAPIUtil` | `GetSupportedAPIList` | GET | public | `/ISteamWebAPIUtil/GetSupportedAPIList/v1/` | optional `key` | Mirror source-of-truth method used to build much of the reference itself. |
| `ISteamUser` | `GetPlayerSummaries` | GET | public | `/ISteamUser/GetPlayerSummaries/v2/` | `key`, `steamids` (comma-delimited, max `100`) | Public profile summary lookup. |
| `IPlayerService` | `GetOwnedGames` | GET | public | `/IPlayerService/GetOwnedGames/v1/` | `key`, plus method-specific options on the page | Large player-library lookup surface lives under `IPlayerService`. |
| `ISteamNews` | `GetNewsForApp` | GET | public | `/ISteamNews/GetNewsForApp/v2/` | `appid` required; optional `maxlength`, `enddate`, `count`, `feeds`, `tags` | Public app-news endpoint. |
| `ISteamApps` | `UpToDateCheck` | GET | public | `/ISteamApps/UpToDateCheck/v1/` | `appid`, `version` | Checks installed version against Steam's current version. |
| `ISteamApps` | `GetServerList` | GET | partner | `/ISteamApps/GetServerList/v1/` | optional `filter`, optional `limit` | Mirror labels it publisher/partner-only. |
| `ISteamUser` | `GrantPackage` | POST | partner | `/ISteamUser/GrantPackage/v3/` | `key`, `steamid`, `packageid`, optional `ipaddress` | Protected partner action. |

## High-value interface families seen in the mirror
- Broad public/consumer-facing families:
  - `ISteamUser`
  - `IPlayerService`
  - `ISteamNews`
  - `ISteamWebAPIUtil`
  - `ISteamApps`
  - `ISteamUserStats`
  - `ISteamRemoteStorage`
  - `IGameServersService`
- Partner / commerce / operations families:
  - `ISteamMicroTxn`
  - `ISteamMicroTxnSandbox`
  - `IStoreService`
  - `IPublishedFileService`
  - `IInventoryService`
  - `IEconService`
  - `IPartnerFinancialsService`
- The mirror also exposes a very large set of undocumented or app-specific interfaces, including Dota-, CS-, TF-, and Citadel-related namespaces.

## Route inventory summary
- xPaw mirror interface pages found at inspection time: `207`
- Total method anchors across those interface pages: `1091`
- Official partner reference interface pages publicly linked at inspection time: `31`
- The mirror is therefore materially broader than the official public partner index and should be treated as a superset reference, not as an official guarantee that every method is stable or usable.

## Appendix A: interface counts from the indexed mirror
- IAccountCartService: 7
- IAccountPrivacyService: 1
- IAccountPrivateAppsService: 2
- IAssetSetPublishingService: 8
- IAuctionService: 6
- IAuthenticationService: 15
- IAuthenticationSupportService: 5
- IBillingService: 1
- IBroadcastService: 14
- IChatRoomService: 6
- ICheatReportingService: 8
- ICheckoutService: 3
- ICitadelAdmin_1422450: 1
- ICitadelAdmin_3488080: 1
- ICitadelAdmin_3781850: 1
- IClanFAQSService: 17
- IClanService: 3
- IClientCommService: 9
- IClientMetricsService: 2
- IClientStats_1046930: 1
- ICloudService: 10
- ICommunityService: 14
- IContentFilteringService: 1
- IContentModerationService: 28
- IContentServerConfigService: 8
- IContentServerDirectoryService: 5
- ICrashReportService: 2
- ICredentialsService: 2
- ICSGOPlayers_730: 3
- ICSGOServers_730: 4
- ICSGOStreamSystem_730: 2
- ICSGOTournaments_730: 7
- IDailyDealService: 6
- IDataPublisherService: 3
- IDOTA2AutomatedTourney_2305270: 3
- IDOTA2AutomatedTourney_247040: 3
- IDOTA2AutomatedTourney_570: 3
- IDOTA2CustomGames_2305270: 5
- IDOTA2CustomGames_247040: 5
- IDOTA2CustomGames_570: 5
- IDOTA2Events_2305270: 6
- IDOTA2Events_247040: 6
- IDOTA2Events_570: 6
- IDOTA2Fantasy_2305270: 4
- IDOTA2Fantasy_247040: 4
- IDOTA2Fantasy_570: 4
- IDOTA2Guild_2305270: 4
- IDOTA2Guild_247040: 4
- IDOTA2Guild_570: 4
- IDOTA2League_2305270: 9
- IDOTA2League_247040: 9
- IDOTA2League_570: 9
- IDOTA2Match_247040: 9
- IDOTA2Match_570: 9
- IDOTA2MatchStats_247040: 1
- IDOTA2MatchStats_570: 1
- IDOTA2Operations_2305270: 1
- IDOTA2Operations_247040: 1
- IDOTA2Operations_570: 1
- IDOTA2Plus_2305270: 3
- IDOTA2Plus_247040: 3
- IDOTA2Plus_570: 3
- IDOTA2StreamSystem_247040: 2
- IDOTA2StreamSystem_570: 2
- IDOTA2Teams_2305270: 4
- IDOTA2Teams_247040: 4
- IDOTA2Teams_570: 4
- IDOTA2Ticket_247040: 3
- IDOTA2Ticket_570: 3
- IDOTAChat_2305270: 1
- IDOTAChat_247040: 1
- IDOTAChat_570: 1
- IEconDOTA2_247040: 6
- IEconDOTA2_570: 6
- IEconItems_1046930: 1
- IEconItems_1269260: 1
- IEconItems_247040: 2
- IEconItems_440: 7
- IEconItems_570: 2
- IEconItems_583950: 1
- IEconItems_620: 2
- IEconItems_730: 4
- IEconMarketService: 5
- IEconService: 13
- IEmbeddedClientService: 1
- IFamilyGroupsService: 27
- IForumsService: 10
- IFriendMessagesService: 4
- IFriendsListService: 2
- IGameCoordinator: 2
- IGameInventory: 9
- IGameNotificationsService: 10
- IGamePerformanceStatsService: 1
- IGameRecordingClipService: 1
- IGameServersService: 12
- IGCVersion_1046930: 2
- IGCVersion_1269260: 2
- IGCVersion_1422450: 2
- IGCVersion_2305270: 2
- IGCVersion_247040: 2
- IGCVersion_3488080: 2
- IGCVersion_3781850: 2
- IGCVersion_440: 2
- IGCVersion_570: 2
- IGCVersion_583950: 2
- IGCVersion_730: 1
- IHardwareTeamService: 1
- IHelpRequestLogsService: 2
- IInventoryService: 16
- ILobbyMatchmakingService: 3
- ILoyaltyRewardsService: 18
- IMarketingMessagesService: 22
- IMobileAppService: 1
- IMobileAuthService: 2
- IMobileDeviceService: 2
- IMobileNotificationService: 1
- INewsService: 5
- IOnlinePlayService: 1
- IParentalService: 14
- IPartnerAppNotesService: 4
- IPartnerDeadlineService: 2
- IPartnerDismissService: 3
- IPartnerFinancialsService: 3
- IPartnerMeetSteamService: 7
- IPartnerMembershipInviteService: 1
- IPartnerStoreBrowseService: 2
- IPhoneService: 5
- IPhysicalGoodsService: 1
- IPlayerService: 42
- IPlaytestService: 6
- IPortal2Leaderboards_620: 1
- IProductInfoService: 1
- IPromotionEventInvitesService: 6
- IPromotionPlanningService: 23
- IPromotionStatsService: 1
- IPublishedFileModerationService: 2
- IPublishedFileService: 20
- IPublishingService: 13
- IQuestService: 7
- IRemoteClientService: 8
- ISaleFeatureService: 11
- ISaleItemRewardsService: 6
- IShoppingCartService: 6
- ISiteLicenseService: 2
- ISteamApps: 12
- ISteamAwardsService: 4
- ISteamBitPay: 1
- ISteamBoaCompra: 1
- ISteamBroadcast: 2
- ISteamCDN: 2
- ISteamChartsService: 7
- ISteamCloudGaming: 1
- ISteamCommunity: 1
- ISteamDirectory: 3
- ISteamEconomy: 8
- ISteamEnvoy: 1
- ISteamGameServerStats: 1
- ISteamGPTRenderFarmService: 6
- ISteamGPTService: 5
- ISteamLeaderboards: 8
- ISteamLearnService: 32
- ISteamMicroTxn: 14
- ISteamMicroTxnSandbox: 10
- ISteamMLService: 3
- ISteamNews: 2
- ISteamNodwin: 1
- ISteamNotificationService: 6
- ISteamPayPalPaymentsHub: 1
- ISteamPublishedItemSearch: 4
- ISteamPublishedItemVoting: 2
- ISteamRemoteStorage: 7
- ISteamSpecialSurvey: 2
- ISteamTVService: 32
- ISteamUser: 12
- ISteamUserAuth: 1
- ISteamUserOAuth: 5
- ISteamUserStats: 7
- ISteamWebAPIUtil: 2
- ISteamWorkshop: 2
- IStoreAppSimilarityService: 2
- IStoreBrowseService: 7
- IStoreCatalogService: 4
- IStoreCurationService: 2
- IStoreMarketingService: 2
- IStorePreferencesService: 1
- IStoreQueryService: 5
- IStoreSalesService: 3
- IStoreService: 22
- IStoreTopSellersService: 2
- ISupportAgentsService: 1
- ISupportService: 3
- ITestExternalPrivilegeService: 2
- ITestService: 2
- ITFItems_440: 1
- ITFPromos_440: 2
- ITFPromos_620: 2
- ITFSystem_440: 1
- ITrustService: 1
- ITwoFactorService: 12
- IUserAccountService: 3
- IUserGameNotesService: 2
- IUserReviewsService: 2
- IUserStoreVisitService: 2
- IVACManagementService: 1
- IVideoService: 2
- IWishlistService: 12
- IWorkshopService: 5

## Important usage notes
- Do not treat the 1091-method xPaw mirror inventory as an official stability promise; it explicitly includes undocumented and protobuf-derived methods.
- For integration work, prefer the official partner docs for authentication, host selection, and policy, then use the mirror to discover the larger method surface.
- The partner-only host is powerful but unforgiving: repeated bad publisher-key requests can temporarily deny-list your IP.
- The mirror advises against XML unless you specifically need it.
- Many methods differ sharply in auth requirements and parameter style even within the same interface family.

## Integration notes for fireROUTE
- Model Steam as a very large interface/method/version API family, not as a small fixed REST surface.
- Store auth per method/interface where possible: public, user-key, publisher-key, or access-token capable.
- Preserve host affinity:
  - public/public-key calls generally target `api.steampowered.com`
  - secure publisher traffic should target `partner.steam-api.com`
- Treat rate limits and error semantics as method-specific, not globally uniform.
- If route-level coverage is needed later, expand from the interface-count appendix or from the mirror's per-interface pages.

## Sources inspected
- `https://steamapi.xpaw.me/`
- `https://steamapi.xpaw.me/ISteamUser`
- `https://steamapi.xpaw.me/IPlayerService`
- `https://steamapi.xpaw.me/ISteamApps`
- `https://steamapi.xpaw.me/ISteamNews`
- `https://steamapi.xpaw.me/ISteamWebAPIUtil`
- `https://partner.steamgames.com/doc/webapi/`
- `https://partner.steamgames.com/doc/webapi_overview`
