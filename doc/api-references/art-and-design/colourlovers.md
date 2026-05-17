# ColourLovers

## Manual review status
- Category: Art & Design
- Official pages reviewed:
  - `https://www.colourlovers.com/api`
  - `https://www.colourlovers.com/api/colors`
- Manual review outcome: `manually_documented`
- Confirmed route count: `23`

## API overview
- Live docs host reviewed: `https://www.colourlovers.com/api`
- Official examples on the docs page still use `http://www.colourlovers.com/api/...` URLs, but the reviewed browser session successfully loaded the docs and example endpoints over `https://`
- Authentication:
  - no auth is documented on the reviewed pages
- Licensing and usage:
  - the docs page labels the API license as `Attribution-Noncommercial-Share Alike`
  - the page says users who want to use the API outside that license should contact COLOURlovers for permission
  - attribution credit to COLOURlovers.com is required
- Formats:
  - default `xml`
  - optional `json`
  - optional JSONP callback via `jsonCallback`
- Pagination:
  - collection/list endpoints document `numResults` with default `20` and maximum `100`
  - collection/list endpoints document `resultOffset` with default `0`

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/api/colors` | `lover`, `hueRange`, `briRange`, `keywords`, `keywordExact`, `orderCol`, `sortBy`, `numResults`, `resultOffset`, `format`, `jsonCallback` | Lists colors. |
| GET | `/api/colors/new` | same as `/api/colors` | Lists newly created colors. |
| GET | `/api/colors/top` | same as `/api/colors` | Lists top colors. |
| GET | `/api/colors/random` | none | Returns random colors; docs say no parameters are allowed. |
| GET | `/api/color/{hex}` | `hex`, optional `format`, `jsonCallback` | Returns one color by 6-character hex value. |
| GET | `/api/palettes` | `lover`, `hueOption`, `hex`, `hex_logic`, `keywords`, `keywordExact`, `orderCol`, `sortBy`, `numResults`, `resultOffset`, `format`, `jsonCallback`, `showPaletteWidths` | Lists palettes. |
| GET | `/api/palettes/new` | same as `/api/palettes` | Lists newly created palettes. |
| GET | `/api/palettes/top` | same as `/api/palettes` | Lists top palettes. |
| GET | `/api/palettes/random` | none | Returns random palettes; docs say no parameters are allowed. |
| GET | `/api/palette/{paletteId}` | `paletteId`, optional `format`, `jsonCallback`, `showPaletteWidths` | Returns one palette by id. |
| GET | `/api/patterns` | `lover`, `hueOption`, `hex`, `hex_logic`, `keywords`, `keywordExact`, `orderCol`, `sortBy`, `numResults`, `resultOffset`, `format`, `jsonCallback` | Lists patterns. |
| GET | `/api/patterns/new` | same as `/api/patterns` | Lists newly created patterns. |
| GET | `/api/patterns/top` | same as `/api/patterns` | Lists top patterns. |
| GET | `/api/patterns/random` | none | Returns random patterns; docs say no parameters are allowed. |
| GET | `/api/pattern/{patternId}` | `patternId`, optional `format`, `jsonCallback` | Returns one pattern by id. |
| GET | `/api/lovers` | `orderCol`, `sortBy`, `numResults`, `resultOffset`, `format`, `jsonCallback` | Lists lovers/users. |
| GET | `/api/lovers/new` | same as `/api/lovers` | Lists newly registered lovers/users. |
| GET | `/api/lovers/top` | same as `/api/lovers` | Lists top lovers/users. |
| GET | `/api/lover/{username}` | `username`, optional `comments`, `format`, `jsonCallback` | Returns one lover/user by username. |
| GET | `/api/stats/colors` | optional `format`, `jsonCallback` | Returns total color count. |
| GET | `/api/stats/palettes` | optional `format`, `jsonCallback` | Returns total palette count. |
| GET | `/api/stats/patterns` | optional `format`, `jsonCallback` | Returns total pattern count. |
| GET | `/api/stats/lovers` | optional `format`, `jsonCallback` | Returns total lover/user count. |

## Confirmed parameters and behavior notes
### Shared list controls
- `orderCol`: docs list `dateCreated`, `score`, `name`, `numVotes`, or `numViews`
- `sortBy`: `ASC` or `DESC`; default `ASC`
- `numResults`: default `20`, maximum `100`
- `resultOffset`: default `0`
- `format`: `xml` or `json`; default `xml`
- `jsonCallback`: enables JSONP and assumes `format=json`
- The docs say supplying `orderCol` overrides any `/new` or `/top` switch.

### Color search filters
- `lover`: creator username
- `hueRange`: two comma-separated hue values; left value must be less than right value
- `briRange`: two comma-separated brightness values; left value must be less than right value
- `keywords`: free-text search
- `keywordExact`: `0` or `1`

### Palette and pattern filters
- `hueOption`: combinations of `red`, `orange`, `yellow`, `green`, `aqua`, `blue`, `violet`, `fuchsia`
- `hex`: one valid 6-character hex or up to five comma-separated hex values
- `hex_logic`: `AND` or `OR`; default `AND`
- `showPaletteWidths`: `0` or `1` on palette endpoints

### Lover detail route
- `comments=1` includes the last 10 profile comments for the requested lover.

## Response, pagination, and format notes
- The docs page provides XML examples for color, palette, pattern, lover, and stats responses.
- JSON is documented as containing the same data in JSON form.
- The `/api/colors` example endpoint returned live XML in this session and included wrapper metadata such as `numResults` and `totalResults`.
- No dedicated HTTP error table or public rate-limit quota was published on the reviewed pages.

## Important usage notes
- The docs page says the API is provided without warranties and under its published attribution/noncommercial license conditions.
- Because the official docs still print `http://` example URLs while the reviewed pages loaded under `https://`, fireROUTE should prefer `https://www.colourlovers.com/api` when possible but preserve the provider's documented route shapes and parameters exactly.

## Sources inspected
- `https://www.colourlovers.com/api`
- `https://www.colourlovers.com/api/colors`
