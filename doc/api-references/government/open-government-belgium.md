# Open Government, Belgium

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-belgium`
- Official docs/pages used:
  - `https://data.gov.be/en`
  - `https://data.gov.be/en/api-rss`
  - `https://data.gov.be/en/rss.xml`
  - `https://github.com/Fedict/dcat`
  - `https://github.com/Fedict/dcat/blob/master/all/cat.nt`
  - `https://github.com/Fedict/dcat/blob/master/all/datagovbe.nt.gz`
  - `https://github.com/Fedict/dcat/blob/master/all/datagovbe_edp.xml.gz`
- Current documented delivery hosts:
  - `https://data.gov.be`
  - `https://github.com`
- Current documented path families:
  - `/en/rss.xml`
  - `/Fedict/dcat/raw/refs/heads/master/all`
- Auth model: no API key or login requirement was published on the reviewed official pages; the reviewed feed and export routes were publicly accessible
- Response format: RSS XML, N-Triples, gzipped N-Triples, and gzipped RDF/XML
- Manually confirmed route count: `4`

## Official usage notes
- The official `API / RSS` page states that a full download of all metadata in DCAT-AP is available on GitHub and that an RSS feed is also available.
- The official `Fedict/dcat` repository README states that the metadata used to update the Belgian portal is available as N-Triples and RDF/XML.
- The reviewed repository pages exposed `Raw` download buttons for the catalogue export files, giving stable file-delivery routes for the published metadata snapshots.
- The same `API / RSS` page also advertises an experimental Linked Data Fragments server at `https://ldf.belgif.be/datagovbe`, but direct browser navigation from this environment did not yield a trustworthy provider response during this run, so it is noted but excluded from the canonical route count.

## Canonical endpoints confirmed from the official site
1. `GET /en/rss.xml`
   - Base URL: `https://data.gov.be`
   - Purpose: return the portal RSS feed covering site news and dataset updates
   - Query parameters: none shown on the reviewed official page or live feed response
   - Live confirmation:
     - returned RSS XML titled `Data.gov.be`
     - returned channel `link` `https://data.gov.be/en`
     - returned feed items with `title`, `link`, `description`, `pubDate`, `dc:creator`, and `guid`

2. `GET /Fedict/dcat/raw/refs/heads/master/all/cat.nt`
   - Base URL: `https://github.com`
   - Purpose: return the published Belgian DCAT catalogue export as plain N-Triples
   - Query parameters: none shown in the reviewed repository UI
   - Live confirmation:
     - the reviewed `Raw` button opened a resolved raw file view containing N-Triples statements such as catalog title, description, license, and publisher metadata
     - the resolved raw response pointed at `https://raw.githubusercontent.com/Fedict/dcat/refs/heads/master/all/cat.nt`

3. `GET /Fedict/dcat/raw/refs/heads/master/all/datagovbe.nt.gz`
   - Base URL: `https://github.com`
   - Purpose: download the full Belgian metadata export as gzipped N-Triples
   - Query parameters: none shown in the reviewed repository UI
   - Live confirmation:
     - the reviewed repository blob page exposed a `Raw` button for this file
     - following that `Raw` link triggered a file download in the browser during this run
     - the reviewed blob page reported file size `39.2 MB`

4. `GET /Fedict/dcat/raw/refs/heads/master/all/datagovbe_edp.xml.gz`
   - Base URL: `https://github.com`
   - Purpose: download the EDP-targeted Belgian metadata export as gzipped RDF/XML
   - Query parameters: none shown in the reviewed repository UI
   - Live confirmation:
     - the reviewed repository blob page exposed a `Raw` button for this file
     - following that `Raw` link triggered a file download in the browser during this run
     - the repository README identifies this file as the `pretty-print` RDF/XML serialization harvested by the European Data Portal

## Pagination, filtering, and format notes
- None of the reviewed canonical routes published pagination or filter parameters.
- `GET /en/rss.xml` is an RSS XML feed.
- `GET /Fedict/dcat/raw/refs/heads/master/all/cat.nt` is a plain N-Triples export.
- `GET /Fedict/dcat/raw/refs/heads/master/all/datagovbe.nt.gz` is a gzip-compressed N-Triples export.
- `GET /Fedict/dcat/raw/refs/heads/master/all/datagovbe_edp.xml.gz` is a gzip-compressed RDF/XML export.

## Error, auth, and access notes
- No public rate-limit policy was published on the reviewed official pages.
- No API key, OAuth flow, or authenticated developer account requirement was published for the reviewed feed and export routes.
- The GitHub raw export routes are file-delivery endpoints rather than interactive JSON APIs.
- The experimental Linked Data Fragments host should not be normalized until a stable live response is revalidated from the browser environment.

## fireROUTE normalization notes
- Treat this provider as a metadata-feed and file-export surface, not a JSON CRUD API.
- Preserve the portal RSS route on `https://data.gov.be` separately from the GitHub-hosted export routes.
- Keep the GitHub raw export filenames exact because the official docs point users to that repository for full-download access.
- Do not include the advertised Linked Data Fragments endpoint in the canonical count until its live behavior is revalidated.