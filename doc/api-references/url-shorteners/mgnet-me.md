# Mgnet.me

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `mgnet-me`
- Official pages reviewed manually:
  - `http://mgnet.me/api.html`
  - `http://mgnet.me/`
- Current extraction outcome: explicit expired-hosting / unavailable-provider blocker
- Confirmed current public API base URL: none
- Manually confirmed current route count: `0`

## Manual review result
Mgnet.me should currently be treated as an unavailable provider rather than as a live URL-shortener API.

During this pass, both the indexed API page and the provider root redirected to the same Cafe24 expiration notice instead of to provider-controlled API documentation.

## What the official pages showed
### 1) Indexed API page
- Requested: `http://mgnet.me/api.html`
- Final loaded URL during browser review: `https://hostinfo.cafe24.com/serviceExpire/expiration.html?domain=mgnet.me`
- Visible page title: `카페24 | 온라인 커머스의 모든것`
- Visible first-party result on the loaded page:
  - heading: `사용하고 있는 호스팅 서비스 이용 기간이 만료되었습니다.`
  - support prompt: `궁금한 점은 카페24 호스팅 고객센터로 문의해 주세요.`
- No provider-owned route list, request examples, auth notes, or parameter reference were visible.

### 2) Official root tried as the alternative first-party page
- Requested: `http://mgnet.me/`
- Final loaded URL during browser review: `https://hostinfo.cafe24.com/serviceExpire/expiration.html?domain=mgnet.me`
- Visible result: the same Cafe24 hosting-expiration page as the indexed docs URL
- Outcome: the provider root also failed to expose a live API landing page or any route-level documentation

## Missing information caused by the blocker
Because the reviewed official pages no longer expose a live provider surface, I could not responsibly confirm:
- current API base URL
- endpoint paths
- supported HTTP methods
- request parameters or payload fields
- authentication requirements beyond the old index metadata saying `No`
- rate limits
- pagination behavior
- response formats
- error formats

## fireROUTE integration note
Keep Mgnet.me marked as a blocker-style `manually_documented` provider with `0` confirmed routes unless the provider republishes a live first-party API reference on a provider-controlled host.

## Verification note
This file was manually rebuilt from the indexed Mgnet.me docs URL plus the official root using browser inspection only. No current routes were counted because both reviewed official pages now resolve to a hosting-expiration notice.