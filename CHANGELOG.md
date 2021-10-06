# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0).

Note: this changelog starts from 3.0.0, as it is built from scratch and therefore the code has no meaningful shared history with the 2.0.0 version. The 2.0.0 version of this tool lives in [w3c/wcag-em-report-tool](https://github.com/w3c/wcag-em-report-tool/) and has its own changelog there.

## 3.0.3

### Fixed

* Bug for import with JSON-files with multiple samples
* Bug for import with mapping answers to samples

## 3.0.2

### Fixed

* Language icon had 404
* Logo images did not have explicit width / height set 

### Added

* Updated README to point to production URL for production version

## 3.0.1

### Fixed

* Pager was oddly aligned on page 1, because of max-width on list items

## 3.0.0

### Added

* Rebuild of the 2.0.0 version of the WCAG-EM Report Tool in Svelte
* Redesign following the WAI Website visual updates
* Markdown support
* “Your Report” box that shows meta data about current report, like progress and website name

### Fixed

* A large number of issues in the previous version (see [“fixed in 2021 redesign” label](https://github.com/w3c/wcag-em-report-tool/issues?q=is%3Aissue+is%3Aopen+label%3A%22fixed+in+2021+redesign%22))
