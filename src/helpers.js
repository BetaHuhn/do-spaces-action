const fs = require('fs')
const path = require('path')

// From https://github.com/toniov/p-iteration/blob/master/lib/static-methods.js - MIT © Antonio V
const forEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		// eslint-disable-next-line callback-return
		await callback(array[index], index, array)
	}
}

const getVersion = (value) => {
	try {
		const pkgPath = value !== 'true' ? value : ''
		const raw = fs.readFileSync(path.join(pkgPath, 'package.json')).toString()
		
		const version = JSON.parse(raw).version
		if (!version) return ''

		return version.charAt(0) !== 'v' ? `v${ version }` : version
	} catch (err) {
		return ''
	}
}

module.exports = {
    forEach,
    getVersion
}