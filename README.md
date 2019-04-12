# Gitea-VSCode

Issuetracker for Gitea

## Getting Started

To setup a gitea issue tracked project you need to first select the issues tab at the activitiy bar. After that open the command palette in order to enter your crendentials:
- Authtoken
- Domain in format: "example.com"
- Repository Owner (may be an organisation): "TestOrganisation"
- Repository Name "ExampleRepository"

When you've finished you can press the refresh button in the open issues section and you'll see the issues of the first 10 pages (only open issues).

## Issue colors
In order to get nice looking issueicons in multiple colors you need to assigne any issue a label called either "feature" or "bug". A bug is going to be represented as an red issue, while a feature will have a green icon. If the issue does not have got a label it will receive a grey icon. If the label is not know (so neither "feature" nor "bug" not case sensitive) it will also get a grey icon.

## Future
- Implement a `Close Issue` Button
- Create Issues via Webview
- `Comment` Issues