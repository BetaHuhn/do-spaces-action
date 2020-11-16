const core = require('@actions/core')
const fs = require('fs')
const path = require('path')
const S3 = require('./interface')

const SOURCE_DIR = core.getInput('source_dir', {
	required: true
})
const OUT_DIR = core.getInput('out_dir', {
	required: false
})
const SPACE_NAME = core.getInput('space_name', {
	required: true
})
const SPACE_REGION = core.getInput('space_region', {
	required: true
})
const ACCESS_KEY = core.getInput('access_key', {
	required: true
})
const SECRET_KEY = core.getInput('secret_key', {
	required: true
})
const PERMISSION = core.getInput('permission', {
	required: false
})

/* const runId = process.env.GITHUB_RUN_ID
const repo = process.env.GITHUB_REPOSITORY
const workflow = process.env.GITHUB_WORKFLOW */

async function run() {
	try {
		const sourceDir = path.join(process.cwd(), SOURCE_DIR)
		core.info(sourceDir)
		const permission = PERMISSION || 'public-read'

		const config = {
			bucket: SPACE_NAME,
			region: SPACE_REGION,
			access_key: ACCESS_KEY,
			secret_key: SECRET_KEY,
			permission: permission
		}
		const s3 = new S3(config)

		const uploadFolder = async (currentFolder) => {

			const files = await fs.promises.readdir(currentFolder)

			core.info(files)

			files.forEach(async (file) => {
				const fullPath = path.join(currentFolder, file)
				core.info(fullPath)
				const stat = await fs.promises.stat(fullPath)

				if (stat.isFile()) {
					const s3Path = path.join(OUT_DIR, path.relative(sourceDir, fullPath))
					core.info(s3Path)
					await s3.upload(fullPath, s3Path)
				} else {
					uploadFolder(fullPath)
				}
			})
		}

		uploadFolder(sourceDir)

		core.info(`Files uploaded to ${ SPACE_REGION }.digitaloceanspaces.com/${ OUT_DIR }`)

	} catch (err) {
		core.debug(err)
		core.setFailed(err.message)
	}
}

run()