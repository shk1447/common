'use strict';

process.env.NODE_ENV = 'production';
const cmd = require('commander');
const path = require('path');
cmd.option('-P, --project [project]', 'set project path', 'default')
   .option('-g, --mode [mode]', 'set mode', 'development')
   .option('-g, --watch [watch]', 'set watch', 'true')
   .parse(process.argv);

process.env.project = cmd.project;
process.env.mode = cmd.mode;
process.env.watch = cmd.watch;

const ora = require('ora');
const chalk = require('chalk');
const webpack = require('webpack');
const rm = require('rimraf');

const webpackConfig = require('./webpack.config');

const spinner = ora('building for production...');
spinner.start();

var project_path = path.resolve(__dirname,'../../project/' + process.env.project);
var root_path = path.resolve(project_path, './_build');
rm(root_path, err => {
  if(err) throw err;
  webpack(webpackConfig, (err, stats) => {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n');
  
    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1)
    }
  
    console.log(chalk.cyan('  Build complete.\n'));
  })  
})