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
const VERSIONING = core.getInput('versioning', {
	required: false
})
const CDN_DOMAIN = core.getInput('cdn_domain', {
	required: false
})
const PERMISSION = core.getInput('permission', {
	required: false
})

const getVersion = function(value) {
	try {
		const pkgPath = (typeof value === 'string' && value !== 'true') ? value : ''
		const raw = fs.readFileSync(path.join(pkgPath, 'package.json')).toString()
		const version = JSON.parse(raw).version
		if (!version) return ''

		return version.charAt(0) !== 'v' ? `v${ version }` : version
	} catch (err) {
		return ''
	}
}

async function run() {
	try {
		const sourceDir = path.join(process.cwd(), SOURCE_DIR)
		const permission = PERMISSION || 'public-read'

		let outDir = OUT_DIR
		if (VERSIONING !== undefined && VERSIONING !== false) {
			const version = getVersion(VERSIONING)
			core.debug('using version: ' + version)
			outDir = path.join(OUT_DIR, version)
		}

		core.debug(outDir)

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

			files.forEach(async (file) => {
				const fullPath = path.join(currentFolder, file)
				const stat = await fs.promises.stat(fullPath)

				if (stat.isFile()) {
					const s3Path = path.join(outDir, path.relative(sourceDir, fullPath))
					core.debug('Uploading: ' + s3Path)
					await s3.upload(fullPath, s3Path)
				} else {
					uploadFolder(fullPath)
				}
			})
		}

		await uploadFolder(sourceDir)

		const outputPath = CDN_DOMAIN ? `https://${ CDN_DOMAIN }/${ outDir }` : `https://${ SPACE_NAME }.${ SPACE_REGION }.digitaloceanspaces.com/${ outDir }`

		core.info(`Files uploaded to ${ outputPath }`)
		core.setOutput('output_url', outputPath)

	} catch (err) {
		core.debug(err)
		core.setFailed(err.message)
	}
}

run()