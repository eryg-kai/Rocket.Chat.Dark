var fs = require('fs');
var request = require('request');
var apiRoot = '/api/v1';
var configFile = __dirname + '/deploy.json';

/**
 * Performs a post request to the Rocket.Chat API.
 *
 * @param {string}        url      Rocket.Chat URL.
 * @param {object|null}   data     Post/form data.
 * @param {object|null}   headers  Authentication headers.
 * @param {string}        endpoint API request endpoint.
 * @param {Function}      done     Callback.
 */
function apiRequest(url, data, headers, endpoint, done) {
	let options = {
		url: url + apiRoot + '/' + endpoint
	};

	if (data) {
		options.form = data;
	}

	if (headers) {
		options.headers = {
			'X-Auth-Token': headers.authToken,
			'X-User-Id': headers.userId
		};
	}

	request.post(options, function (error, response, body) {
		if (error) {
			done(error);
			return;
		}

		try {
			body = JSON.parse(body);
		}
		catch (error) {
			done('Unable to parse response');
			return;
		}

		if (body.status === 'error') {
			done(body.message || 'Unspecified error');
			return;
		}

		done(null, body);
	});
}

/**
 * Deploys CSS to Rocket.Chat using the authentication token and ID.
 *
 * @param {string}   cssFile Absolute path of the CSS file to deploy.
 * @param {string}   url     Rocket.Chat URL.
 * @param {object}   headers Authentication headers.
 * @param {Function} done    Callback.
 */
function deployCSS(cssFile, url, headers, done) {
	let data = {
		value: fs.readFileSync(cssFile, 'utf8')
	};
	let endpoint = 'settings/theme-custom-css';
	apiRequest(url, data, headers, endpoint, function (error, body) {
		if (error) {
			done('[settings]' + error);
			return;
		}

		if (!body.success) {
			done('Unable to deploy CSS');
			return;
		}

		done();
	});
}

/**
 * Prompts for input.
 *
 * @param {string}   question Question to ask the user.
 * @param {Function} done     Callback.
 */
function prompt(question, done) {
	process.stdout.write(question);

	process.stdin.once('data', function (data) {
		done(data.toString().trim());
	});
}

/**
 * Reads in the config file. If the file is not found or url is not set, it asks
 * for the url. It calls done() with the URL and an object with the
 * authentication credentials.
 *
 * @param {Function} done Callback.
 */
function parseConfig(done) {
	if (!fs.existsSync(configFile)) {
		prompt('URL: ', function (url) {
			done(url, {});
		});
		return;
	}

	let config = require(configFile);
	if (!config.url) {
		prompt('URL: ', function (url) {
			done(url, {});
		});
		return;
	}

	done(config.url, config);
}

/**
 * Prompts the user for their Rocket.Chat username and password so we can get
 * the authentication token and ID.
 *
 * @param {Function} done
 */
function askForUsernameAndPassword(done) {
	prompt('Username: ', function (username) {
		prompt('Password: ', function (password) {
			done(username, password);
		});
	});
}
/**
 * Gets authentication credentials from Rocket.Chat using the user's Rocket.Chat
 * username and password.
 *
 * @param {string}   url  Rocket.Chat URL.
 * @param {object}   data Post/form data.
 * @param {Function} done Callback.
 */
function getAuthCredentials(url, data, done) {
	apiRequest(url, data, null, 'login', function (error, response) {
		if (error) {
			done('[login] ' + error);
			return;
		}

		done(null, response.data);
	});
}

/**
 * Writes data to the config file so we don't have to keep asking/querying for
 * it.
 *
 * @param {string} url     Rocket.Chat URL.
 * @param {object} headers Authentication headers.
 */
function writeDataToConfigFile(url, headers) {
	headers.url = url;
	fs.writeFileSync(configFile, JSON.stringify(headers, null, 2) + "\n");
	delete headers.url;
}

/**
 * Builds and deploys CSS to Rocket.Chat.
 *
 * @param {string}   cssFile Absolute path of the CSS file to deploy.
 * @param {Function} done    Callback.
 */
module.exports = function (cssFile, done) {
	parseConfig(function (url, headers) {
		if (headers.authToken && headers.userId) {
			deployCSS(cssFile, url, headers, done);
			return;
		}

		askForUsernameAndPassword(function (username, password) {
			let data = {
				username: username,
				password: password
			};
			getAuthCredentials(url, data, function (error, credentials) {
				if (error) {
					done(error);
					return;
				}

				writeDataToConfigFile(url, credentials);
				deployCSS(cssFile, url, credentials, done);
			});
		});
	});
};
