/*
 * grunt-ember-defeatureify
 * https://github.com/craig/grunt-ember-defeatureify
 *
 * Copyright (c) 2014 Craig Teegarden
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('emberDefeatureify', 'Experimental. Remove specially flagged feature blocks and debug statements from Ember source using defeatureify.', function() {
    var options,
        config,
        content,
        sourceFile,
        destFile,
        defeatureify;

    options = this.options();
    
    defeatureify = require('defeatureify');

    sourceFile = this.files[0].src[0];
    destFile = this.files[0].dest;

    if (!options.features) {
      options.features = {};
    }

    config = {
      enabled: options.features,
      namespace: options.namespace,
      debugStatements: options.debugStatements,
      enableStripDebug: options.enableStripDebug
    };

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      f.src.forEach(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return;
        }
        var contents = grunt.file.read(filepath),
            replacement = defeatureify(contents, config),
            changed = (contents !== replacement);
        if (f.dest) {
          grunt.file.write(f.dest, replacement);
          if (changed) { 
            grunt.log.writeln("Defeatureified code from " + filepath + 
              " and saved to " + f.dest);
          }
        } else if (changed) {
          grunt.file.write(filepath, replacement);
          grunt.log.writeln("Defeatureified code from " + filepath);
        }
      });
    });
  });

};
