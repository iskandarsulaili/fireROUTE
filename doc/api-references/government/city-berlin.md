# City, Berlin

## Provider metadata
- Category: `Government`
- Provider slug: `city-berlin`
- Official docs/pages used:
  - `https://daten.berlin.de/`
  - `https://daten.berlin.de/datensaetze`
  - `https://daten.berlin.de/search/fork?category=data&keys=Berlin`
  - `https://daten.berlin.de/datensaetze?q=Berlin`
  - `https://daten.berlin.de/datensaetze/pflege-kernindikatoren-pflege-profil-berlin-gesamt-2019-2023-1670296`
  - `https://daten.berlin.de/drupal_feeds/custom.rss?q=Berlin&fq=`
  - `https://daten.berlin.de/datensaetze/this-slug-should-not-exist-xyz`
- Assigned docs URL: `https://daten.berlin.de/`
- Current documented provider host: `https://daten.berlin.de`
- Current documented route families:
  - `/search/fork`
  - `/datensaetze`
  - `/datensaetze/{dataset_slug}`
  - `/drupal_feeds/custom.rss`
- Auth model: no API key or login requirement was published for the reviewed public catalogue routes
- Response formats confirmed in this run: HTML and RSS XML
- Manually confirmed route count: `4`

## Official usage notes
- The official homepage loaded as `Home | Berlin Open Data` and presents the service as a catalogue of open datasets, applications, and articles rather than as a CKAN-style JSON API reference.
- The official dataset index at `https://daten.berlin.de/datensaetze` loaded successfully and exposed a stable GET-based browse/search contract through its search form, facet links, pagination links, and RSS link.
- The reviewed live dataset pages linked to mixed underlying resource formats such as `CSV`, `WMS`, `WFS`, and `WMTS`, plus some off-host downloads, so those resource URLs should stay dataset-specific and should not be normalized as provider-wide Berlin routes.
- Although the site ships frontend assets with names like `ckan_snippets.js`, the reviewed official pages did not publish a reusable provider-owned JSON route inventory. The provider-wide surface that was directly confirmed in this run is the HTML/RSS catalogue documented below.

## Canonical endpoints confirmed from the official site
1. `GET /search/fork`
   - Base URL: `https://daten.berlin.de`
   - Purpose: route the global site search form into the appropriate Berlin Open Data content section.
   - Query parameters confirmed from the live official form:
     - `category` - content target; reviewed values on the form were `data` and `articles`
     - `keys` - free-text search query
   - Live confirmation:
     - the live global search form on the official site used action `https://daten.berlin.de/search/fork` with method `GET`
     - `https://daten.berlin.de/search/fork?category=data&keys=Berlin` redirected to `https://daten.berlin.de/datensaetze?q=Berlin`

2. `GET /datensaetze`
   - Base URL: `https://daten.berlin.de`
   - Purpose: browse, search, facet-filter, and paginate the public dataset catalogue.
   - Query parameters confirmed from live forms and official links:
     - `q` - free-text dataset search query
     - `groups` - category/group filter
     - `tags` - keyword filter
     - `license_id` - licence filter
     - `author_string` - publishing organization filter
     - `geographical_coverage` - geographic coverage filter
     - `geographical_granularity` - geographic granularity filter
     - `temporal_granularity` - temporal granularity filter
     - `page` - page number for paginated result pages
     - `root_breadcrumb` - breadcrumb/pagination state parameter seen on numbered page links
   - Live confirmation:
     - `https://daten.berlin.de/datensaetze` loaded as `Datensätze | Berlin Open Data`
     - the reviewed page exposed `2.601 Datensätze gefunden`
     - pagination links used URLs such as `https://daten.berlin.de/datensaetze?root_breadcrumb=Berlin+Open+Data&page=2`
     - the dataset search form used `GET https://daten.berlin.de/datensaetze` with a `q` input
     - dataset detail pages linked back into filtered result sets such as `?groups=sozial`, `?license_id=cc-zero`, `?tags=Demographie`, and `?author_string=Senatsverwaltung+für+Wissenschaft%2C+Gesundheit+und+Pflege`

3. `GET /datensaetze/{dataset_slug}`
   - Base URL: `https://daten.berlin.de`
   - Purpose: show one dataset-detail page with provider metadata, filter links, and resource/download links.
   - Path parameter:
     - `{dataset_slug}` - Berlin dataset slug visible in official result links
   - Live confirmation:
     - `https://daten.berlin.de/datensaetze/pflege-kernindikatoren-pflege-profil-berlin-gesamt-2019-2023-1670296` loaded as `Pflege-Kernindikatoren: Pflege-Profil Berlin gesamt 2019-2023 | Berlin Open Data`
     - the reviewed detail page published metadata such as licence, category, geographic coverage, temporal coverage, publishing organization, tags, and direct resource links
     - a deliberate missing-slug check at `https://daten.berlin.de/datensaetze/this-slug-should-not-exist-xyz` rendered an official HTML 404 page stating `Seite nicht gefunden.` / `Fehler 404` and `Der Datensatz this-slug-should-not-exist-xyz konnte nicht gefunden werden.`

4. `GET /drupal_feeds/custom.rss`
   - Base URL: `https://daten.berlin.de`
   - Purpose: return an RSS feed for the current dataset search/filter state.
   - Query parameters confirmed from the live official RSS link:
     - `q` - free-text search query
     - `fq` - filter query string
   - Live confirmation:
     - the official dataset index linked to `https://daten.berlin.de/drupal_feeds/custom.rss?q=&fq=` as `Diese Seite als RSS-Feed öffnen`
     - `https://daten.berlin.de/drupal_feeds/custom.rss?q=Berlin&fq=` returned RSS XML beginning with `<?xml version='1.0' encoding='UTF-8'?>`
     - the returned feed described itself as `Berlin Open Data - Datasets`

## Pagination, filtering, and format notes
- The documented provider-owned surface is catalogue-oriented and HTML-first, with RSS available for dataset search results.
- Pagination is page-based through `page=` on `/datensaetze` result links.
- Filtering is query-string based through parameters such as `groups`, `tags`, `license_id`, `author_string`, `geographical_coverage`, `geographical_granularity`, and `temporal_granularity`.
- Dataset-detail pages frequently link to provider metadata plus dataset-specific resource files or service endpoints; those downstream resources vary by dataset and should be modeled separately when they belong to another provider or format family.

## Error, auth, and access notes
- No public API key, OAuth flow, or login step was required for the documented catalogue routes.
- No official rate-limit or quota policy was published on the reviewed official pages.
- The reviewed provider-owned errors were HTML pages rather than structured JSON errors; the missing dataset-slug check returned an official `Fehler 404` page.
- No provider-wide JSON error schema or machine-readable OpenAPI contract was published on the reviewed official pages.

## fireROUTE normalization notes
- Treat `https://daten.berlin.de` as the canonical provider host for this record.
- Model this provider around the official catalogue/search routes that are actually reachable on the Berlin host.
- Keep the route family HTML/RSS-based; do not infer undocumented CKAN, Drupal JSON, or generic portal APIs from frontend asset names alone.
- Keep dataset resource downloads and map-service URLs dataset-scoped unless Berlin later publishes a provider-wide route reference for them.
