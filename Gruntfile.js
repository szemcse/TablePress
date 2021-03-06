/*
 * TablePress Grunt configuration
 *
 * Performs syntax checks and minifies CSS and JS files.
 * To run, use "npm install" and "grunt build" in the main plugin folder.
 * Running just "grunt" will run the "watch" task, which will automatically
 * lint and minify all changed CSS or JS files.
 */
module.exports = function( grunt ) {

	// Task configuration
	grunt.initConfig( {
		// JavaScript syntax validation
		jshint: {
			all: {
				src: [ 'Gruntfile.js', '<%= uglify.all.src %>' ]
			},
			changed: {
				src: []
			},
			options: {
				curly:   false,
				eqeqeq:  false,
				immed:   true,
				latedef: true,
				newcap:  true,
				noarg:   true,
				sub:     true,
				undef:   false,
				boss:    true,
				eqnull:  true,
				laxbreak: true,
				globals: {
					exports: true,
					module:  false
				}
			}
		},

		// JavaScript minification
		uglify: {
			all: {
				expand: true,
				ext: '.min.js',
				src: [ 'admin/js/*.js', '!admin/js/*.min.js' ]
			},
			changed: {
				expand: true,
				ext: '.min.js',
				src: []
			}
		},

		// CSS syntax validation
		csslint: {
			options: {
				'important': false,
				'ids': false,
				'regex-selectors': false,
				'unqualified-attributes': false,
				'outline-none': false,
				'box-model': false,
				'display-property-grouping': false,
				'adjoining-classes': false,
				'empty-rules': false,
				'overqualified-elements': false,
				'known-properties': false,
				'compatible-vendor-prefixes': false,
				'universal-selector': false,
				'bulletproof-font-face': false,
				'box-sizing': false
			},
			all: {
				src: [
					'css/*.css', '!css/*.min.css',
					'admin/css/*.css', '!admin/css/*.min.css'
				]
			},
			changed: {
				src: []
			}
		},

		// CSS minification
		cssmin: {
			options: {
				removeEmpty: true
			},
			all: {
				expand: true,
				ext: '.min.css',
				src: [
					'css/*.css', '!css/*.min.css',
					'admin/css/*.css', '!admin/css/*.min.css'
				]
			},
			changed: {
				expand: true,
				ext: '.min.css',
				src: []
			}
		},

		// Watch files for changes
		watch: {
			options: {
				event: [ 'changed' ],
				spawn: false
			},
			js: {
				files: '<%= jshint.all.src %>',
				tasks: [ 'jshint:changed', 'uglify:changed' ]
			},
			css: {
				files: '<%= cssmin.all.src %>',
				tasks: [ 'csslint:changed', 'cssmin:changed' ]
			}
		}
	} );

	// Load tasks
	require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

	// Register "build" task
	grunt.registerTask( 'build', [ 'jshint:all', 'uglify:all', 'csslint:all', 'cssmin:all' ] );

	// Make "watch" the default task
	grunt.registerTask( 'default', [ 'watch' ] );

	// Add a listener to the "watch" task
	//
	// On "watch", automatically updates the "changed" target for the
	// "jshint", "uglify", "csslint", and "cssmin" task configurations,
	// so that only the changed files are linted/minified.
	grunt.event.on( 'watch', function( action, filepath, target ) {
		grunt.config( [ 'jshint', 'changed', 'src' ], filepath );
		grunt.config( [ 'uglify', 'changed', 'src' ], filepath );
		grunt.config( [ 'csslint', 'changed', 'src' ], filepath );
		grunt.config( [ 'cssmin', 'changed', 'src' ], filepath );
	} );

};