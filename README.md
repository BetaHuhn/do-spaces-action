<div align="center">
  
# DigitalOcean Spaces Action

[![Build](https://github.com/BetaHuhn/do-spaces-action/workflows/Build/badge.svg)](https://github.com/BetaHuhn/do-spaces-action/actions?query=workflow%3ABuild) [![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/BetaHuhn/do-spaces-action/blob/master/LICENSE) ![David](https://img.shields.io/david/betahuhn/do-spaces-action)

Upload directories/files to DigitalOcean Spaces via GitHub Actions.

</div>

## 👋 Introduction

Use [do-spaces-action](https://github.com/BetaHuhn/do-spaces-action) to deploy a file or directory to your DigitalOcean Space with GitHub Actions. This can be used to host your static site, or as an self-hosted alternative to something like JSDelivr for serving your JS files/library via a CDN. [do-spaces-action](https://github.com/BetaHuhn/do-spaces-action) can also automatically grab the version number from the package.json and use it to host multiple versions at once (more info [below](#versioning)).

## ⭐ Features

- Upload a [single file](#single-file-upload) or [whole directories](#basic-example)
- Specify [output directory](#output-directory) on your Space
- Automatic [versioning](#versioning) of your uploads
- Use your [CDN endpoint](#cdn-domain) (custom domain)
- Integrates with [GitHub deployments](#create-deployment-on-github)

## 📚 Usage

Create a `.yml` file in your `.github/workflows` folder (you can find more info about the structure in the [GitHub Docs](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions)):

**.github/workflows/upload.yml**

```yml
name: Upload to DO Spaces
on:
  push:
    branches:
      - main
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@master
      - uses: BetaHuhn/do-spaces-action@v2
        with:
          access_key: ${{ secrets.ACCESS_KEY}}
          secret_key: ${{ secrets.SECRET_KEY }}
          space_name: ${{ secrets.SPACE_NAME }}
          space_region: ${{ secrets.SPACE_REGION }}
          source: src
```

More info on how to specify what files to upload where [below](#%EF%B8%8F-action-inputs).

### Action Versioning

To always use the latest version of the action add the `latest` tag to the action name like this:

```yml
uses: BetaHuhn/do-spaces-action@latest
```

If you want to make sure that your workflow doesn't suddenly break when a new major version is released, use the `v2` tag instead (recommended usage):

```yml
uses: BetaHuhn/do-spaces-action@v2
```

With the `v2` tag you will always get the latest non-breaking version which will include potential bug fixes in the future. If you use a specific version, make sure to regularly check if a new version is available, or enable Dependabot.

## ⚙️ Action Inputs

Here are all the inputs [do-spaces-action](https://github.com/BetaHuhn/do-spaces-action) takes:

| Key | Value | Required | Default |
| ------------- | ------------- | ------------- | ------------- |
| `access_key` | Your DigitalOcean access key - [more info](#authentication) | **Yes** | N/A |
| `secret_key` | Your DigitalOcean secret key - [more info](#authentication) | **Yes** | N/A |
| `space_name` | The name of your DigitalOcean Space | **Yes** | N/A |
| `space_region` | The region of your DigitalOcean Space | **Yes** | N/A |
| `source` | Path to the source file or folder (what you want to upload) - [more info](#source) | **Yes** | N/A |
| `out_dir` | Path to the output directory in your Space (where you want to upload to) - [more info](#output-directory) | **No** | `/` |
| `versioning` | Enable versioning (either set it to true or specify path to package.json) - [more info](#versioning) | **No** | `false` |
| `cdn_domain` | Custom domain pointing to your CDN endpoint - [more info](#cdn-domain) | **No** | N/A |
| `permission` | Access permissions of the uploaded files - [more info](#file-permissions) | **No** | `public-read` |

### Authentication

In order to access your DigitalOcean Space, you have to specify a few required values. The `access_key` and `secret_key` can be generated on your DigitalOcean [Account Page](https://cloud.digitalocean.com/account/api/tokens). The `space_name` and `space_region` are different based on your created Space.

It is recommended to set them as [Repository Secrets](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository).

### Source

The `source` input can either point to a single file or to a whole directory which should be uploaded. The path is relative to the root of your repository.

[See example](#single-file-upload)

### Output directory

By default [do-spaces-action](https://github.com/BetaHuhn/do-spaces-action) will upload all files to the root of your Space. You can specify a different output directory with the `out_dir` input.

[See example](#custom-output-path)

### Versioning

[do-spaces-action](https://github.com/BetaHuhn/do-spaces-action) also supports versioning and can detect the current version from your `package.json` and then upload the file/s to a folder with the version as the name. Let's suppose you bump the version of your project from `v2.3.0` to `v2.4.0`. Both versions would remain on your Space, under different paths:

- `v2.3.0` -> `https://SPACE.fra1.digitaloceanspaces.com/js/v2.3.0/index.min.js`
- `v2.4.0` -> `https://SPACE.fra1.digitaloceanspaces.com/js/v2.4.0/index.min.js`

The most recent version will be available with the `latest` tag:

- `latest` -> `https://SPACE.fra1.digitaloceanspaces.com/js/latest/index.min.js`

The `versioning` parameter can be set to true/false, or a string representing the path to the `package.json` file.

[See example](#use-packagejson-version)

### CDN Domain

Instead of outputting the normal DigitalOcean domain `https://SPACE.fra1.digitaloceanspaces.com/`, you can also specify your custom CDN domain with `cdn_domain`.

**Note:** `https://SPACE.REGION.digitaloceanspaces.com/` is still used to connect to your Space, [do-spaces-action](https://github.com/BetaHuhn/do-spaces-action) will just use it when logging it and assigning it to the action output variable `output_url`.

[See example](#specify-a-custom-cdn-domain)

### File permissions

By default all uploaded files have their access permission set to `public-read`. This means that anyone can access them via their own Space URL. If you want to block public access, you can set `permission` to `private`.

## 📖 Examples

Here are a few examples to help you get started!

### Basic Example

This example will run everytime you create a new release and then upload all files and directories in the `src` folder to the root of your Space.

```yml
name: Upload to DO Spaces
on:
  release:
    types: [created]
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: BetaHuhn/do-spaces-action@v2
        with:
          access_key: ${{ secrets.ACCESS_KEY}}
          secret_key: ${{ secrets.SECRET_KEY }}
          space_name: ${{ secrets.SPACE_NAME }}
          space_region: ${{ secrets.SPACE_REGION }}
          source: src
```

### Custom output path

This example will run everytime you create a new release and then upload the `src` directory to the `dist` folder on your Space.

```yml
name: Upload to DO Spaces
on:
  release:
    types: [created]
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: BetaHuhn/do-spaces-action@v2
        with:
          access_key: ${{ secrets.ACCESS_KEY}}
          secret_key: ${{ secrets.SECRET_KEY }}
          space_name: ${{ secrets.SPACE_NAME }}
          space_region: ${{ secrets.SPACE_REGION }}
          source: src
          out_dir: dist
```

### Single file upload

This example will run everytime you create a new release and then upload the file `path/to/file.js` to the root of your Space.

```yml
name: Upload to DO Spaces
on:
  release:
    types: [created]
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: BetaHuhn/do-spaces-action@v2
        with:
          access_key: ${{ secrets.ACCESS_KEY}}
          secret_key: ${{ secrets.SECRET_KEY }}
          space_name: ${{ secrets.SPACE_NAME }}
          space_region: ${{ secrets.SPACE_REGION }}
          source: path/to/file.js
```

### Use package.json version

This example will run everytime you create a new release and then upload the file `dist/index.min.js` to both the `latest` and `vX.X.X` folder in the js directory in your Space.

```yml
name: Upload to DO Spaces
on:
  release:
    types: [created]
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: BetaHuhn/do-spaces-action@v2
        with:
          access_key: ${{ secrets.ACCESS_KEY}}
          secret_key: ${{ secrets.SECRET_KEY }}
          space_name: ${{ secrets.SPACE_NAME }}
          space_region: ${{ secrets.SPACE_REGION }}
          source: dist/index.min.js
          out_dir: js
          versioning: true
```

The `versioning` parameter can be set to true/false, or a string representing the path to the `package.json` file.

### Specify a custom CDN domain

```yml
name: Upload to DO Spaces
on:
  release:
    types: [created]
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: BetaHuhn/do-spaces-action@v2
        with:
          access_key: ${{ secrets.ACCESS_KEY}}
          secret_key: ${{ secrets.SECRET_KEY }}
          space_name: ${{ secrets.SPACE_NAME }}
          space_region: ${{ secrets.SPACE_REGION }}
          source: src
          cdn_domain: cdn.example.com
```

### Create deployment on GitHub

[do-spaces-action](https://github.com/BetaHuhn/do-spaces-action) can be perfectly intergrated with Actions like [Create Deployment Status Update](https://github.com/marketplace/actions/create-deployment-status-update) to create a deployment once all files are uploaded:

```yml
name: Upload to DO Spaces
on:
  release:
    types: [created]
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: altinukshini/deployment-action@releases/v1
        name: start deployment
        id: deployment
        with:
          token: ${{ secrets.GITHUB_TOKEN}}
          description: Uploading files to DO Spaces
          environment: production

      - uses: BetaHuhn/do-spaces-action@v2
        name: upload to spaces
        id: spaces
        with:
          access_key: ${{ secrets.ACCESS_KEY}}
          secret_key: ${{ secrets.SECRET_KEY }}
          space_name: ${{ secrets.SPACE_NAME }}
          space_region: ${{ secrets.SPACE_REGION }}
          source: src
          out_dir: dist
          versioning: true

      - name: update deployment status
        if: always()
        uses: altinukshini/deployment-status@releases/v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          state: ${{ job.status }}
          deployment_id: ${{ steps.deployment.outputs.deployment_id }}
          environment_url: ${{steps.spaces.outputs.output_url}}
          description: "Successfully uploaded files to DO Spaces"
```

Here's how that will look on your Repo:

![Deployment preview](https://cdn.mxis.ch/assets/do-spaces-action/deployment.png)

## 📝 To do

Here is what's currently planned for [do-spaces-action](https://github.com/BetaHuhn/do-spaces-action):

- **Different environments:** add the option to change the upload path pased on the environment (staging/production)

If you have an idea, feel free to [open an issue](https://github.com/BetaHuhn/do-spaces-action/issues/new?labels=feature+request&template=feature_request.md)!

## 💻 Development

Issues and PRs are very welcome!

The actual source code of this library is in the `src` folder.

- run `yarn lint` or `npm run lint` to run eslint.
- run `yarn start` or `npm run start` to run the Action locally.
- run `yarn build` or `npm run build` to produce a production version in the `dist` folder.

## ❔ About

This project was developed by me ([@betahuhn](https://github.com/BetaHuhn)) in my free time. If you want to support me:

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=394RTSBEEEFEE)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F81S2RK)

## 📄 License

Copyright 2021 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
