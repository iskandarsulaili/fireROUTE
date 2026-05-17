# Gazette Data, UK

## Provider metadata
- Category: `Government`
- Provider slug: `gazette-data-uk`
- Official docs/pages used:
  - `https://www.thegazette.co.uk/data`
  - `https://www.thegazette.co.uk/data/formats`
  - `https://www.thegazette.co.uk/sparql`
  - official Gazette developer docs:
    - `https://github.com/TheGazette/DevDocs/blob/master/home.md`
    - `https://github.com/TheGazette/DevDocs/blob/master/notice/notice-feed.md`
    - `https://github.com/TheGazette/DevDocs/blob/master/notice/notice.md`
    - `https://github.com/TheGazette/DevDocs/blob/master/sparql/sparql.md`
  - live official endpoint checks during this review:
    - `https://www.thegazette.co.uk/all-notices/notice/data.json?categorycode=11&results-page-size=1`
    - `https://www.thegazette.co.uk/notice/2829074`
    - `https://www.thegazette.co.uk/notice/2829074/data.jsonld`
    - `https://www.thegazette.co.uk/sparql?query=SELECT%20*%20WHERE%20%7B%20?s%20?p%20?o%20%7D%20LIMIT%201&output=json`
    - `https://www.thegazette.co.uk/robots.txt`
- Current documented API host: `https://www.thegazette.co.uk`
- Auth model for reviewed open-data routes: no auth required
- Response formats confirmed from the official docs: HTML, Atom XML, JSON, XHTML+RDFa/XML, PDF, Turtle, RDF/XML, JSON-LD, RDF/JSON, SPARQL XML results, SPARQL JSON results
- Manually confirmed canonical route count: `19`

## Official usage notes
- The assigned `Re-using our data` page states Gazette open data is available under the Open Government Licence unless otherwise stated, but it explicitly excludes the re-use of personal data.
- The same page says Gazette linked-data and developer documentation are intended for re-use and points users to the official GitHub documentation, the SPARQL endpoint, and the Flint editor.
- The official docs describe two SPARQL datasets:
  - `/sparql` for modern Gazette notices from 1998 onward
  - `/longitudinal-dataset/sparql` for archive-derived material from 1900 to 1999
- The official site publishes crawl guidance rather than a standard API rate limit: respect `robots.txt`, especially the `Crawl-delay: 10`, and perform crawling between `9pm` and `7am`.
- The official feed documentation constrains `{service}` values to:
  - `all-notices`
  - `insolvency`
  - `wills-and-probate`
- The official feed docs and site content show edition scoping for `{edition}` values such as `London`, `Edinburgh`, and `Belfast`.

## Canonical endpoint inventory confirmed from the official Gazette docs
1. `GET /{service}/notice`
   - Purpose: generic notice-feed document URI for a service-wide search result set
   - Content negotiation on the generic URI supports Atom XML, JSON, and HTML

2. `GET /{service}/notice/data.feed`
   - Purpose: service-wide notice feed in Atom XML

3. `GET /{service}/notice/data.htm`
   - Purpose: service-wide notice feed in HTML

4. `GET /{service}/notice/data.json`
   - Purpose: service-wide notice feed in JSON
   - Live confirmation:
     - `GET /all-notices/notice/data.json?categorycode=11&results-page-size=1` returned HTTP `200` with JSON feed metadata and HATEOAS links

5. `GET /{service}/{edition}/notice`
   - Purpose: edition-scoped generic notice-feed document URI
   - Same representation model as the service-wide generic URI

6. `GET /{service}/{edition}/notice/data.feed`
   - Purpose: edition-scoped notice feed in Atom XML

7. `GET /{service}/{edition}/notice/data.htm`
   - Purpose: edition-scoped notice feed in HTML

8. `GET /{service}/{edition}/notice/data.json`
   - Purpose: edition-scoped notice feed in JSON

9. `GET /notice/{notice-id}`
   - Purpose: canonical notice document URI
   - Supports content negotiation for RDF, Turtle, JSON-LD, XML/XHTML+RDFa, and HTML
   - Query parameter:
     - `view=linked-data` - switch to the linked-data representation family
   - Live confirmation:
     - `GET /notice/2829074` returned HTTP `200` and HTML

10. `GET /notice/{notice-id}/data.htm`
    - Purpose: website view of one notice with page chrome

11. `GET /notice/{notice-id}/data.xml`
    - Purpose: notice content only in XHTML5/RDFa/XML form
    - Can also be requested with `?view=linked-data` for the linked-data XML view

12. `GET /notice/{notice-id}/data.pdf`
    - Purpose: PDF form of the notice

13. `GET /notice/{notice-id}/data.ttl`
    - Purpose: Turtle representation of the notice
    - Can also be requested with `?view=linked-data`

14. `GET /notice/{notice-id}/data.rdf`
    - Purpose: RDF/XML representation of the notice
    - Can also be requested with `?view=linked-data`

15. `GET /notice/{notice-id}/data.jsonld`
    - Purpose: JSON-LD representation of the notice
    - Live confirmation:
      - `GET /notice/2829074/data.jsonld` returned HTTP `200` with `application/ld+json`

16. `GET /notice/{notice-id}/data.rdfjson`
    - Purpose: RDF/JSON linked-data representation
    - Documented for use with `?view=linked-data`

17. `GET /notice/{notice-id}/data.json`
    - Purpose: JSON linked-data representation
    - Documented for use with `?view=linked-data`

18. `GET|POST /sparql`
    - Purpose: query the main Gazette linked-data dataset
    - Parameters:
      - `query` - URL-encoded SPARQL query text
      - `output` - one of `text`, `sparql`, `json`, `rdfxml`, `turtle`
    - Content negotiation supports `application/sparql-results+xml`, `application/rdf+xml`, `application/sparql-results+json`, and Turtle
    - Live confirmation:
      - `GET /sparql?query=SELECT * WHERE { ?s ?p ?o } LIMIT 1&output=json` returned HTTP `200` and `application/sparql-results+json`

19. `GET|POST /longitudinal-dataset/sparql`
    - Purpose: query the archive longitudinal dataset covering 1900-1999
    - Parameters and content-negotiation behavior match the main `/sparql` endpoint

## Feed parameters, pagination, and formats
- Feed-search parameters documented in the official notice-feed documentation:
  - `noticetype` - one or more 4-digit notice codes separated by `+`
  - `categorycode` - one or more 2-digit category codes separated by `+`
  - `start-publish-date`, `end-publish-date`
  - `start-date-of-death`, `end-date-of-death`
  - `start-claim-expiry-date`, `end-claim-expiry-date`
  - `location-postcode-[n]` - postcode or location text, up to 10 entries
  - `location-distance-[n]` - radius in miles; required alongside `location-postcode-[n]`
  - `location-local-authority-[n]` - named local authority
  - `edition`
  - `issue`
  - `results-page`
  - `results-page-size`
  - `sort-by` - examples published: `latest-date`, `oldest-date`
- Feed pagination is page-based through `results-page` and `results-page-size`.
- The official notice-feed docs say valid page bounds can be discovered from HATEOAS links in the response.
- Live JSON feed responses include HATEOAS-style links such as `first`, `next`, and alternate-format links.

## Error, auth, and access notes
- The reviewed public open-data routes did not require sign-in or API keys.
- The broader official DevDocs repository also documents account and notice-placement endpoints, but those are outside the public re-use surface documented on the assigned `data` page and are therefore out of scope here.
- The reviewed public docs did not publish a formal machine-readable error schema for notice-feed, notice-document, or SPARQL routes.
- No conventional numeric API rate-limit policy was published; instead, the official site publishes crawler restrictions in `robots.txt` and on the `Re-using our data` page.
- `robots.txt` currently sets `Crawl-delay: 10` and disallows crawling of several notice data representations and linked-data views, so automated harvesting should follow those operational rules even though the documentation describes the routes as public resources.

## fireROUTE integration notes
- Treat `https://www.thegazette.co.uk` as the canonical host for this provider.
- Keep the provider scoped to the public re-use routes: notice feeds, individual notice documents/representations, and the two SPARQL endpoints.
- Preserve the route-level distinction between generic document URIs plus content negotiation and representation-specific filenames.
- Preserve the `view=linked-data` switch exactly where documented for linked-data notice representations.
- Model Gazette feeds as page-based search endpoints and SPARQL as query endpoints rather than page-based feeds.
