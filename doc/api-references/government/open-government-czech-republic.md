# Open Government, Czech Republic

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-czech-republic`
- Official docs/pages used:
  - `https://data.gov.cz/english/`
  - `https://data.gov.cz/datov%C3%A9-sady`
  - `https://data.gov.cz/assets/catalog/js/dataset-list.js`
  - `https://data.gov.cz/datov%C3%A1-sada?iri=https%3A%2F%2Fdata.gov.cz%2Fzdroj%2Fdatov%C3%A9-sady%2F00025593%2F02f3decfbfdabecebd4c0548f55390a0`
- Current documented API host: `https://data.gov.cz`
- Current documented route families:
  - `/datové-sady`
  - `/datová-sada`
  - `/zdroj/datové-sady`
- Auth model: no API key or login requirement was published for the reviewed National Catalogue of Open Data browse and metadata routes
- Response formats confirmed in this run: HTML, JSON-LD
- Manually confirmed route count: `3`

## Official usage notes
- The English landing page identifies the site as the Czech `Portál o datech České republiky` and links directly into the National Catalogue of Open Data (`Národní katalog otevřených dat`).
- The reviewed catalogue page reported `30915` datasets and exposes many filters entirely through query-string routes on `https://data.gov.cz/datové-sady`.
- The official catalogue JavaScript asset `dataset-list.js` confirms additional search parameters by reading `window.search.localization` and building query strings from them.
- Individual dataset detail pages on `data.gov.cz` link both to the public HTML view and to a canonical source IRI under `/zdroj/datové-sady/...`, which returned JSON-LD metadata in this run.

## Canonical endpoints confirmed from the official site
1. `GET /datové-sady`
   - Base URL: `https://data.gov.cz`
   - Purpose: render the National Catalogue of Open Data dataset listing and filtering UI
   - Query parameters confirmed from live links on the official catalogue page:
     - `poskytovatel` - provider/publisher IRI filter
     - `témata` - topic IRI filter
     - `kategorie-hvd` - high-value-dataset category IRI filter
     - `formáty-datové-služby` - data-service format IRI filter
     - `formáty` - file-format IRI filter
     - `klíčová-slova` - keyword filter
     - `počet-poskytovatelů` - expand provider facet list
     - `počet-témat` - expand topic facet list
     - `počet-kategorie-hvd` - expand HVD facet list
     - `počet-formátů` - expand format facet list
     - `počet-klíčových-slov` - expand keyword facet list
   - Additional query parameters confirmed from the official `dataset-list.js` asset via `window.search.localization`:
     - `dotaz` - free-text search string
     - `časové-období-začátek` - temporal start filter
     - `časové-období-konec` - temporal end filter
     - `vdf-veřejné-údaje=1` - public-data toggle
     - `vdf-číselník=1` - codelist toggle
     - `hvd=1` - HVD-only toggle
     - `dynamická-data=1` - dynamic-data toggle
   - Live confirmation:
     - the reviewed page returned HTML titled `Datové sady - Národní katalog otevřených dat (NKOD)`
     - the page showed `Nalezeno 30915 datových sad`
     - live facet links embedded the parameters above directly into the URL

2. `GET /datová-sada`
   - Base URL: `https://data.gov.cz`
   - Purpose: render the HTML detail page for a single dataset in NKOD
   - Query parameters:
     - `iri` - required dataset IRI, for example `https://data.gov.cz/zdroj/datové-sady/{publisher_id}/{dataset_id}` URL-encoded into the query string
   - Live confirmation:
     - a reviewed dataset detail page returned HTML titled `Porovnání cen vybraných zemědělských a průmyslových výrobků a spotřebitelských cen potravinářského zboží - Národní katalog otevřených dat (NKOD)`
     - the page exposed distribution cards, media types, publisher info, and a canonical source-IRI link
     - an invalid `iri` value returned HTTP `404` with an HTML not-found page

3. `GET /zdroj/datové-sady/{publisher_id}/{dataset_id}`
   - Base URL: `https://data.gov.cz`
   - Purpose: return the canonical linked-data representation for a dataset source IRI
   - Path parameters:
     - `{publisher_id}` - publisher identifier segment used by the canonical dataset IRI
     - `{dataset_id}` - dataset identifier segment used by the canonical dataset IRI
   - Response negotiation:
     - the reviewed request sent `Accept: application/ld+json, text/turtle, application/rdf+xml, text/html`
     - the route responded with JSON-LD in this run
   - Live confirmation:
     - `https://data.gov.cz/zdroj/datové-sady/00025593/02f3decfbfdabecebd4c0548f55390a0` returned HTTP `200`
     - the response content type was `application/ld+json; charset=utf-8`
     - the returned JSON-LD context contained DCAT/DC Terms style metadata keys such as `contactPoint`, `spatial`, `theme`, and `publisher`
     - a deliberately invalid source IRI path returned HTTP `200` with an empty JSON object `{}` rather than a 404

## Pagination, filtering, and format notes
- The reviewed catalogue page is a query-string-driven HTML search surface, not a CKAN-style action API.
- The official page exposed a broad filter vocabulary through URL parameters, with IRIs preserved literally in parameters such as `poskytovatel`, `témata`, `kategorie-hvd`, and `formáty`.
- The reviewed catalogue DOM and JavaScript asset did not publish a separate JSON pagination API; no explicit page/offset contract was documented on the reviewed official pages in this run.
- Dataset source IRIs are the machine-readable layer; they returned JSON-LD directly when requested with semantic Accept headers.

## Error, auth, and access notes
- No public rate-limit or quota policy was published on the reviewed official Czech pages.
- No API key, OAuth flow, or login requirement was published for the reviewed catalogue routes.
- `GET /datová-sada` returned a normal HTML `404` page for an invalid dataset IRI.
- `GET /zdroj/datové-sady/{publisher_id}/{dataset_id}` returned an empty JSON object for an invalid source path in this run, so consumers should not assume missing records will surface as HTTP `404`.

## fireROUTE normalization notes
- Treat `https://data.gov.cz/datové-sady` as the canonical catalogue-search route for this provider.
- Treat `https://data.gov.cz/datová-sada?iri=...` as the human-readable dataset detail route.
- Treat `https://data.gov.cz/zdroj/datové-sady/{publisher_id}/{dataset_id}` as the provider-owned machine-readable metadata route.
- Do not absorb external distribution endpoints linked from individual dataset pages, such as `data.csu.gov.cz`, into the `open-government-czech-republic` provider route count.