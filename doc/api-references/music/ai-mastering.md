# AI Mastering

## Overview
- Provider: AI Mastering API
- Category: Music
- Official docs: `https://aimastering.com/api_docs/`
- Official alternative doc reviewed: `https://app.swaggerhub.com/apis/aimastering/aimastering`
- Machine-readable spec reviewed: `https://api.swaggerhub.com/apis/aimastering/aimastering/1.0.0`
- Base URL: `https://api.bakuage.com/`
- Auth: bearer token in `Authorization` header according to the official SwaggerHub spec; the API also exposes `POST /access_tokens` to create an API access token
- HTTPS: yes
- Request formats: JSON responses; many write routes use `multipart/form-data` / `formData` parameters in the published Swagger 2.0 spec
- Pagination: no global pagination scheme or numeric limit was stated in the inspected docs/spec
- Rate limits: no numeric rate limits were stated on the inspected official pages

## Important doc-state note
The landing page still links a "Raw Open API Specification" URL at `https://aimastering.com/api/api_spec.json`, but that URL returned a 404 XML error during this review. The linked official SwaggerHub API definition is still live and was used as the authoritative route source for this rewrite.

## Confirmed endpoint families
The official SwaggerHub definition publishes 53 method/path combinations.

| Family | Count | Confirmed routes |
|---|---:|---|
| `accessToken` | 1 | `POST /access_tokens` |
| `amazonSubscription` | 1 | `GET /amazon_subscriptions` |
| `audio` | 7 | `POST /audios`, `GET /audios`, `GET /audios/{id}`, `GET /audios/{id}/download`, `GET /audios/download_by_token`, `GET /audios/{id}/download_token`, `GET /audios/{id}/analysis` |
| `config` | 1 | `GET /config` |
| `externalSearch` | 1 | `GET /external_search` |
| `libraryAudio` | 7 | `POST /library_audios`, `GET /library_audios`, `GET /library_audios/{id}`, `PUT /library_audios/{id}`, `DELETE /library_audios/{id}`, `GET /library_audios/{id}/analysis`, `POST /library_audios/{id}/like` |
| `mastering` | 10 | `POST /masterings`, `GET /masterings`, `GET /masterings/{id}`, `PUT /masterings/{id}`, `DELETE /masterings/{id}`, `PUT /masterings/{id}/cancel`, `PUT /masterings/{id}/review`, `PUT /masterings/{id}/free_unlock`, `GET /masterings/{id}/unlock_product`, `POST /masterings/{id}/publish` |
| `payment` | 4 | `POST /payments`, `GET /payments`, `GET /payments/{id}`, `PUT /payments/{id}/execute` |
| `paymentCustomer` | 1 | `GET /payment_customers/default` |
| `plan` | 1 | `GET /plans` |
| `spSubscription` | 2 | `POST /sp_subscriptions`, `GET /sp_subscriptions` |
| `statistics` | 3 | `GET /statistics/anonymized_masterings`, `GET /statistics/kpis`, `GET /statistics/group_buy` |
| `subscription` | 5 | `POST /subscriptions`, `GET /subscriptions`, `GET /subscriptions/{id}`, `PUT /subscriptions/{id}/cancel`, `PUT /subscriptions/{id}/cancel_cancellation` |
| `user` | 4 | `PUT /users/self`, `GET /users/self`, `PUT /users/self/notify_registration`, `POST /users/self/send_invitation` |
| `video` | 5 | `GET /videos`, `GET /videos/{id}`, `GET /videos/{id}/download`, `GET /videos/download_by_token`, `GET /videos/{id}/download_token` |

Confirmed route count: **53**.

## Key parameters and request notes
### Audio and library-audio upload/download flows
- `POST /audios`
  - documented form fields include `file` and `name`
- `POST /library_audios`
  - documented form upload route for library audio creation
- Download flows use either a resource ID route such as `/audios/{id}/download` or token-based routes such as `/audios/download_by_token`
- Analysis routes exist for both uploaded audio and library audio:
  - `/audios/{id}/analysis`
  - `/library_audios/{id}/analysis`

### Mastering routes
The create-mastering route is the most parameter-heavy route in the official spec.

`POST /masterings` requires `input_audio_id` and documents optional controls including:
- `mode`
- `bass_preservation`
- `mastering`
- `mastering_algorithm`
- `noise_reduction`
- `preset`
- `target_loudness`
- `target_loudness_mode`
- `mastering_matching_level`
- `mastering_reverb`
- `mastering_reverb_gain`
- `reference_audio_id`
- `low_cut_freq`
- `high_cut_freq`
- `ceiling`
- `ceiling_mode`
- `oversample`
- `sample_rate`
- `bit_depth`
- `output_format`
- `for_preview`
- `start_at`
- `end_at`
- `video_title`

Related mastering actions use resource IDs in the path:
- `PUT /masterings/{id}`
- `PUT /masterings/{id}/cancel`
- `PUT /masterings/{id}/review`
- `PUT /masterings/{id}/free_unlock`
- `GET /masterings/{id}/unlock_product`
- `POST /masterings/{id}/publish`

Additional documented action parameters include:
- `/masterings/{id}/review`: `review_comment`, `review_score`
- `/masterings/{id}/publish`: required `access_token`, required `message`, optional `access_token_secret`

### Payments and subscriptions
- `POST /payments` requires `product_token`
- `PUT /payments/{id}/execute` requires `payer_id`
- `POST /subscriptions` requires `service` and documents optional token/plan fields such as `token` and `stripe_plan_id`
- `POST /sp_subscriptions` documents a `receipt` field

### User/profile routes
- `PUT /users/self` documents optional profile/account fields including `agreed_terms_of_service` and `email`
- `PUT /users/self/notify_registration` documents affiliate-tracking fields such as `affiliate_id` and `referrer_url`
- `POST /users/self/send_invitation` requires `invitee_email`

### External search
- `GET /external_search` requires query parameters `query` and `country`

## Response and error notes
- The SwaggerHub definition publishes JSON responses (`application/json`)
- Successful responses use `200` or `201` depending on the operation
- Every published operation also includes a `default` error response, but the inspected spec does not define a richer shared error schema with named HTTP status examples
- The spec models many domain objects such as audio, mastering, subscription, payment, and video objects in the definitions section

## fireROUTE integration notes
- Treat AI Mastering as a bearer-auth HTTPS API rooted at `https://api.bakuage.com/`
- Expect many write routes to require `formData`/multipart-style inputs rather than JSON bodies
- Separate media-upload/download flows from mastering-job lifecycle routes; they are distinct route families in the official spec
- Do not rely on the broken raw-spec URL from the landing page; use the working official SwaggerHub definition as the maintained source of truth
- Because no global pagination or rate-limit contract was stated in the inspected docs, keep those behaviors provider-specific and conservative in any adapter

## Sources inspected
- `https://aimastering.com/api_docs/`
- `https://aimastering.com/api/api_spec.json` (official page link; returned 404 during review)
- `https://app.swaggerhub.com/apis/aimastering/aimastering`
- `https://api.swaggerhub.com/apis/aimastering/aimastering/1.0.0`
