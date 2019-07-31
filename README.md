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

</div>

## Support
<a href="https://www.buymeacoffee.com/IJustDev" target="_blank"><img src="https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

## Getting Started

Go to your settings, and find the `Gitea` section, and fill out the details.

Please make sure to not to make your authtoken public, as it can be used to act on your behalf.
You can store it in the user settings, whilst leaving the rest in the workspace settings.

### The following details are needed

- Authtoken
- Domain in format: "example.com"
- Repository Owner (may be an organisation): "TestOrganisation"
- Repository Name "ExampleRepository"

When you've finished you can press the refresh button in the open issues section and you'll see the issues of the first 10 pages (only open issues).

## Issue colors

![Issues with multiple colors](./media/gitea-issues.png)

In order to get nice looking issue icons in multiple colors (of your choice) you just need to assign a label to your issue. The color is being fetched automatically. In most cases you need to restart visual studio code to apply the icons in the issues tab if you've changed them though.

## Future

- Implement a `Close Issue` Button
- Create Issues via Webview
- `Comment` Issues

[logo]: resources/icon.png