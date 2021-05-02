const path = require('path')
const { getInput } = require('action-input-parser')

const config = {
	source: getInput({
		key: 'source',
		required: true,
		modifier: (val) => {
			return path.join(process.cwd(), val)
		}
	}),
	outDir: getInput({
		key: 'out_dir',
		default: '/'
	}),
	spaceName: getInput({
		key: 'space_name',
		required: true
	}),
	spaceRegion: getInput({
		key: 'space_region',
		required: true
	}),
	accessKey: getInput({
		key: 'access_key',
		required: true
	}),
	secretKey: getInput({
		key: 'secret_key',
		required: true
	}),
	versioning: getInput({
		key: 'versioning',
		default: 'false'
	}),
	cdnDomain: getInput({
		key: 'cdn_domain'
	}),
	permission: getInput({
		key: 'permission',
		default: 'public-read'
	})
}

module.exports = config