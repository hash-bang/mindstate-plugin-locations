var _ = require('lodash');
var async = require('async-chainable');
var colors = require('colors');
var fs = require('fs-extra');
var fspath = require('path');

module.exports = {
	name: 'locations',
	description: 'Backup specified on-disk directories',
	backup: function(finish, workspace) {
		async()
			.then(function(next) {
				// Sanity checks {{{
				if (!mindstate.config.locations.enabled) {
					if (mindstate.verbose) console.log(colors.blue('[Locations]'), 'Locations backup is disabled');
					return next('SKIP');
				}

				if (!mindstate.config.locations.dir.length) {
					if (mindstate.verbose) console.log(colors.blue('[Locations]'), 'No locations specified to backup');
					return next('SKIP');
				}
				next();
				// }}}
			})
			.forEach(mindstate.config.locations.dir, function(next, dir) {
				if (mindstate.verbose) console.log(colors.blue('[Locations]'), 'Backup', colors.cyan(dir));
				fs.copy(dir, workspace.dir + '/' + fspath.dirname(dir), function(err) {
					if (err) return next('Error during copy - ' + err.toString());
					if (mindstate.verbose > 1) console.log(colors.blue('[Locations]'), 'Backup complete of', colors.cyan(dir));
					next();
				});
			})
			.then(function(next) {
				if (mindstate.verbose) console.log(colors.blue('[Locations]'), colors.cyan(mindstate.config.locations.dir.length), 'paths copied');
				return next();
			})
			.end(finish);
	},
	config: function(finish) {
		return finish(null, {
			locations: {
				enabled: true,
				dir: [],
			},
		});
	},
};
