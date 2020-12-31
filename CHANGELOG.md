# Changelog

All notable changes to the "gitea-vscode" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.2] - 2019-04-10
### Added:
- Configfile with token and repo properties
- Refresh button (Await HTTP Request)
- Multiple Pages
### Removed:
- Interval for updating

## [0.0.3] - 2019-04-10
### Added:
- Implemented [Create issue icon](./resources/dark/create.svg)
- Interval for updating (Issuelist now gets updated every ten minutes)
- Closed Issues View
- SSL server support
- License
### Refactored:
- [IssueProvider](./src/issueProvider.ts) splitted up in two parts: OpenIssuesProvider and ClosedIssuesProvider
- class Issue is now in [issue.ts](./src/issue.ts)
- organizing imports
- renaming

## [0.0.4] - 2019-04-11
### Fixed:
- [Issue 1][1] - `\n` is now represented as ´<br/>´-tag
- [Issue 2][2] - Markdown is now represented as HTML

## [0.0.5] - 2019-04-12
### Added:
- Child items to root items. Collapsable item now shows assignee, state, id and list all labels from the issue
- Label dependent icons
### Refactored:
- Created two methods that are used in both classes (the closed and the open issues provider)

## [0.0.6] - 2019-04-12
### Added:
- Label dependent icons now allow the user to use the colors from the Gitea server

## [0.0.7] - 2019-06-14
### Added:
- Every issue can now be opened just once at a time
- Repo settings moved to workspace settings
- Token setting moved to user settings
### Refactored:
- Removed "filename" from `issue.ts` `labelDependentIcon()`
- Cleaning files up

## [0.0.8] - 2019-07-29
### Added:
- Icon for marketplace
- ReadMe Icon and styling
### Removed:
- InitRepo Command
### Refactored:
- Changelog

## [0.0.9] - 2019-07-31
### Added:
- Multiple gitea instances are now possible. The key is now stored in the workspace settings
- BuyMeACoffeBadge ReadMe

## [1.0.0] - 2019-07-31
### Added:
- Emojis in treeview

## [1.0.1] - 2020-08-02
### Added:
- Port settings

## [1.2.0] - 2020-12-26
### Added:
- feat: [#21][21]: introduce baseURL for Gitea instances.

## [1.2.1] - 2020-12-31
### Added:
- fix: [#21][21] missing '/'
### Removed:
- versions folder

## [Unreleased]

[1]: https://github.com/IJustDev/Gitea-VSCode/issues/1
[2]: https://github.com/IJustDev/Gitea-VSCode/issues/2
[21]: https://github.com/IJustDev/Gitea-VSCode/issues/21
