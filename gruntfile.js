/* eslint-env node */
module.exports = function (grunt) {

	'use strict';

	grunt.initConfig({

		/**
		 * Extract the package.json,
		 *
		 * @see {@link https://gruntjs.com/api/grunt.file#grunt.file.readjson|grunt.file Tutorial}
		 * @type {Object}
		 */
		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Defines the project working directories
		 *
		 * @type {Object}
		 */
		dir: {
			pluginPath: '/srv/www/wordpress-develop/public_html/src/wp-content/plugins/<%= pkg.name %>',
			cssPath: './assets/css/',
			jsPath: './assets/js/',
		},

		/**
		 * Define PHP source files
		 *
		 * @type {Array}
		 */
		php: [
			'*.php',
			'**/*.php',
			'!docs/**',
			'!build/**',
			'!node_modules/**',
			'!tests/**'
		],

		/**
		 * Run command line on shell
		 *
		 * @type {Object}
		 */
		shell: {
			readme: {
				command: 'cd ./dev-lib && ./generate-markdown-readme' // Generate the readme.md
			},
			phpunit: {
				command: 'vagrant ssh -c "cd <%= dir.pluginPath %> && phpunit"'
			}
		},

		/**
		 * Run QUnit test
		 *
		 * @see {@link https://github.com/gruntjs/grunt-contrib-qunit}
		 * @type {Object}
		 */
		qunit: {
			all: ['./tests/qunit/**/*.html']
		},

		/**
		 * Run tasks when files has changed
		 *
		 * @see {@link https://github.com/gruntjs/grunt-contrib-watch}
		 * @type {Object}
		 */
		watch: {
			options: {
				interrupt: true
			},
			scripts: {
				files: [
					'<%= dir.jsPath %>*.js',
					'!**/*.min.js',
				],
				tasks: ['scripts:dev'],
			},
			styles: {
				files: [
					'<%= dir.cssPath %>**/*.less',
				],
				tasks: ['styles:dev'],
			},
			readme: {
				files: ['readme.txt'],
				tasks: ['shell:readme'],
			}
		},

		/**
		 * JavaScript linting with ESLint.
		 *
		 * @see {@link https://github.com/sindresorhus/grunt-eslint}
		 * @type {Object}
		 */
		eslint: {
			options: {
				fix: true
			},
			target: [
				'<%= dir.jsPath %>**/*.js',
				'!<%= dir.jsPath %>**/*.min.js',
			]
		},

		/**
		 * Minify JavaScript files files
		 *
		 * @see {@link https://github.com/gruntjs/grunt-contrib-uglify}
		 * @type {Object}
		 */
		uglify: {
			options: {
				preserveComments: false,
			},
			files: [{
				'<%= dir.jsPath %>metabox.min.js': [
					'<%= dir.jsPath %>metabox.js',
					'<%= dir.jsPath %>metabox-control-*.js',
					'!<%= dir.jsPath %>*.min.js',
				],
			}],

			dev: {
				options: {
					sourceMap: true
				},
				files: '<%= uglify.files %>'
			},
			build: {
				files: '<%= uglify.files %>'
			}
		},

		/**
		 * Compile LESS files
		 *
		 * @see {@link https://github.com/gruntjs/grunt-contrib-less}
		 * @type {Object}
		 */
		less: {
			options: {
				plugins: [
					require('less-plugin-group-css-media-queries'), // eslint-disable-line global-require
					new(require('less-plugin-clean-css'))({ // eslint-disable-line global-require
						compatibility: 'ie9'
					}),
					new(require('less-plugin-autoprefix'))({ // eslint-disable-line global-require
						browsers: [
							'last 2 version',
							'> 1%',
							'ie >= 9',
							'ie_mob >= 10',
							'ff >= 30',
							'chrome >= 34',
							'safari >= 7',
							'opera >= 23',
							'ios >= 7',
							'android >= 4',
							'bb >= 10'
						]
					}),
				]
			},

			dev: {
				options: {
					compress: false,
					sourceMap: true,
				},
				files: [{
					'<%= dir.cssPath %>metabox.css': [
						'<%= dir.cssPath %>metabox*.less'
					]
				}]
			},
		},

		/**
		 * Transforming CSS LTR to RTL.
		 *
		 * @see {@link https://github.com/MohammadYounes/grunt-rtlcss}
		 * @type {Object}
		 */
		rtlcss: {
			options: {
				map: false,
				saveUnmodified: false
			},
			target: {
				files: [{
					expand: true,
					cwd: '<%= dir.adminCSS %>',
					dest: '<%= dir.adminCSS %>',
					ext: '-rtl.css',
					src: ['*.css', '!*-rtl.css']
				}, {
					expand: true,
					cwd: '<%= dir.cssPath %>',
					dest: '<%= dir.cssPath %>',
					ext: '-rtl.css',
					src: ['*.css', '!*-rtl.css']
				}]
			}
		},

		/**
		 * Replace string in the file.
		 *
		 * @type {Object}
		 */
		replace: {
			version: {
				src: [
					'./readme.txt',
					'./composer.json',
				],
				overwrite: true,
				replacements: [{
					from: /Stable tag: (.*)/g,
					to: 'Stable tag: <%= pkg.version %>'
				}, {
					from: /Version: (.*)/g,
					to: 'Version: <%= pkg.version %>'
				}, {
					from: /Requires at least: (.*)/g,
					to: 'Requires at least: <%= pkg.wordpress.requires_at_least %>'
				}, {
					from: /Description: (.*)/g,
					to: 'Description: <%= pkg.description %>'
				}, {
					from: /\'WordPress\' => \'(.*)\'/g,
					to: '\'WordPress\' => \'<%= pkg.wordpress.requires_at_least %>\''
				}, {
					from: /Tested up to: (.*)/g,
					to: 'Tested up to: <%= pkg.wordpress.tested_up_to %>'
				},
				{
					from: /\"version\": \"(.*)\"/g,
					to: '"version": "<%= pkg.version %>"'
				},
				{
					from: /public \$version\s=\s\'(.*)\'/g,
					to: 'public \$version = \'<%= pkg.version %>\''
				}]
			}
		},

		/**
		 * Build a deploy-able plugin.
		 *
		 * @see {@link https://github.com/gruntjs/grunt-contrib-copy}
		 * @type {Object}
		 */
		copy: {
			build: {
				src: [
					'*.php',
					'includes/**',
					'languages/**',
					'readme.txt',
					'!**/*.less',
					'!**/*.map',
					'!**/changelog.md',
					'!**/readme.md',
					'!**/README.md',
					'!**/contributing.md'
				],
				dest: './build/',
				expand: true,
				dot: false
			}
		},

		/**
		 * Compress files and folders into a .zip file.
		 *
		 * @see {@link https://github.com/gruntjs/grunt-contrib-compress}
		 * @type {Object}
		 */
		compress: {
			build: {
				options: {
					archive: '<%= pkg.name %>-<%= pkg.version %>.zip'
				},
				files: [{
					expand: true,
					cwd: './build/',
					src: ['**'],
					dest: './<%= pkg.name %>/' // The directory name when the `.zip` file is uncompressed.
				}]
			}
		},

		/**
		 * Remove files and folders
		 *
		 * @see {@link https://github.com/gruntjs/grunt-contrib-clean}
		 * @type {Object}
		 */
		clean: {
			build: ['./build/'],
			zip: ['./<%= pkg.name %>*.zip']
		},

		/**
		 * Desktop notification
		 *
		 * @see {@link https://github.com/dylang/grunt-notify}
		 * @type {Object}
		 */
		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 5,
				title: "Metabox",
				success: true,
				duration: 3
			}
		}
	});

	// Load tasks
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-rtlcss');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.task.run('notify_hooks');

		// Register grunt default tasks.
	grunt.registerTask('default', [
		'styles:dev',
		'scripts:dev',
		'watch'
	]);

	/**
	 * ==================================================
	 * Register JavaScript specific tasks
	 * ==================================================
	 */

	// "Development" stage.
	grunt.registerTask('styles:dev', [
		'newer:less:dev',
		'newer:rtlcss',
	]);

	// "Build/Production" stage.
	grunt.registerTask('styles', [
		'newer:less',
		'newer:rtlcss',
	]);

	/**
	 * ==================================================
	 * Register JavaScript specific tasks
	 * ==================================================
	 */

	// "Development" stage.
	grunt.registerTask('scripts:dev', [
		'newer:eslint',
		'newer:uglify:dev'
	]);

	// "Build/Production" stage.
	grunt.registerTask('scripts', [
		'newer:eslint',
		'newer:uglify:build'
	]);
};
