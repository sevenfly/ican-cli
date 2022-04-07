#! /usr/bin/env node

const pkg = require('./package.json')
const command = process.argv[2]
var fs = require('fs');
var path = require('path');
const program = require('commander');
var inquirer = require('inquirer')
var shell = require('shelljs')
var copyFile = require('./js/copy.js')
var targetName = '';
const initAction = () => {
	inquirer.prompt([{
		type: 'input',
		message: '请输入项目名',
		name: 'name'

	}]).then(answers => {
		console.log(process.execPath,"当前执行程序的路径")
		console.log(process.cwd(),"当前执行的node路径")
		console.log('项目名：' + answers.name, '正在拷贝项目',process.cwd()+'/'+answers.name)
		targetName = answers.name;
		copyFile(`${__dirname}/tpl/src`,process.cwd()+'/'+targetName)
		creatJs(targetName)
	})
}

//install 
const install = () => {
	console.log('install...')
	shell.cd(__dirname+'/tpl');
	shell.exec('npm install');
}


//serve
const devServe = () => {
	shell.cd(__dirname+'/tpl');
	shell.exec("npm run dev")
	console.log('open server')
}

//build
const build = () => {
	let _file = process.cwd();
	shell.cd(__dirname+'/tpl');
	shell.exec('npm run build');
	console.log(`${__dirname}/tpl/dist`,`${_file}/output`,'start build...',)
	copyFile(`${__dirname}/tpl/dist`,`${_file}/output`)
}
//创建main.js
const creatJs = (targetName) => {
	const writeFileRecursive = function(path, data, callback){
	    let lastPath = path.substring(0, path.lastIndexOf("/"));
	    fs.mkdir(lastPath, {recursive: true}, (err) => {
	        if (err) return callback(err);
	        fs.writeFile(path, data, function(err){
	            if (err) return callback(err);
	            return callback(null);
	        });
	    });
	}
	
	console.log("targetName:",targetName)
	//main.js的内容，引入组件
	let _data = 'import widget from "' + process.cwd() + '/' + targetName + '/widget.vue";';
	_data += 'exportWidget(widget);'
	
	writeFileRecursive(`${__dirname}/tpl/main.js`, _data, (err)=>{
	    if(err) console.error(err);
	    console.info("write success");
	});
}


program.command('init').description('init project').action(initAction)
program.command('install').description('open install').action(install)
program.command('dev').description('open server').action(devServe)
program.command('build').description('open build').action(build)



program.version(require('./package.json').version)
program.parse(process.argv)
