module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dist: {
        files: {
          'ngModelOptions.min.js': ['ngModelOptions.js']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'ngModelOptions.js'],
      options: {
        globals: {
          angular: true,
          console: true,
          document: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint','uglify']);

};