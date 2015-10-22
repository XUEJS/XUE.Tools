#!/usr/bin/env node
// vi foo/bin/foo.js
var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var cli = new Liftoff({
  name: 'xue', // 命令名字
  processTitle: 'xue',
  moduleName: 'xue',
  configName: 'xue-conf',

  // only js supported!
  extensions: {
    '.js': null
  }
});

cli.launch({
  cwd: argv.r || argv.root,
  configPath: argv.f || argv.file
}, function(env) {
  var xue;
  if (!env.modulePath) {
    xue = require('../');
  } else {
    xue = require(env.modulePath);
  }
  xue.set('system.localNPMFolder', path.join(env.cwd, 'node_modules/xue'));
  xue.set('system.globalNPMFolder', path.dirname(__dirname));
  xue.cli.run(argv, env);
});
