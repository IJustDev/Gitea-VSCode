<div id="vscodium-logo" align="center">
    <br />
    <img src="https://github.com/IJustDev/Gitea-VSCode/raw/master/resources/icon-highres.png" alt="VSCodium Logo" width="200"/>
    <h1>Gitea-VSCode</h1>
    <h3>Issuetracker for Gitea</h3>
</div>

<div id="badges" align="center">

![GitHub](https://img.shields.io/github/license/ijustdev/gitea-vscode)
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/ijustdev.gitea-vscode)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/ijustdev.gitea-vscode)
[![Gitter](https://badges.gitter.im/Gitea-VSCode/community.svg)](https://gitter.im/Gitea-VSCode/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

</div>

## Overview
Gitea-VSCode is an Visual Studio Code extension that allows you to manage (currently only view) your issues.

## Support
<a href="https://www.buymeacoffee.com/IJustDev" target="_blank"><img src="https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

## Getting Started

Go to your settings, and find the `Gitea` section, and fill out the details.

Please make sure to not to make your authtoken public, as it can be used to act on your behalf.
Also do not push the .vscode folder to your repository and doublecheck this part. It contains your gitea server instance key.

### The following details are needed

- Authtoken
- Port (either 80 or 443) in case that you use docker please enter the exposed port
- Domain in format: "example.com"
- Repository owner (may be an organisation): "TestOrganisation"
- Repository name "ExampleRepository"

When you've finished you can press the refresh button in the open issues section and you'll see the issues of the first 10 pages (only open issues).

## Issue colors

![Issues with multiple colors](./media/gitea-issues.png)

In order to get nice looking issue icons in multiple colors (of your choice) you just need to assign a label to your issue. The color is being fetched automatically. In most cases you need to restart visual studio code to apply the icons in the issues tab if you've changed them though.

## Contributing
Please refer to each project's style and [contribution guidelines](CONTRIBUTING.md) for submitting patches and additions. In general, we follow the "fork-and-pull" Git workflow.

 1. **Fork** the repo on GitHub
 2. **Clone** the project to your own machine
 3. **Commit** changes to your own branch
 4. **Push** your work back up to your fork
 5. Submit a **Pull request** so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!

## Roadmap

- Implement a `Close Issue` Button
- Create Issues via Webview
- `Comment` Issues
- Support multiple git servers


[logo]: resources/icon.png
