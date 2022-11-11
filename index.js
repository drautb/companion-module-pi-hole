var instance_skel = require('../../instance_skel');
var debug;
var log;


/**
 * @param red 0-255
 * @param green 0-255
 * @param blue 0-255
 * @returns RGB value encoded for Companion Bank styling
 */
const rgb = (red, green, blue) => {
  return ((red & 0xff) << 16) | ((green & 0xff) << 8) | (blue & 0xff)
}

const ENABLED_COLOR = rgb(35, 117, 67)
const DISABLED_COLOR = rgb(255, 103, 0)

const PIHOLE_ICON = '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'

/**
 * Companion instance class for PiHole
 */
class PiHoleInstance extends instance_skel {

	enabled = true

	constructor(system, id, config) {
		super(system, id, config)
		this.system = system
		this.config = config
	}

	/**
	 * Triggered on instance being enabled
	 */
	init() {
		this.log('info', 'PiHole module loaded')
		this.checkConnection()
		this.updateInstance()
		this.updatePresets()
	}

	checkConnection() {
		var self = this
		self.status(self.STATUS_WARNING, 'Connecting')

		var host = `http://${self.config.host}:${self.config.port}`
		self.log('info', `Attempting to reach PiHole at ${host}`)
		self.system.emit('rest_get', host, function (err, result) {
			if (err !== null) {
				self.log('error', `Error connecting to PiHole (${result.error.code})`);
				self.status(self.STATUS_ERROR, result.error.code);
			} else {
				self.log('info', `Connected to PiHole successfully: ${result.data}`)
				self.status(self.STATUS_OK);
			}
		})
	}

	config_fields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'PiHole Host',
				width: 12
			},
			{
				type: 'number',
				id: 'port',
				label: 'PiHole Port',
				width: 12,
				default: 80,
				min: 1,
				max: 65535,
				step: 1
			},
			{
				type: 'textinput',
				id: 'token',
				label: 'API Token'
			}
		]
	}

	updateConfig(config) {
		this.log('info', 'Updating config')
		this.config = config;
		this.checkConnection()
	}


	updateInstance() {
		this.log('info', 'Updating instance')
		this.updateActions()
		this.updateFeedbacks()
	}

	disablePiHole(disableTime) {
		var self = this

		var disableParam = "disable"
		if (disableTime > 0) {
			disableParam += `=${disableTime}`
		}

		var url = `http://${self.config.host}:${self.config.port}/admin/api.php?${disableParam}&auth=${self.config.token}`
		self.log('info', `Disabling PiHole: ${url}`)
		self.system.emit('rest_get', url, function (err, result) {
			if (err !== null) {
				self.log('error', `Error disabling PiHole (${result.error.code})`);
			} else if (result.response.statusCode !== 200) {
				self.log('error', `Received non-200 response: ${result.response.statusCode} (${result.data})`)
			} else if (result.data.status !== "disabled") {
				self.log('error', `Received 200 response, but status was not 'disabled': ${result.data}`)
			} else {
				self.log('info', `Disabled PiHole successfully: ${JSON.stringify(result.data)}`)
				self.enabled = false
				self.checkFeedbacks('updateBackgroundColor')
			}
		})
	}

	enablePiHole() {
		var self = this
		var url = `http://${self.config.host}:${self.config.port}/admin/api.php?enable&auth=${self.config.token}`
		self.log('info', `Enabling PiHole: ${url}`)
		self.system.emit('rest_get', url, function (err, result) {
			if (err !== null) {
				self.log('error', `Error enabling PiHole (${result.error.code})`);
			} else if (result.response.statusCode !== 200) {
				self.log('error', `Received non-200 response: ${result.response.statusCode} (${result.data})`)
			} else if (result.data.status !== "enabled") {
				self.log('error', `Received 200 response, but status was not 'enabled': ${result.data}`)
			} else {
				self.log('info', `Enabled PiHole successfully: ${JSON.stringify(result.data)}`)
				self.enabled = true
				self.checkFeedbacks('updateBackgroundColor')
			}
		})
	}

	updateActions() {
		this.setActions({
			toggleStatus: {
				label: 'Toggle PiHole Status',
				options: [],
				callback: (action) => {
					var self = this
					if (self.enabled) {
						self.disablePiHole()
					} else {
						self.enablePiHole()
					}
				}
			}
		})
	}

	updateFeedbacks() {
		this.setFeedbackDefinitions({

			updateBackgroundColor: {
				type: 'advanced',
				label: 'Update Background Color',
				description: 'Updates button background to match current disabled/enabled status of PiHole',
				callback: (feedback) => {
					var self = this
					return {
						bgcolor: self.enabled ? ENABLED_COLOR : DISABLED_COLOR
					}
				}
			}

		})
	}

	updatePresets() {
		this.setPresetDefinitions([
			{
				category: 'Commands',
				label: 'Toggle PiHole Status',
				bank: {
					style: 'png',
					png64: PIHOLE_ICON,
					bgcolor: ENABLED_COLOR
				},
				actions: [{	action: 'toggleStatus' }],
				feedbacks: [{ type: 'updateBackgroundColor'	}]
			}

		])
	}

	destroy() {
		this.log('info', `PiHole module instance destroyed: ${this.id}`)
	}
}

module.exports = PiHoleInstance