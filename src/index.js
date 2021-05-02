const core = require('@actions/core')
const fs = require('fs')
const path = require('path')

const config = require('./config')
const S3 = require('./interface')
const { forEach, getVersion } = require('./helpers')

const run = async () => {
	const shouldVersion = config.versioning !== 'false'

	let outDir = config.outDir
	if (shouldVersion) {
		const version = getVersion(config.versioning)

		core.debug('using version: ' + version)

		outDir = path.join(config.outDir, version)
	}

	core.debug(outDir)

	const s3 = new S3({
		bucket: config.spaceName,
		region: config.spaceRegion,
		access_key: config.accessKey,
		secret_key: config.secretKey,
		permission: config.permission
	})

	const fileStat = await fs.promises.stat(config.source)
	const isFile = fileStat.isFile()

	if (isFile) {
		const fileName = path.basename(config.source)
		const s3Path = path.join(outDir, fileName)

		core.debug('Uploading file: ' + s3Path)
		await s3.upload(config.source, s3Path)

		if (shouldVersion) {
			const s3PathLatest = path.join(config.outDir, 'latest', fileName)

			core.debug('Uploading file to latest: ' + s3PathLatest)
			await s3.upload(config.source, s3PathLatest)
		}
	} else {
		core.debug('Uploading directory')

		const uploadFolder = async (currentFolder) => {
			const files = await fs.promises.readdir(currentFolder)

			await forEach(files, async (file) => {
				const fullPath = path.join(currentFolder, file)
				const stat = await fs.promises.stat(fullPath)

				if (stat.isFile()) {
					const s3Path = path.join(outDir, path.relative(config.source, fullPath))

					core.debug('Uploading file: ' + s3Path)
					await s3.upload(fullPath, s3Path)

					if (shouldVersion) {
						const s3PathLatest = path.join(config.outDir, 'latest', path.relative(config.source, fullPath))

						core.debug('Uploading file to latest: ' + s3PathLatest)
						await s3.upload(fullPath, s3PathLatest)
					}
				} else {
					uploadFolder(fullPath)
				}
			})
		}

		await uploadFolder(config.source)
	}

	const outputPath = config.cdnDomain ? `https://${ config.cdnDomain }/${ outDir }` : `https://${ config.spaceName }.${ config.spaceRegion }.digitaloceanspaces.com/${ outDir }`

	core.info(`Files uploaded to ${ outputPath }`)
	core.setOutput('output_url', outputPath)
}

run()
	.then(() => {})
	.catch((err) => {
		core.error(err)
		core.setFailed(err.message)
	})