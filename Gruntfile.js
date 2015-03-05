module.exports = function(grunt) {

    // Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        connect: {
	      server: {
		      options: {
			      hostname: 'localhost',
			      port: 4000,
			      base: '_site',
			      livereload: true
		      }
	      }
        },
		jekyll: {
		    dist: {
		      options: {
		        config: '_config.yml'
		      }
		    }
		},
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'_patternlab/source/css/style.css': '_patternlab/source/css/style.scss'
				}
			}
		},
		autoprefixer: {
			single_file: {
				src: 'css/style.css',
				dest: 'css/style.css'
			}
        },
        shell: {
			patternlab: {
				command: "php _patternlab/core/console --generate"
			}
        },
        pattern_lab_component_builder: {
		    colors: {
		      options: {
		        regex: "^\\$color--.*",
		        allow_var_values: false
		      },
		      src: 'scss/global/variables/_colors.scss',
		      dest: 'source/_patterns/00-atoms/01-global/00-colors.json'
		    },
		    fonts: {
		      options: {
		        'regex': "^\\$type.*"
		      },
		      src: "scss/global/variables/_type-sizes.scss",
		      dest: "source/_patterns/00-atoms/02-text/02-type-sizes.json"
		    }
		},
		watch: {
			options: {
				livereload: true	
			},
			html: {
  				files: ['_patternlab/source/_patterns/**/*.mustache', '_patternlab/source/_patterns/**/*.json', '_patternlab/source/_data/*.json'],
  				tasks: ['shell:patternlab'],
  				options: {
  					spawn: false
  				}
  			},
			site: {
				files: ['index.html', '_layouts/*.html', '_includes/*.html', '*.md'],
				tasks: ['jekyll'],
				options: {
					livereload: true	
				}
			},
			css: {
				files: ['_patternlab/source/css/*.scss', '_patternlab/source/css/**/*.scss'],
				tasks: ['sass', 'autoprefixer', 'jekyll', 'shell:patternlab'],
				options: {
					livereload: true	
				}
			}
		}
    });

	// Plugins
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-serve');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-pattern-lab-component-builder');

	grunt.registerTask('serve', ['jekyll','connect:server','watch', 'shell:patternlab', 'copy', 'pattern_lab_component_builder']);

	// Tasks
	grunt.registerTask('default', ['sass', 'watch', 'autoprefixer', 'connect:server', 'jekyll', 'shell:patternlab', 'pattern_lab_component_builder']);
};
