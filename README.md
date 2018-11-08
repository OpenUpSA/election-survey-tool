# Election Survey Tool &middot; ![stability-wip](https://img.shields.io/badge/stability-work_in_progress-lightgrey.svg)

A simple client-only JavaScript app based on [Backbone.js](http://backbonejs.org/).

## Getting Started

### Local development

1. Clone this project by running `git clone https://github.com/OpenUpSA/election-survey-tool`.
2. Make sure you have the latest [NodeJS](https://nodejs.org/en/) installed.
3. Run `npm install` in the root folder of the repository.
4. Run `npm start` to spin up the development server.*
5. Open `localhost:5000` in your browser.

### Deployment
- **Important**: Remember to update the version in `service-worker.js` for changes to reflect when deploying.
- Changes are automatically deployed to netlify if `master` branch is updated on Github.