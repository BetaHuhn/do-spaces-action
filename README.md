<div align="center">
  
# do-spaces-action

[![Build](https://github.com/BetaHuhn/do-spaces-action/workflows/Build/badge.svg)](https://github.com/BetaHuhn/do-spaces-action/actions?query=workflow%3ABuild) [![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/BetaHuhn/do-spaces-action/blob/master/LICENSE) ![David](https://img.shields.io/david/betahuhn/do-spaces-action)

Upload directories/files to DigitalOcean Spaces via GitHub Actions.

</div>

## 👋 Introduction

Use [do-spaces-action](https://github.com/BetaHuhn/do-spaces-action) to deploy a file or directory to your DigitalOcean Space with GitHub Actions. This can be used to host your static site, or as an self-hosted alternative to something like JSDelivr for serving your JS files/library via a CDN. [do-spaces-action](https://github.com/BetaHuhn/do-spaces-action) can also automatically grab the version number from the package.json and use it to host multiple versions at once (more info [below](#versioning)).

## 🚀 Features

- upload a single file or whole directories
- specify output directory on your Space
- automatic versioning of your uploads
- use your CDN endpoint (custom domain)
- integrates with GitHub deployments

## 📚 Usage

Create a `.yml` file in your `.github/workflows` folder (you can find more info about the structure in the [GitHub Docs](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions)):

```yml
- uses: BetaHuhn/do-spaces-action@master
  with:
    source: more info below
```

In order to access your DigitalOcean Space, you have to setup a few [Repository Secrets](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository):

- *ACCESS_KEY* - Your DigitalOcean access key (generate one [here](https://cloud.digitalocean.com/account/api/tokens))
- *SECRET_KEY* - Your DigitalOcean secret key (generate one [here](https://cloud.digitalocean.com/account/api/tokens))
- *SPACE_NAME* - The name of your DigitalOcean Space.
- *SPACE_REGION* - The region of your DigitalOcean Space.

## ⚙️ Configuration

Here are all the parameters [do-spaces-action](https://github.com/BetaHuhn/do-spaces-action) takes:

```yml
access_key: your DigitalOcean access key (best to set it as a repo secret)
secret_key: your DigitalOcean access key (best to set it as a repo secret)
space_name: name of your DigitalOcean space
space_region: region of your DigitalOcean space
source: path to source file or folder (what you want to upload)
out_dir: path to the output directory on your space (default is the root dir)
versioning: enable versioning (either set it to true or specify path to package.json)
cdn_domain: custom domain pointing to your CDN endpoint
permission: change the permission of the uploaded file (default public-read)
```

## 🛠️ Examples

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
      - uses: BetaHuhn/do-spaces-action@master
        with:
          access_key: ${{ secrets.ACCESS_KEY}}
          secret_key: ${{ secrets.SECRET_KEY }}
          space_name: ${{ secrets.SPACE_NAME }}
          space_region: ${{ secrets.SPACE_REGION }}
          source: "src"
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
      - uses: BetaHuhn/do-spaces-action@master
        with:
          access_key: ${{ secrets.ACCESS_KEY}}
          secret_key: ${{ secrets.SECRET_KEY }}
          space_name: ${{ secrets.SPACE_NAME }}
          space_region: ${{ secrets.SPACE_REGION }}
          source: "src"
          out_dir: "dist"
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
      - uses: BetaHuhn/do-spaces-action@master
        with:
          access_key: ${{ secrets.ACCESS_KEY}}
          secret_key: ${{ secrets.SECRET_KEY }}
          space_name: ${{ secrets.SPACE_NAME }}
          space_region: ${{ secrets.SPACE_REGION }}
          source: "path/to/file.js"
```

### Versioning

[do-spaces-action](https://github.com/BetaHuhn/do-spaces-action) also supports versioning and can detect the current version from your `package.json` and then upload the file/s to a folder with the version as the name. Let's suppose you bump the version of your project from `v2.3.0` to `v2.4.0`. Both versions would remain on your Space, under different paths:

- `v2.3.0` -> `https://SPACE.fra1.digitaloceanspaces.com/js/v2.3.0/index.min.js`
- `v2.4.0` -> `https://SPACE.fra1.digitaloceanspaces.com/js/v2.4.0/index.min.js`

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
      - uses: BetaHuhn/do-spaces-action@master
        with:
          access_key: ${{ secrets.ACCESS_KEY}}
          secret_key: ${{ secrets.SECRET_KEY }}
          space_name: ${{ secrets.SPACE_NAME }}
          space_region: ${{ secrets.SPACE_REGION }}
          source: "dist/index.min.js"
          out_dir: "js"
          versioning: true
```

The `versioning` parameter can be set to true/false, or a string representing the path to the `package.json` file.

### Custom CDN domain

Instead of outputting the normal DigitalOcean domain `https://SPACE.fra1.digitaloceanspaces.com/`, you can also specify your custom CDN domain:

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
      - uses: BetaHuhn/do-spaces-action@master
        with:
          access_key: ${{ secrets.ACCESS_KEY}}
          secret_key: ${{ secrets.SECRET_KEY }}
          space_name: ${{ secrets.SPACE_NAME }}
          space_region: ${{ secrets.SPACE_REGION }}
          source: "src"
          cdn_domain: "cdn.example.com"
```

**Note:** `https://SPACE.fra1.digitaloceanspaces.com/` is still used to connect to your Space, [do-spaces-action](https://github.com/BetaHuhn/do-spaces-action) will just use it when logging it and assigning it to the action output variable `output_url`.

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
          description: "Uploading files to DO Spaces"
          environment: production

      - uses: BetaHuhn/do-spaces-action@master
        name: upload to spaces
        id: spaces
        with:
          access_key: ${{ secrets.ACCESS_KEY}}
          secret_key: ${{ secrets.SECRET_KEY }}
          space_name: ${{ secrets.SPACE_NAME }}
          space_region: ${{ secrets.SPACE_REGION }}
          source: "src"
          out_dir: "dist"
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

- **Automatic minifying:** minify js files before uploading them
- **Different environments:** add the option to change the upload path pased on the environment (staging/production)

If you have an idea, feel free to [open an issue](https://github.com/BetaHuhn/do-spaces-action/issues/new?labels=feature+request&template=feature_request.md)!

## 💻 Development

Issues and PRs are very welcome!

Please check out the [contributing guide](CONTRIBUTING.md) before you start.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). To see differences with previous versions refer to the [CHANGELOG](CHANGELOG.md).

## ❔ About

This project was developed by me ([@betahuhn](https://github.com/BetaHuhn)) in my free time. If you want to support me:

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=394RTSBEEEFEE)

## License

Copyright 2020 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.