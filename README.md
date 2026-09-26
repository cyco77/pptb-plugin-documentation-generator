# Plugin Documentation Generator

![Plugin Documentation Generator](https://raw.githubusercontent.com/cyco77/pptb-plugin-documentation-generator/main/icon/plugin-documentation_small.png)

A Power Platform Toolbox (PPTB) plugin for viewing and documenting Dynamics 365 plugin assemblies and steps. This tool provides an intuitive interface to explore plugin configurations and export documentation in multiple formats.

## Screenshots

### Dark Theme

![Plugin Documentation Generator - Dark Theme](https://raw.githubusercontent.com/cyco77/pptb-plugin-documentation-generator/main/screenshots/main_dark.png)

### Light Theme

![Plugin Documentation Generator - Light Theme](https://raw.githubusercontent.com/cyco77/pptb-plugin-documentation-generator/main/screenshots/main_light.png)

## Features

### Core Capabilities

- 🔌 **Plugin Assembly Browser** - View all plugin assemblies in your Dynamics 365 environment
- 📋 **Plugin Step Details** - Display detailed information about SDK message processing steps
- 🔍 **Advanced Filtering** - Filter assemblies by name and search steps by any property
- 📊 **Sortable Data Grid** - Sort plugin steps by any column with resizable columns
- 📤 **Multiple Export Formats**:
  - CSV file export
  - Copy to clipboard as CSV
  - Copy to clipboard as Markdown table
- 📢 **Visual Notifications** - Toast notifications for all operations
- 📝 **Event Logging** - Track all operations and API calls in real-time
- 🎨 **Theme Support** - Automatic light/dark theme switching based on PPTB settings

## Development and Releases

- Create feature branches from `dev` and open pull requests back to `dev`.
- Add a Changeset to every feature pull request with `npm run changeset`, then commit the generated file in `.changeset/`.
- Open a release pull request from `dev` to `main` when changes are ready.
- After that pull request is merged, GitHub Actions creates or updates a `Version Packages` pull request on `main`.
- Review and merge the version pull request. GitHub Actions then builds the package, publishes it to npm, and creates a GitHub Release with downloadable archives.

Changeset release types follow SemVer: `patch` for fixes, `minor` for backwards-compatible features, and `major` for breaking changes.

### Repository Setup

- Create a GitHub Actions secret named `CHANGESETS_GITHUB_TOKEN` using a fine-grained token for this repository with **Contents: read and write** and **Pull requests: read and write**. A GitHub App token can be used instead. This token is required because release PR and tag events created with the default `GITHUB_TOKEN` do not start follow-up workflows.
- In repository settings under **Actions > General**, allow GitHub Actions to create and approve pull requests.
- On npm, open the package settings for `@cyco77/pptb-plugin-documentation-generator` and add a GitHub Actions trusted publisher: user `cyco77`, repository `pptb-plugin-documentation-generator`, workflow filename `release.yml`. Allow direct `npm publish` for this publisher.
- The release workflow uses Node.js 24 and npm 11.20.0 to satisfy npm Trusted Publishing requirements while retaining support for `npm-shrinkwrap.json`. npm 12 no longer reads or writes shrinkwrap files. No npm write token is needed.
- Local development and Changesets commands require Node.js 24 or newer.
- Protect `dev` and `main` with required pull requests and the CI checks. Set `dev` as the default branch for day-to-day work if desired; keep `main` as the production branch.

## License

MIT - See LICENSE file for details

## Author

Lars Hildebrandt
