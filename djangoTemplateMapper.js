#! /usr/bin/env node

// grep -r 'extends\|include\|block' ./ > djangoTemplateMap.js > templateMap.js

var stdin = process.stdin,
	stdout = process.stdout;

var nodeList = {};
var Node = function(page){
	this.page = page;
	this.parent;
	this.includes = [];
	this.blocks = [];
};



process.stdin.on('data', processDataBlock);
process.stdin.on('end', printJson);
process.stdin.setEncoding('utf8');
process.stdin.resume();



function processDataBlock(data) {
	var lines = data.split('\n'),
		i, l;

	for (i=0, l=lines.length; i<l; i++) {
		processLine(lines[i]);
	}
}

function processLine(line){
	// console.log("Processs data: ", line);

	var filename, djangoStatement, statementVar,
		startpos = 0, endPos = -1,
		node;

	endPos = line.indexOf(':');
	filename = line.slice(startpos, endPos);
	filename = filename.replace(/^.\//, '');

	if (!filename) { return };
	if (!nodeList[filename]) {
		node = nodeList[filename] = new Node(filename);
	}
	else {
		node = nodeList[filename];
	}



	djangoStatement = line.match(/\{% (.*) %\}/);
	if (!djangoStatement || djangoStatement.length < 2) { return; }
	djangoStatement = djangoStatement[1];
	var statementArgs = djangoStatement.split(/\s/);
	djangoStatement = statementArgs[0];
	statementVar = statementArgs.length > 1 ? statementArgs[1] : '';

	//console.info("statementArgs:", statementArgs);

	switch (djangoStatement) {
		case 'extends':
			statementVar = statementVar.replace(/['"]/g, '');
			
			node.parent = statementVar;
			break;
		case 'include':
			statementVar = statementVar.replace(/['"]/g, '');
			node.includes.push(statementVar);
			break;
		case 'block':
			node.blocks.push(statementVar);
			break;
		default:
			break;
	}



	// console.log('filename:', filename, ', statment:', djangoStatement, ', var: ', statementVar);
}

function printJson(){
	process.stdout.write('map = ' + JSON.stringify(nodeList));
}


