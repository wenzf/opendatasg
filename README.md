# OpenData SG

**Open Data Portal for St.Gallen**

- [odsg.ch](https://odsg.ch)
- A open data web experiment using data provided by the Kanton of St. Gallen, Switzerland. Some data types are stored in a database in order to improve the loading speed of frequently access content and because some APIs limit the number of daily requests.
- The focus is on quick development, low hostig costs, user-friendliness for visitors, web accessibility standards and that content can be easily indexed by search engines.


## Setup

- Built with [Remix](https://github.com/remix-run), a fullstack SSR web framework built on top of `react` and `react-router`
- Deployed on AWS, using [Arc Template](https://github.com/remix-run/remix/tree/main/templates/classic-remix-compiler/arc), [DynamoDB](https://aws.amazon.com/dynamodb/)
- Data from [opendata.swiss](https://opendata.swiss)

## APIs

- [Newsfeed Medienmitteilungen Stadtverwaltung St.Gallen](https://opendata.swiss/de/dataset/newsfeed-medienmitteilungen-stadtverwaltung-st-gallen)
- [Newsfeed Vernehmlassungen Kanton St.Gallen](https://opendata.swiss/de/dataset/newsfeed-vernehmlassungen-kanton-st-gallen)
- [Newsfeed Medienmitteilungen Kanton St.Gallen](https://opendata.swiss/de/dataset/newsfeed-medienmitteilungen-kanton-st-gallen)
- [Newsfeed Medienmitteilungen der Stadtpolizei St.Gallen](https://opendata.swiss/de/dataset/newsfeed-medienmitteilungen-der-stadtpolizei-st-gallen)
- [Ratsinformationssystem des Kantonsrates St.Gallen](https://www.ratsinfo.sg.ch/api)


## Architecture

### Key components

| name | file |           function        | noteworthy dependencies |
|---|---|------------------------------------------------------------------------------------|---|
|`dataAPI`|[dataAPI.server.ts](./app/serverOnly/dataAPI/dataAPI.server.ts)| fetching data from API |[dataAPIConfigConstructor](./app/serverOnly/dataAPI/dataAPIConfigConstructor.server.ts)|
|*database calls*|[dbmain.server.ts](./app/serverOnly/dynamoDB/dbmain.server.ts)| interactions with DynamoDB ||
|`extractAndModifyTextContent`|[markupUtils.server.ts](./app/serverOnly/dataAPI/markupUtils.server.ts)| re-format text content: extract article lead (used for *meta description*), replace subtitles formatted in `<b>` with `<h2>` tags |[linkdom](https://github.com/linkdom/linkdom), [sanitize-html](https://github.com/apostrophecms/sanitize-html)|
|`prettyMarkup`|[prettyMarkup.server.ts](./app/serverOnly/dataAPI/prettyMarkup.server.ts)| convert article to the internal datastructure by configuration |`extractAndModifyTextContent`|
|`handleDataFeedRequest`|[handleDataFeedRequest.server.ts](./app/serverOnly/forLoader/handleDataFeedRequest.server.ts)| data reqeust by route params: check for last update, fetch data from API, store new data |`prettyMarkup`,  `dataAPI`,  *database calls*|



### Handling of media releases data

Media releases are potentially the most requested content type. Since some of the used APIs limit the number of daily requests, data for media releases are stored in a database (DynamoDB) after they have been retrieved by the API. The data of the database and the current state of data provided by APIs is kept in sync with a event driven process:

- 1: The request arrives, an `index entry` is read from the database. It contains the timestamp of when API was requested the and the number of entries (`total_results`) per API. If the last query was longer ago than `DATA_UPDATE_INTERVAL_TIME_IN_MS`, continue in step 2, otherwise, step 3b
- 2: Request to the API. Update the index file. If `total_results` from the response matches the entry in the index file, continue with step 3b, otherwise, step 3a.
- 3a: The data from the API from the previous step is converted into the internal data structure and saved in the database. The response is then sent to the client.
- 3b: Content is retrieved from the database and sent to the client.

#### Fallback, handling of content edits

The mechanism to determine if database is in sync with the API data is to compare the amount of entries as returned by the API (`total_results`) in each response. In case entries are deleted from the API or in case responses are corrupted, the mechanism of keeping data in sync might not work
as intended. As a fallback for such situations, the `index entry` storing the amount of entries at the time of the last fetch is reset after `DATA_RESET_INTERVAL_TIME_IN_MS` (currently set to two days). This way, the last ten articles of each category are refetched and updated regardless of 
the evaluated sync state. This reset mechanism is triggered only when requests hit the home route `/`.

The content of the ten most recent articles per category (`ENTRIES_SHOWN_IN_FEED`) are overwritten on re-fetches (excluding view counters) in order to include changes in case articles have been edited after publication. This is far from perfect but should cover most cases since edits are often done
relatively close the time of publication.


## Development and deployment

Remix has several deploymet pipelines for different services or can be hostet on any node or node-like runtime. This respository uses AWS services since they offer a reasonable cost-benefit ratio for such projects. 

The project uses the a standard template for development and deployment. For development and deployment follow the guides.
- [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [Arc template](https://github.com/remix-run/remix/tree/main/templates/classic-remix-compiler/arc)
- [Arc quick start](https://arc.codes/docs/en/get-started/quickstart)
- [Arc deployment](https://arc.codes/docs/en/reference/cli/deploy)
- [Deployment on AWS with custom domain](https://arc.codes/docs/en/guides/domains/registrars/route53-and-cloudfront)


```sh
    $ npm run dev
```

### Setting enviroment variables

```sh
    $ npx arc env --add --env staging SESSION_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env production SESSION_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env testing SESSION_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env staging ARC_APP_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env production ARC_APP_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env testing ARC_APP_SECRET $(openssl rand -hex 32)
```

### Possible troubles

- Are environment variables set? See above.
- Are server functions on Github set (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)?
- Are AWS access keys set correctly?
- Did you modify the project and see hydration errors in the browser console? This indicates that the server side markup is not identical with the client side rendered version. Reasons can be incorrect HTML markup which is corrected client side and therefore doesn't match with the backend rendered version. Another possibility is formatted timestamps without defined timezones. In such cases the markup from the server would use server time which might not match with client time, leading to different markups.
- Error: 500 after deployment? This might be due to an issue in the deployment pipeline. Delete `.cache`, `public/build`, all files in `server/*` run `npm run build` and deploy again with `npx arc deploy --production` or `npx arc deploy --staging`.


