# Reed

## Provider metadata
- Category: `Jobs`
- Provider slug: `reed`
- Official docs page used: `https://www.reed.co.uk/developers`
- Public jobseeker base URL: `https://www.reed.co.uk/api`
- Recruiter/CV base URL: `https://www.reed.co.uk/recruiter/api/1.0`
- Response formats: JSON for search/result APIs; CV download endpoint returns a byte stream
- Auth models:
  - Jobseeker API: HTTP Basic auth, API key as username and empty password
  - Recruiter API: signed-request header auth using Client ID, API key, HMAC-SHA1 signature, timestamp, and user-agent
- Recruiter default rate limit: `2,000 requests per hour`
- Manually confirmed route count: `13`

## Auth details
### Jobseeker APIs
- Include the Reed API key in an HTTP Basic auth header as the username.
- Password is left empty.

### Recruiter APIs
The official docs require these headers:
- `ContentType`
- `Method`
- `User-Agent`
- `X-ApiSignature`
- `X-ApiClientId`
- `X-TimeStamp`

Signature construction uses:
- HTTP method
- User-Agent
- full request URL
- host (`www.reed.co.uk`)
- timestamp

The concatenated string is HMAC-SHA1 signed with the API key and Base64 encoded.

## Canonical endpoints
### Jobseeker APIs
1. `GET /api/{version}/search`
   - Purpose: search jobs on Reed.
   - Example version shown: `1.0`.
   - Documented query params:
     - `employerId`
     - `employerProfileId`
     - `keywords`
     - `locationName`
     - `distanceFromLocation`
     - `permanent`
     - `contract`
     - `temp`
     - `partTime`
     - `fullTime`
     - `minimumSalary`
     - `maximumSalary`
     - `postedByRecruitmentAgency`
     - `postedByDirectEmployer`
     - `graduate`
     - `resultsToTake` (default/maximum `100`)
     - `resultsToSkip`
   - Notes:
     - only one of `employerId` and `employerProfileId` should be set
     - if more than one location matches, alternatives are returned

2. `GET /api/{version}/jobs/{jobId}`
   - Purpose: get job details.
   - Path param: `jobId`.

### Recruiter Jobs APIs
3. `POST /recruiter/api/1.0/jobs`
   - Purpose: post a new job.
   - Required body fields: `username`, `jobType`, `workingHours`, `description`, `title`, `townName`.
   - Important optional fields include `postingKey`, `productId`, `expiryInDays`, `isDemo`, `isPublic`, `isGraduate`, `sendApplicationDigest`, `ownerRef`, `profileId`, `countyName`, `countryName`, `parentSectorId`, `jobSectorId`, salary-related fields, visa/application fields, `externalUrl`, `coverLetterPreference`, `skills[i]`, screening questions, `locationBaseType`.
   - Responses documented: `201`, `400`, `409`.

4. `PUT /recruiter/api/1.0/jobs/update/{jobId}`
   - Purpose: edit a live job.
   - Required body field: `username`.
   - Optional: `postingKey`, `doNotExtend`, plus any post-job fields to update.
   - Responses documented: `200`, `400`, `409`.

5. `PUT /recruiter/api/1.0/jobs/end/{jobId}`
   - Purpose: end a live job.
   - Required body field: `username`.
   - Optional: `postingKey`.
   - Responses documented: `200`, `400`.

6. `PUT /recruiter/api/1.0/jobs/relist/{jobId}`
   - Purpose: relist an expired job.
   - Required body field: `username`.
   - Optional: `postingKey`.
   - Responses documented: `200`, `400`.

7. `PUT /recruiter/api/1.0/jobs/extend/{jobId}`
   - Purpose: extend a live job.
   - Required body field: `username`.
   - Optional: `postingKey`.
   - Responses documented: `200`, `400`.

### Recruiter CV Search APIs
8. `GET /recruiter/api/1.0/cvsearch`
   - Purpose: search CVs.
   - Required query param: `username`.
   - Key optional filters include `keywords`, `location`, `postingKey`, `titleOnly`, `radius`, `salaryFrom`, `salaryTo`, `salaryType`, `parentSectors`, `sectors`, `permanent`, `temporary`, `contract`, `fullTime`, `partTime`, `activityType`, `activityTimeFrame`, `includeIneligible`, `hasDrivingLicence`, `isCarOwner`, `languages`, `languageFluency`, `minimumQualification`, `degreeSubjectKeywords`, `institutions`, `finishedOnStart`, `finishedOnEnd`, `degreeGrade`, `hideCandidatesWithoutSalary`, `hasAvailabilityConfirmed`, `sortBy`, `page`, `pageSize`.

9. `GET /recruiter/api/1.0/cvsearch/candidate/{candidateId}/preview`
   - Purpose: retrieve candidate preview without spending a download credit.
   - Required query param: `username`.
   - Optional: `postingKey`, `keywords`.

10. `GET /recruiter/api/1.0/cvsearch/cv/{candidateId}`
    - Purpose: download candidate CV bytes.
    - Required query param: `username`.
    - Optional: `postingKey`.

11. `GET /recruiter/api/1.0/cvsearch/candidate/{candidateId}`
    - Purpose: retrieve candidate profile.
    - Required query param: `username`.
    - Optional: `postingKey`.

12. `GET /recruiter/api/1.0/cvsearch/downloadlimits`
    - Purpose: retrieve subscription download limits.
    - Required query param: `username`.
    - Optional: `postingKey`.

13. `GET /recruiter/api/1.0/cvsearch/searchavailability`
    - Purpose: run CV search availability validation.
    - Required query param: `username`.
    - Optional filters: same general CV-search filter family as `/cvsearch`.

## Response notes
### Jobseeker search returns job lists with fields including
- `Job Id`
- `Employer Id`
- `Employer Name`
- `Employer Profile Id`
- `Job Title`
- `Description`
- `Location Name`
- `Minimum Salary`
- `Maximum Salary`

### Job details add fields including
- `Yearly Minimum Salary`
- `Yearly Maximum Salary`
- `Currency`
- `Salary Type`
- `ContractType`
- `Job Type`
- `Expiration Date`
- `External Url`
- Reed job URL

### CV search response includes
- `candidates[]`
- `candidateId`
- `forename`
- `surname`
- `mostRecentEmployer`
- `preferredWorkLocations`
- work-type flags
- salary fields
- `mostRecentJobTitle`
- `createdOn`
- `lastCandidateLogin`
- `isHidden`
- `isStarred`
- `workHistory`
- `isRecentlyViewed`
- `totalResults`
- `page`
- `pageSize`

### Candidate preview/profile/download-limits endpoints
- Preview returns snippets, eligibility, locations, qualifications, skills, and sectors.
- Candidate profile returns full contact/profile data and spends a download credit.
- Download CV returns a binary stream.
- Download limits returns `downloadLimit`, `usageCount`, and `resetTime`.

## Special usage notes
- The recruiter docs state CV Search access is not granted by default.
- Anonymous CV searches may return nulls for sensitive fields when no active subscription exists.
- Recruiter docs require SSL (`https://`) for all requests.

## fireROUTE normalization notes
- Reed effectively exposes two API families with different authentication models.
- Route grouping should distinguish public jobseeker search from privileged recruiter/candidate workflows.
- Some recruiter operations have side effects (post/update/end/relist/extend) and should be clearly separated from read-only routes.
