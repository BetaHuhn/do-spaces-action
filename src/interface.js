const AWS = require('aws-sdk')
const fs = require('fs')

class S3Interface {
	constructor(config) {
		this.bucket = config.bucket
		this.permission = config.permission

		const spacesEndpoint = new AWS.Endpoint(`${ config.region }.digitaloceanspaces.com`)
		const s3 = new AWS.S3({
			endpoint: spacesEndpoint,
			accessKeyId: config.access_key,
			secretAccessKey: config.secret_key
		})

		this.s3 = s3
	}

	async upload(file, path) {
		return new Promise((resolve, reject) => {

			const fileStream = fs.createReadStream(file)

			const options = {
				Body: fileStream,
				Bucket: this.bucket,
				Key: path,
				ACL: this.permission
			}

			this.s3.upload(options, (err, data) => {
				if (err) {
					return reject(err)
				}

				resolve(data)
			})
		})
	}
}

module.exports = S3Interface