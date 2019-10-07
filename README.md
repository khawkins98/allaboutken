[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/) [![Build Status](https://travis-ci.org/khawkins98/allaboutken.svg?branch=master)](https://travis-ci.org/khawkins98/allaboutken)

# allaboutken

A semi-professional site

## Developing

- Local development
  - `gulp` build the content and serve locally via browserlab
  - `gulp init` build any image asssets
- Prep for deployment
  - `gulp clean`
  - `gulp init`
  - Commit
  - Most content assets built by travis and sent to gh-pages branch (`gulp deploy`)
- Troubleshooting
  - `gulp clean`

## Various notes

- Local service worker testing. We ignore cert signing for local testing: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/tmp/foo --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://localhost:3000`
