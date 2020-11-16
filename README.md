<div align="center">

# IFTTT-Status

[![build](https://github.com/BetaHuhn/ifttt-status/workflows/build/badge.svg)](https://github.com/BetaHuhn/ifttt-status/actions?query=workflow%3Abuild) [![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/BetaHuhn/ifttt-status/blob/master/LICENSE)

Send workflow status notifications to an IFTTT WebHook

<br/>

</div>

## 👋 Introduction

The Action [IFTTT-Status](https://github.com/BetaHuhn/ifttt-status) will sent the status of a GitHub Workflow after it ran to an IFTTT WebHook of your choice. It it is intended to be used with [Notifications](https://ifttt.com/if_notifications), but you can use the values shown below in any applet.

> Note: The Action will only send a request to your WebHook if the Workflow succeeded or failed, not if it is cancelled.

## 🚀 Get started

To get started include this at the end of your Workflow .yml file (make sure to use your own values below or add them as [secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets)):

```yaml
uses: betahuhn/ifttt-status@v1.0.3
with:
  event: ${{ secrets.EVENT }} # your-webhook-event
  key: ${{ secrets.TOKEN }} # your-webhook-secret-key
  status: ${{ job.status }} # do not change
```

[IFTTT-Status](https://github.com/BetaHuhn/ifttt-status) will sent these values as the body of request:

| field  | On success | On failure |
| ------------- | ------------- | ------------- |
| **value1**  | *WORKFLOW_NAME* succeeded  | *WORKFLOW_NAME* failed  |
| **value2**  | The Workflow *WORKFLOW_NAME* on the Repo *REPO_NAME* finished without any errors. | The Workflow *WORKFLOW_NAME* on the Repo *REPO_NAME* did not finish without any errors.  |
| **value3**  | *Link to the Workflow*  | *Link to the Workflow*  |

## ✨ Planned features

* Custom success and failure messages

## 💻 Development

Run `yarn build` or `npm run build` to produce a production version of the action in the `dist` folder.

## ❔ About

Copyright 2020 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
