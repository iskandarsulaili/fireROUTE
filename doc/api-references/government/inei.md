# INEI

## Provider metadata
- Category: `Government`
- Provider slug: `inei`
- Assigned docs URL: `http://iinei.inei.gob.pe/microdatos/`
- Official docs/pages used:
  - `http://iinei.inei.gob.pe/microdatos/`
  - `https://www.gob.pe/inei/`
  - `https://www.gob.pe/institucion/inei/informes-publicaciones/2727403-catalogo-de-base-de-datos-2026`
  - `https://proyectos.inei.gob.pe/microdatos/`
- Current documented provider host: `https://proyectos.inei.gob.pe`
- Current documented API/path families:
  - `/microdatos/`
  - `/microdatos/Consulta_por_Encuesta.asp`
  - `/microdatos/Consulta_por_Documentos.asp`
  - `/microdatos/CambiaEnc.asp`
  - `/microdatos/CambiaAnio.asp`
  - `/microdatos/cambiaPeriodo.asp`
  - `/microdatos/CambiaPeriodoDoc.asp`
  - `/microdatos/Detalle_Encuesta.asp`
  - `/microdatos/VerificaFicha.asp`
  - `/microdatos/VerificaDoc.asp`
  - `/iinei/srienaho/descarga/...`
- Auth model: no login, API key, or token requirement was presented on the reviewed public microdata routes
- Response/data formats confirmed in this run:
  - HTML pages and HTML fragments
  - PDF on technical-sheet/document viewers
  - ZIP downloads on observed module download links
  - the official 2026 catalog page also says direct downloads are offered in CSV, SPSS, DBF, or STATA depending on dataset
- Manually confirmed canonical route count: `14`

## Official usage notes
- The assigned host `http://iinei.inei.gob.pe/microdatos/` was not usable in this run; navigation aborted before the page rendered.
- The official INEI state page on `gob.pe` was reachable and linked directly to `https://proyectos.inei.gob.pe/microdatos/` under the visible `Microdatos` link.
- The official `Catálogo de Base de Datos 2026` page says the catalog provides direct access to bases de datos and their documentation, and explicitly advertises downloads in `CSV`, `SPSS`, `DBF`, or `STATA` depending on the resource.
- The linked HTTPS microdata system was reachable and is a classic server-rendered HTML application rather than a JSON REST API.
- The first-party front-end code and live fragment requests show that the site is organized around a small set of ASP endpoints that progressively load year, period, module, and document tables.

## Canonical endpoints confirmed from the official site and first-party front-end code
1. `GET /microdatos/`
   - Base URL: `https://proyectos.inei.gob.pe`
   - Purpose: public landing page for the INEI Microdatos system.
   - Live confirmation:
     - page title: `PERÚ Instituto Nacional de Estadística e Informática`
     - visible text says the system provides bases de datos and documentation for INEI investigations and surveys.

2. `GET /microdatos/guiadeusuario.html`
   - Base URL: `https://proyectos.inei.gob.pe`
   - Purpose: load the user guide/FAQ and terms content used by the front-end `GuiaUsuario()` action.
   - Live confirmation:
     - a same-origin fetch returned HTML containing `Preguntas Frecuentes` and `Términos y Condiciones de Uso` tabs.

3. `GET /microdatos/Consulta_por_Encuesta.asp`
   - Base URL: `https://proyectos.inei.gob.pe`
   - Purpose: render the survey-based browsing form.
   - Confirmed query parameter:
     - `CU` - portal context identifier; observed value `19558`
   - Live confirmation:
     - `GET .../Consulta_por_Encuesta.asp?CU=19558` returned the survey-selection workflow.

4. `POST /microdatos/Consulta_por_Encuesta.asp`
   - Base URL: `https://proyectos.inei.gob.pe`
   - Purpose: submit the survey selection form.
   - Confirmed form fields from the official HTML:
     - `CodEncuesta`
     - `wAccion`
     - `CU`
     - `wAno`
     - `wPer`
     - `wTitulo`
     - `cmbEncuesta0`
     - `cmbEncuestaA`
     - `cmbEncuestaN`
     - `cmbEncuesta_EPE`
     - `cmbEncuesta`
     - `cmbAnno`
     - `cmbTrimestre`
     - `IS`
     - `txtContador`
     - `txtOpcion`
   - Notes:
     - the form is HTML-first and drives later AJAX fragment requests.

5. `GET /microdatos/Consulta_por_Documentos.asp`
   - Base URL: `https://proyectos.inei.gob.pe`
   - Purpose: render the methodology/documentation browser.
   - Confirmed query parameter:
     - `CU` - observed value `19558`
   - Live confirmation:
     - `GET .../Consulta_por_Documentos.asp?CU=19558` returned the document-selection workflow.

6. `POST /microdatos/Consulta_por_Documentos.asp`
   - Base URL: `https://proyectos.inei.gob.pe`
   - Purpose: submit the documentation selection form.
   - Confirmed form fields from the official HTML:
     - `CodEncuesta`
     - `wAccion`
     - `CU`
     - `wAno`
     - `wPer`
     - `wTitulo`
     - `cmbEncuesta0`
     - `cmbEncuestaA`
     - `cmbEncuestaN`
     - `cmbEncuesta_EPE`
     - `cmbEncuesta`
     - `cmbAnno`
     - `cmbTrimestre`
     - `IS`
     - `txtContador`
     - `txtOpcion`

7. `POST /microdatos/CambiaEnc.asp`
   - Base URL: `https://proyectos.inei.gob.pe`
   - Purpose: return the year selector for the chosen survey.
   - Confirmed request body parameters from the official JavaScript:
     - `bandera=1`
     - `_cmbEncuesta`
     - `_cmbEncuesta0`
   - Live confirmation:
     - posting `_cmbEncuesta=CENSO DE INFRAESTRUCTURA EDUCATIVA` returned an HTML fragment with a `cmbAnno` select containing `2013`.

8. `POST /microdatos/CambiaAnio.asp`
   - Base URL: `https://proyectos.inei.gob.pe`
   - Purpose: return the period selector for a survey/year combination.
   - Confirmed request body parameters from the official JavaScript:
     - `bandera=1`
     - `_cmbEncuesta`
     - `_cmbAnno`
     - `_cmbEncuesta0`
   - Live confirmation:
     - posting the census sample above plus `_cmbAnno=2013` returned an HTML fragment with `cmbTrimestre` and the period value `105` labeled `Anual`.

9. `POST /microdatos/cambiaPeriodo.asp`
   - Base URL: `https://proyectos.inei.gob.pe`
   - Purpose: return the module table and module download links for a survey/year/period combination.
   - Confirmed request body parameters from the official JavaScript:
     - `bandera=1`
     - `_cmbEncuesta`
     - `_cmbAnno`
     - `_cmbTrimestre`
   - Live confirmation:
     - posting the census sample returned an HTML table with columns for `Código Encuesta`, `Código Módulo`, `Módulo`, `Ficha`, and `Descarga`.

10. `GET /microdatos/Detalle_Encuesta.asp`
    - Base URL: `https://proyectos.inei.gob.pe`
    - Purpose: open the survey/module detail window.
    - Confirmed query parameters from the first-party code:
      - `CU`
      - `CodEncuesta`
      - `CodModulo`
      - `NombreEncuesta`
      - `NombreModulo`
    - Live confirmation:
      - `GET .../Detalle_Encuesta.asp?CU=19558&CodEncuesta=520&CodModulo=931&NombreEncuesta=...&NombreModulo=...` returned HTML titled `SRIE - Detalle de Encuesta`.

11. `GET /microdatos/VerificaFicha.asp`
    - Base URL: `https://proyectos.inei.gob.pe`
    - Purpose: open the module technical sheet/document.
    - Confirmed query parameters from the first-party code:
      - `CE`
      - `MO`
    - Live confirmation:
      - `GET .../VerificaFicha.asp?CE=520&MO=931` returned a PDF payload.

12. `POST /microdatos/CambiaPeriodoDoc.asp`
    - Base URL: `https://proyectos.inei.gob.pe`
    - Purpose: return the documentation table and related file links for a survey/year/period combination.
    - Confirmed request body parameters from the first-party code:
      - `bandera=1`
      - `_cmbEncuesta`
      - `_cmbAnno`
      - `_cmbTrimestre`
    - Live confirmation:
      - posting the census sample returned an HTML table with `Código Documento`, `Documento`, `Ver`, and `Zip` columns.

## Additional confirmed document/download routes
- `GET /microdatos/VerificaDoc.asp`
  - Built by the official `Consulta_por_Documentos.asp` front-end as `VerificaDoc.asp?Ano={Ano}&Trimestre={Trimestre}&URL={URL}`.
  - Purpose: open the selected methodology document.
- `GET /iinei/srienaho/descarga/{format}/{survey}-Modulo{module}.zip`
  - Live module-table examples included:
    - `/iinei/srienaho/descarga/SPSS/520-Modulo931.zip`
    - `/iinei/srienaho/descarga/DBF/520-Modulo931.zip`
  - Purpose: direct module downloads.
  - Notes:
    - format-specific ZIP links were visible in the returned HTML table.

## Pagination, filtering, and format notes
- The site is not paginated like a modern JSON API; instead it uses dependent HTML selectors for survey, year, and period.
- Survey selection is driven by visible form fields such as `cmbEncuesta0`, `cmbEncuestaA`, `cmbEncuestaN`, `cmbEncuesta_EPE`, `cmbAnno`, and `cmbTrimestre`.
- `CambiaEnc.asp`, `CambiaAnio.asp`, `cambiaPeriodo.asp`, and `CambiaPeriodoDoc.asp` all return HTML fragments, not JSON.
- `VerificaFicha.asp` returns PDF content.
- Download links observed in the live module table were ZIP files under `/iinei/srienaho/descarga/...`.

## Error, auth, and access notes
- No public auth contract, login wall, token, or API key requirement was shown for the reviewed browsing and download routes.
- No official rate-limit or quota policy was published on the reviewed INEI pages.
- Direct navigation to the assigned legacy HTTP host aborted in this browser run, while the HTTPS host linked from the official `gob.pe` page worked.
- A direct navigation sample to `Conf_Descarga.asp` returned `500 - Internal server error`, so that popup flow was not included in the canonical route count.
- No JSON error envelope or machine-readable error schema was published on the reviewed pages.

## fireROUTE normalization notes
- Treat INEI as an HTML-first microdata portal hosted at `https://proyectos.inei.gob.pe/microdatos/`, not as a clean REST/JSON API.
- Prefer the official HTTPS microdata host linked from `gob.pe`; do not rely on the broken legacy HTTP assigned URL.
- Model the provider around the stable selection chain (`Consulta_por_Encuesta` / `Consulta_por_Documentos` → `CambiaEnc` → `CambiaAnio` → `cambiaPeriodo` or `CambiaPeriodoDoc`) plus the PDF/download routes.
- Expect file and document retrieval to depend on survey/year/period context rather than a flat API resource model.
