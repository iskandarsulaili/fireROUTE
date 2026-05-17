# Deezer

## Overview
- Provider: Deezer for developers
- Category: Music
- Official docs URL attempted: `https://developers.deezer.com/api`
- Official alternative page attempted: `https://developers.deezer.com/guidelines`
- Public developer homepage reviewed: `https://developers.deezer.com/`
- Current status: public API reference is blocked behind Deezer account login and acceptance of the "simple API" terms; no public endpoint catalog is exposed on the reviewed official pages

## What the official site currently confirms
- The public developer homepage advertises Deezer "Plugins, API and SDKs" and links to `/api`, `/musicplugins`, and `/guidelines`.
- Visiting `https://developers.deezer.com/api` currently redirects to a login-gated page that states: `You have to login to accept the terms and conditions of the simple API.`
- The public Guidelines page provides product and policy guidance, not an endpoint reference.
- The Guidelines page says Deezer integrations should implement features such as My Music, My Playlists, Mixes, and Search for full Deezer-enabled apps.
- The Guidelines page also documents user-level/content-access rules, including API access to `30s extract` playback for unlogged/freemium/premium cases while full-track unlimited playback is described under plugins, not the public API page.

## Confirmed endpoints
No public API routes could be confirmed from the currently accessible official Deezer pages.

Confirmed route count: **0**.

## Auth and access notes
- The official `/api` page is not publicly readable in the current browser session without logging in.
- Deezer explicitly says a user must log in to accept the Simple API terms and conditions before accessing that page.
- Because the public route reference is unavailable until after login/terms acceptance, this pass cannot safely confirm base URLs, methods, or parameter schemas from official public documentation alone.

## Blocker details
- Blocker type: official-doc login gate / public route reference unavailable.
- Tried official API page: `https://developers.deezer.com/api`
- Tried official alternative page: `https://developers.deezer.com/guidelines`
- Result: the API page remains blocked behind login and terms acceptance; the Guidelines page contains integration policy guidance only and does not publish the REST endpoint list.

## fireROUTE integration notes
- Keep Deezer marked as a manually reviewed blocker for now.
- Do not infer the old Deezer API surface from memory or third-party mirrors unless the official site later exposes the current route reference publicly again.
- If a future pass has valid Deezer developer credentials and the official `/api` reference becomes viewable, this file should be replaced with a full manual route inventory.

## Sources inspected
- `https://developers.deezer.com/`
- `https://developers.deezer.com/api`
- `https://developers.deezer.com/guidelines`
