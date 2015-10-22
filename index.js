//vi foo/index.js
var xue = module.exports =  require('fis3');
xue.require.prefixes.unshift('xue');
xue.cli.name = 'xue';
xue.cli.info = require('./package.json');
xue.cli.version = require('./lib/ver.js');
xue.cli.run = require('./lib/run.js');
xue.set('modules.commands', ['install', 'release', 'server', 'inspect']);

xue.match('*', {
  release: '/static/$0' // 所有资源发布时产出到 /static 目录下
});

xue.match('*.php', {
  release: '/template/$0' // 所有 PHP 模板产出后放到 /template 目录下
});

// 所有js, css 加 hash
xue.match('*.{js,css,less,scss,sass}', {
  useHash: true
});

// 所有图片加 hash
xue.match('image', {
  useHash: true
});

// fis-parser-less
xue.match('*.{scss,sass}', {
  parser: xue.plugin('sass'),
  rExt: '.css'
});

xue.match('*.js', {
  optimizer: xue.plugin('uglify-js')
});

xue.match('*.{css,less,sass,scss}', {
  optimizer: xue.plugin('clean-css')
});

xue.match('*.png', {
  optimizer: xue.plugin('png-compressor')
});

xue.match('widget/*.{php,js,css}', {
  isMod: true
});

xue.match('::package', {
  spriter: xue.plugin('csssprites')
});

//fis3-hook-module
xue.hook('module', {
  mode: 'amd' // 模块化支持 amd 规范，适应 require.js
});
