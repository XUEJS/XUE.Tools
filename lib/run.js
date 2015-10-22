/**
 * run
 * @authors Your Name (you@example.org)
 * @date    2015-10-21 19:22:21
 * @version $Id$
 */
var path = require('path');


/**
 * fis命令行执行入口。
 * @param  {Array} argv 由 {@link https://github.com/substack/minimist minimist} 解析得到的 argv, 已经转换成了对象。
 * @param  {Array} env  liftoff env
 * @name run
 * @memberOf fis.cli
 * @function
 */
module.exports = function(argv, env) {
  // [node, realPath(bin/fis.js)]
  var argvRaw = process.argv;

  process.title = fis.cli.name +' ' + process.argv.slice(2).join(' ') + ' [ ' + env.cwd + ' ]';

  if (argv.verbose) {
    fis.log.level = fis.log.L_ALL;
  }

  fis.set('options', argv);
  fis.project.setProjectRoot(env.cwd);

   // 如果指定了 media 值
  if (['release', 'inspect'].indexOf(argv._[0]) > -1 && argv._[1]) {
    fis.project.currentMedia(argv._[1]);
  }

  env.configPath = env.configPath || argv.f || argv.file;

  if (env.configPath) {
    try {
      require(env.configPath);
    } catch (e) {
      fis.log.error('Load %s error: %s \n %s', env.configPath, e.message, e.stack);
    }

    fis.emit('conf:loaded');
  }

  if (fis.media().get('options.color') === false) {
    fis.cli.colors.mode = 'none';
  }

  var location = env.modulePath ? path.dirname(env.modulePath) : path.join(__dirname, '../');
  // fis.log.info('Currently running %s (%s)', fis.cli.name, location);
  // fis.log.info('... o(-"-)o ^*(- -)*^ └(^o^)┘ ( ^_^ ) ::>_<:: 一 一+ (^。^)y-~~ ...');
  /**
   * 输出时添加自定义表情
   * @type {Array}
   */
  var emoji = [
    '...',
    '^*(- -)*^',
    '(^。^)y-~~',
    '(─.─|||',
    'o(︶︿︶)o',
    '<(￣▽￣)>',
    'o(∩_∩)o',
    '(┬＿┬)',
    '●rz',
    '(*^__^*)',
    'o(-"-)o'
  ];
  fis.log.info(emoji[Math.ceil(Math.random()*10)]);


  if (!argv._.length) {
    fis.cli[argv.v || argv.version ? 'version' : 'help']();
  } else {

    // tip
    // if (argvRaw[2] === 'release' && !env.modulePath) {
    //   fis.log.warning('Local `fis3` not found, use global version instead.');
    // }

    //fix args
    var p = argvRaw.indexOf('--no-color');
    ~p && argvRaw.splice(p, 1);

    p = argvRaw.indexOf('--media');
    ~p && argvRaw.splice(p, argvRaw[p + 1][0] === '-' ? 1 : 2);

    //register command
    var commander = fis.cli.commander = require('commander');
    var cmd = fis.require('command', argvRaw[2]);

    if (cmd.register) {
      // 兼容旧插件。
      cmd.register(
        commander
        .command(cmd.name || first)
        .usage(cmd.usage)
        .description(cmd.desc)
      );
      commander.parse(argvRaw);
    } else {
      cmd.run(argv, fis.cli, env);
    }
  }
};
