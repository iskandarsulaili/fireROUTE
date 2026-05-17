# NHTSA

## Provider metadata
- Category: `Vehicle`
- Provider slug: `nhtsa`
- Official docs used manually:
  - `https://vpic.nhtsa.dot.gov/api/`
  - sampled built-in "More Information" text on the live Vehicle API page
- Confirmed API base URL: `https://vpic.nhtsa.dot.gov/api`
- Authentication: none documented
- Output formats documented on the live page: `XML`, `CSV`, `JSON`
- Manually confirmed routes in this pass: `17`

## Authentication and traffic control
The reviewed official Vehicle API page states:
- no auth or API-key flow is documented
- the service is publicly callable from direct example links
- users/applications are subject to an automated traffic-rate-control mechanism
- the reviewed page does **not** publish a numeric requests-per-minute or requests-per-day limit

## Shared request conventions
Across the reviewed route listings, the live page consistently shows:
- base path prefix `/vehicles/...`
- output selection via the `format` query parameter
- common `format` values: `xml`, `csv`, `json`
- several search/list endpoints accept a path token that may be either a text fragment or a numeric manufacturer identifier

## Confirmed API surface
The live NHTSA page explicitly listed these route families during manual review:
- `GET /vehicles/DecodeVin/{vin}`
- `GET /vehicles/DecodeVinValues/{vin}`
- `GET /vehicles/DecodeVinExtended/{vin}`
- `GET /vehicles/DecodeVinValuesExtended/{vin}`
- `GET /vehicles/DecodeWMI/{wmi}`
- `GET /vehicles/GetWMIsForManufacturer/{manufacturer}`
- `GET /vehicles/GetAllMakes`
- `GET /vehicles/GetParts`
- `GET /vehicles/GetAllManufacturers`
- `GET /vehicles/GetManufacturerDetails/{manufacturer}`
- `GET /vehicles/GetMakeForManufacturer/{manufacturer}`
- `GET /vehicles/GetMakesForManufacturerAndYear/{manufacturer}`
- `GET /vehicles/GetMakesForVehicleType/{vehicleType}`
- `GET /vehicles/GetVehicleTypesForMake/{make}`
- `GET /vehicles/GetVehicleTypesForMakeId/{makeId}`
- `GET /vehicles/GetEquipmentPlantCodes/{year}`
- `GET /vehicles/GetModelsForMake/{make}`

## 1) Decode VIN
- Method: `GET`
- Path: `/vehicles/DecodeVin/{vin}`
- Example shown by the docs: `/vehicles/DecodeVin/5UXWX7C5*BA?format=xml&modelyear=2011`
- Purpose: decode a VIN into key/value pairs

Official notes surfaced from the expanded info block:
- `modelyear` is recommended and helps with current and older pre-1980 ranges
- partial VIN decoding is supported
- a `*` may be used for unavailable characters in partial VINs
- the 9th digit is not necessary for partial decode use cases

## 2) Decode VIN (flat format)
- Method: `GET`
- Path: `/vehicles/DecodeVinValues/{vin}`
- Example: `/vehicles/DecodeVinValues/5UXWX7C5*BA?format=xml&modelyear=2011`
- Purpose: return VIN-decoded data in a flatter field/value structure

## 3) Decode VIN Extended
- Method: `GET`
- Path: `/vehicles/DecodeVinExtended/{vin}`
- Example: `/vehicles/DecodeVinExtended/5UXWX7C5*BA?format=json&modelyear=2011`
- Purpose: extended VIN decoding

## 4) Decode VIN Extended (flat format)
- Method: `GET`
- Path: `/vehicles/DecodeVinValuesExtended/{vin}`
- Example: `/vehicles/DecodeVinValuesExtended/5UXWX7C5*BA?format=json&modelyear=2011`
- Purpose: extended VIN decoding in flat-field form

## 5) Decode WMI
- Method: `GET`
- Path: `/vehicles/DecodeWMI/{wmi}`
- Example: `/vehicles/DecodeWMI/1FD?format=xml`
- Purpose: decode a WMI prefix

## 6) Get WMIs for Manufacturer
- Method: `GET`
- Path: `/vehicles/GetWMIsForManufacturer/{manufacturer}`
- Example variants shown by the docs:
  - `/vehicles/GetWMIsForManufacturer/hon?format=xml`
  - `/vehicles/GetWMIsForManufacturer/987?format=xml`
  - `/vehicles/GetWMIsForManufacturer/hon?vehicleType=car&format=xml`
  - `/vehicles/GetWMIsForManufacturer/987?vehicleType=2&format=xml`
- Documented parameters visible from examples:
  - path token can be text or numeric manufacturer ID
  - `vehicleType` is optional
  - `format` selects response serialization

## 7) Get All Makes
- Method: `GET`
- Path: `/vehicles/GetAllMakes`
- Example: `/vehicles/GetAllMakes?format=csv`
- Purpose: list all makes

## 8) Get Parts
- Method: `GET`
- Path: `/vehicles/GetParts`
- Example variants shown by the docs:
  - `/vehicles/GetParts?type=565&fromDate=1/1/2015&toDate=5/5/2015&format=xml&page=1`
  - `/vehicles/GetParts?type=565&fromDate=1/1/2015&toDate=5/5/2015&format=xml&page=1&manufacturer=hon`
- Documented query parameters visible on the live page:
  - `type`
  - `fromDate`
  - `toDate`
  - `page`
  - `manufacturer`
  - `format`

## 9) Get All Manufacturers
- Method: `GET`
- Path: `/vehicles/GetAllManufacturers`
- Example variants:
  - `/vehicles/GetAllManufacturers?format=xml&page=2`
  - `/vehicles/GetAllManufacturers?ManufacturerType=Intermediate&page=2`
- Documented query parameters visible from examples:
  - `page`
  - `ManufacturerType`
  - `format`

## 10) Get Manufacturer Details
- Method: `GET`
- Path: `/vehicles/GetManufacturerDetails/{manufacturer}`
- Example variants:
  - `/vehicles/GetManufacturerDetails/honda?format=xml`
  - `/vehicles/GetManufacturerDetails/str?page=2`
  - `/vehicles/GetManufacturerDetails/989`
- Usage note:
  - the path token can be a textual manufacturer clue or a numeric manufacturer ID

## 11) Get Makes for Manufacturer
- Method: `GET`
- Path: `/vehicles/GetMakeForManufacturer/{manufacturer}`
- Example variants:
  - `/vehicles/GetMakeForManufacturer/honda?format=json`
  - `/vehicles/GetMakeForManufacturer/988?format=xml`

## 12) Get Makes for Manufacturer and Year
- Method: `GET`
- Path: `/vehicles/GetMakesForManufacturerAndYear/{manufacturer}`
- Example variants:
  - `/vehicles/GetMakesForManufacturerAndYear/mer?year=2013&format=json`
  - `/vehicles/GetMakesForManufacturerAndYear/988?year=2013&format=json`
- Documented query parameters visible from examples:
  - `year`
  - `format`

## 13) Get Makes for Vehicle Type
- Method: `GET`
- Path: `/vehicles/GetMakesForVehicleType/{vehicleType}`
- Example: `/vehicles/GetMakesForVehicleType/car?format=json`

## 14) Get Vehicle Types for Make
- Method: `GET`
- Path: `/vehicles/GetVehicleTypesForMake/{make}`
- Example: `/vehicles/GetVehicleTypesForMake/mercedes?format=json`

## 15) Get Vehicle Types for Make ID
- Method: `GET`
- Path: `/vehicles/GetVehicleTypesForMakeId/{makeId}`
- Example: `/vehicles/GetVehicleTypesForMakeId/450?format=json`

## 16) Get Equipment Plant Codes
- Method: `GET`
- Path: `/vehicles/GetEquipmentPlantCodes/{year}`
- Example: `/vehicles/GetEquipmentPlantCodes/2015?format=json`

## 17) Get Models for Make
- Method: `GET`
- Path: `/vehicles/GetModelsForMake/{make}`
- Example: `/vehicles/GetModelsForMake/honda?format=json`

## Pagination, errors, and format notes
From the reviewed official page:
- pagination-like behavior is only explicitly visible on certain list endpoints via `page` query parameters in examples, such as `GetParts`, `GetAllManufacturers`, and one `GetManufacturerDetails` example
- no unified pagination guide was surfaced on the reviewed page
- no formal shared error-model table was surfaced on the reviewed page
- the service prominently advertises `XML`, `CSV`, and `JSON` output options per route on the live page

## fireROUTE notes
- The official docs page is itself the main route catalog; it is rich in concrete examples but light on centralized schema/error sections.
- `format` is the most consistently documented cross-cutting parameter.
- Several manufacturer-related routes accept either text fragments or numeric IDs in the path, which is important for adapter normalization.
- The official page also advertises downloadable standalone databases; that is separate from the live HTTP API routes documented above.

## Verification notes
This file was manually rebuilt from the live official NHTSA Vehicle API page using browser inspection.