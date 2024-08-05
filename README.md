# OpenData SG

**Open Data Portal for St.Gallen**

- [odsg.ch](https://odsg.ch)
- A open data web experiment using data provided by the Kanton of St.Gallen, Switzerland. Used content types are media releases by canton and city St.Gallen as well as data on individuals, groups and activities related to the cantonal council (Kantonsrat).


## Setup

- [Remix](https://github.com/remix-run), a fullstack SSR web framework built on top of `react` and `react-router`
- Deployed on AWS, using [Arc Template](https://github.com/remix-run/remix/tree/main/templates/classic-remix-compiler/arc), [DynamoDB](https://aws.amazon.com/dynamodb/)
- Data/APIs: [opendata.swiss](https://opendata.swiss)

## APIs

- [Newsfeed Medienmitteilungen Stadtverwaltung St.Gallen](https://opendata.swiss/de/dataset/newsfeed-medienmitteilungen-stadtverwaltung-st-gallen)
- [Newsfeed Vernehmlassungen Kanton St.Gallen](https://opendata.swiss/de/dataset/newsfeed-vernehmlassungen-kanton-st-gallen)
- [Newsfeed Medienmitteilungen Kanton St.Gallen](https://opendata.swiss/de/dataset/newsfeed-medienmitteilungen-kanton-st-gallen)
- [Newsfeed Medienmitteilungen der Stadtpolizei St.Gallen](https://opendata.swiss/de/dataset/newsfeed-medienmitteilungen-der-stadtpolizei-st-gallen)
- [Ratsinformationssystem des Kantonsrates St.Gallen](https://www.ratsinfo.sg.ch/api)


## Architecture

### Handling of media releases data

Media releases are potentially the most requested content type. Since some of the used APIs limit the number of daily requests, data for media releases are stored in a database (DynamoDB) after they have been retrieved and converted to a internal data structure. The database and the current state of data provided by APIs is kept in sync by an event driven process:

- 1: The request hits the backend, the `index entry` is read from the database which contains the timestamp of the last request and the number of entries (`total_results`) per API. If the last query was longer ago than `DATA_UPDATE_INTERVAL_TIME_IN_MS`, continue with step 2, otherwise, step 3b
- 2: Request to the API. Update `index entry`. If `total_results` from the response is equal to the entry in `index entry`, continue with step 3b, otherwise, step 3a.
- 3a: Data from the API from the previous step is converted into the internal data structure and saved in the database. The response is then sent to the client.
- 3b: Content is retrieved from the database and sent to the client.

#### Fallback, handling of content edits

The mechanism to determine if database is in sync with the API data is to compare the amount of entries as returned by the API (`total_results`) in each response. In case entries are deleted from the API or in case responses are corrupted, the mechanism of keeping data in sync might not work
as intended. As a fallback for such cases, the `index entry` is reset after `DATA_RESET_INTERVAL_TIME_IN_MS`. Therefore another timestamp is used to mark the last reset. In each reset, the last ten articles of each category are refetched and updated regardless of the evaluated sync state. This reset mechanism is triggered when requests hit the home route `/`.

The content of the ten most recent articles per category (`ENTRIES_SHOWN_IN_FEED`) are overwritten on re-fetches (excluding view counters) in order to include changes in case articles have been edited after publication.

### Key components

| name | file |           function        | noteworthy dependencies |
|---|---|------------------------------------------------------------------------------------|---|
|`dataAPI`|[dataAPI.server.ts](./app/utils/serverOnly/dataAPI/dataAPI.server.ts)| fetching data from API |[dataAPIConfigConstructor](./app/utils/serverOnly/dataAPI/dataAPIConfigConstructor.server.ts)|
|*database calls*|[dbmain.server.ts](./app/utils/serverOnly/dynamoDB/dbmain.server.ts)| interactions with DynamoDB ||
|`extractAndModifyTextContent`|[markupUtils.server.ts](./app/utils/serverOnly/dataAPI/markupUtils.server.ts)| re-format text content: extract article lead (used for *meta description*), replace subtitles formatted in `<b>` with `<h2>` tags |[linkdom](https://github.com/WebReflection/linkedom), [sanitize-html](https://github.com/apostrophecms/sanitize-html)|
|`prettyMarkup`|[prettyMarkup.server.ts](./app/utils/serverOnly/dataAPI/prettyMarkup.server.ts)| convert article to the internal datastructure by configuration |`extractAndModifyTextContent`|
|`handleDataFeedRequest`|[handleDataFeedRequest.server.ts](./app/utils/serverOnly/forLoader/handleDataFeedRequest.server.ts)| data reqeust by route params: check for last update, fetch data from API, store new data |`prettyMarkup`,  `dataAPI`,  *database calls*|


## Development and deployment

This respository uses a deployment pipeline for AWS services.

- [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [Arc template](https://github.com/remix-run/remix/tree/main/templates/classic-remix-compiler/arc)
- [Arc quick start](https://arc.codes/docs/en/get-started/quickstart)
- [Arc deployment](https://arc.codes/docs/en/reference/cli/deploy)
- [Deployment on AWS with custom domain](https://arc.codes/docs/en/guides/domains/registrars/route53-and-cloudfront)


### Setting enviroment variables

```sh
    $ npx arc env --add --env staging SESSION_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env production SESSION_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env testing SESSION_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env staging ARC_APP_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env production ARC_APP_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env testing ARC_APP_SECRET $(openssl rand -hex 32)
```

### Possible issues related to deployment

Several issues related to the deployment pipeline and server side rendering are possible. Some usual suspects:

- Are environment variables set? See above.
- Are secrets on Github set (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)?
- Is the IAM role and AWS CLI configured correctly?
- Hydration errors: Is the HMTL correct? If timestamps are converted to readable times, make sure, date format and timezone are set in order to avoid missmatches of server and client configurations. 
- Error 500 after deployment? This might be due to an issue in the deployment pipeline. If none of the reasons above, delete `.cache`, `public/build`, all files in `server/*` run `npm run build` and deploy again with `npx arc deploy --production` or `npx arc deploy --staging`.
- If none of the reasons above, there might be issues with different `arc` versions or sources in `node_modules` are messed up. In such cases, create a new project from scratch with `create-remix`, import libraries and replace files.

