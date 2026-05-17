# SwiftKanban

Official docs manually reviewed:
- `https://www.digite.com/knowledge-base/swiftkanban/article/api-for-swift-kanban-web-services/#restapi`
- `https://www.nimblework.com/knowledge-base/swiftkanban/article-category/web-services-api-documentation/`
- `https://www.nimblework.com/knowledge-base/swiftkanban/?s=REST+API+SwiftKanban`
- `https://www.nimblework.com/knowledge-base/swiftkanban/?s=admin+password`
- `https://login.swiftkanban.com/axis2/services/KanbanCardService?wsdl`
- `https://login.swiftkanban.com/axis2/services/listServices`

## Overview
The old Digité knowledge-base link no longer lands on a browsable `#restapi` section. In the current first-party NimbleWork knowledge base, the manually browsable API reference surface is the `Web Services API Documentation` category, which publishes five named SwiftKanban Axis2 service endpoints and their operation lists.

Confirmed from the reviewed official pages:
- documented service base family: `https://login.swiftkanban.com/axis2/services`
- documented service endpoints:
  - `https://login.swiftkanban.com/axis2/services/TeamMemberService`
  - `https://login.swiftkanban.com/axis2/services/KanbanCardService`
  - `https://login.swiftkanban.com/axis2/services/ExtensionService`
  - `https://login.swiftkanban.com/axis2/services/MetadataService`
  - `https://login.swiftkanban.com/axis2/services/ProjectService`
- the browsable official docs currently expose **79** named web-service operations across those five service pages
- the current KB still references `REST API` usage in search results and integration articles, but the manually accessible first-party reference content available in this run is service/operation oriented rather than a route-by-route REST catalog
- the reviewed service pages repeatedly note that `Project` corresponds to `Board` and `Iteration` corresponds to `Sprint` in the SwiftKanban UI

Manual route/operation count confirmed from the reviewed official docs for this pass: **79**.

## Confirmed service endpoints and operations
### 1. `TeamMemberService`
Documented EPR:
- `https://login.swiftkanban.com/axis2/services/TeamMemberService`

Documented operations:
1. `getTeamsForProjects`
2. `getTeamMembersForProject`
3. `getAllActiveUsersInOrg`
4. `adduser`
5. `deleteUser`
6. `addTeamMember`
7. `getUserData`
8. `getUserDataFromEmailId`
9. `getAllUsersLastLogin`

### 2. `KanbanCardService`
Documented EPR:
- `https://login.swiftkanban.com/axis2/services/KanbanCardService`

Documented operations:
1. `addCard`
2. `getCard`
3. `getCardsByFilter`
4. `moveCardOnBoard`
5. `blockCard`
6. `unblockCard`
7. `moveCardtoReady`
8. `moveCardToBacklog`
9. `getCardDetails`
10. `getCardsModifiedSincedate`
11. `archiveCard`
12. `updateCard`
13. `getSmartLaneDetails`
14. `addMultipleCard`
15. `updateMultipleCard`
16. `archiveMultipleCard`
17. `getMultipleCard`
18. `moveMultipleCardToReady`
19. `moveMultipleCardOnBoard`
20. `moveMultipleCardToBacklog`
21. `deleteCard`
22. `deleteMultipleCard`
23. `convertCard`
24. `transferCard`
25. `getBoardCards`
26. `discardAbortCard`
27. `discardAbortMultipleCard`

### 3. `ExtensionService`
Documented EPR:
- `https://login.swiftkanban.com/axis2/services/ExtensionService`

Documented operations:
1. `addCommentToCard`
2. `addIterationInRelease`
3. `addRelation`
4. `addRelease`
5. `createAttachment`
6. `deleteIterationFromRelease`
7. `deleteRelation`
8. `deleteRelease`
9. `deleteTodos`
10. `flagCard`
11. `getActivityLog`
12. `getAllRelationSinceDate`
13. `getAllTodos`
14. `getAttachmentContent`
15. `getAttachmentsInfo`
16. `getCardsInRelease`
17. `getCardsInIteration`
18. `getCardTypeHierarchyConstraint`
19. `getComments`
20. `getCommentsByDate`
21. `getCommentsByUser`
22. `getIterationsInRelease`
23. `getMultipleActivityLog`
24. `getReleaseList`
25. `getRelationType`
26. `getSingleCardRelation`
27. `getTodoModifiedSinceDate`
28. `getTodosByOwner`
29. `getTodosByStatus`
30. `modifyTodos`
31. `replyToComment`
32. `tagCardToIteration`
33. `tagCardsToRelease`
34. `unFlagCard`
35. `untagCardFromIteration`
36. `untagCardsFromRelease`
37. `updateIteration`
38. `updateRelease`

### 4. `MetadataService`
Documented EPR:
- `https://login.swiftkanban.com/axis2/services/MetadataService`

Documented operations:
1. `getCardListForProject`
2. `getCardMetadata`
3. `getDynamicLOVData`

### 5. `ProjectService`
Documented EPR:
- `https://login.swiftkanban.com/axis2/services/ProjectService`

Documented operations:
1. `getProject`
2. `getProjectsByOrganization`

## Parameters and authentication notes
The browsed `KanbanCardService` page exposes operation-level input tables rather than a single global auth page.

Confirmed from the reviewed `addCard` operation inputs:
- `projectId` - project identifier obtained from `ProjectService.getProject`
- `cardType` - card type obtained from `MetadataService.getCardListForProject`
- `userLoginId` - email/login of the SwiftKanban user
- `mode` - present but explicitly marked `Not used as of now`
- `fields` - list of field-name/value pairs; field names, types, and LOV guidance come from `MetadataService.getCardMetadata`

Additional auth signal confirmed from the official KB search results:
- current NimbleWork KB articles about REST-based integrations mention `Admin Password` / `Integration User Password` when describing SwiftKanban REST API calls
- taken together with the `userLoginId` field on the browsed service-operation page, the reviewed first-party material points to credential-based access using a SwiftKanban user/integration account rather than a public API-key model

What I could **not** confirm from the browsed official pages in this run:
- a single canonical public auth overview page
- a shared bearer-token/header scheme
- a current login-free route-by-route REST reference matching the old `#restapi` anchor URL

## Format, pagination, errors, and rate limits
Confirmed from the reviewed official material:
- the currently browsable API surface is documented as Axis2 `Service EPR` endpoints with named operations, not as a modern OpenAPI/Swagger REST reference
- the browsed service pages provide per-operation input/output examples and field descriptions rather than a universal pagination contract
- no shared public pagination scheme was exposed on the reviewed category page or the browsed operation page
- no public rate-limit policy was exposed on the reviewed first-party pages
- no shared error-schema page was surfaced in the reviewed first-party material

Important live-host note from direct official-host checks in this run:
- even though the KB articles still label the services `Active`, direct navigation to `https://login.swiftkanban.com/axis2/services/KanbanCardService?wsdl` and `https://login.swiftkanban.com/axis2/services/listServices` returned `404 - Not Found` in this environment
- implementers should therefore treat the KB documentation as evidence of the published operation surface, but re-verify runtime availability before building against the documented Axis2 endpoints

## Important usage notes
- SwiftKanban’s documented public API surface is split by service domain: projects, metadata, team members, cards, and extension/release/comment/todo utilities.
- The service docs explicitly require cross-service discovery: for example, card creation depends on project identifiers from `ProjectService` and field metadata/card types from `MetadataService`.
- Preserve SwiftKanban’s own terminology mapping when normalizing docs: `Project`/`Iteration` in the web-service layer maps to `Board`/`Sprint` in the product UI.
- Because the legacy REST anchor is no longer the browsable canonical reference, fireROUTE should model current SwiftKanban documentation primarily from the published service-operation catalog and keep a caution note about the current `404` behavior on directly probed service URLs.