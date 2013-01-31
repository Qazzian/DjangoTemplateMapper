var Node = function(data, tree) {
	this.tree = tree;
	this.isInclude = false; // if true don't include in the root nodes
	this.isRoot = false;
	this.level = 0;

	this.page = data.page;
	this.parent = undefined; // Node or NodeId, can't decide
	this.children = []; // Array[Node]
	this.includes = []; // Array[Node]
	this.blocks = [];

	this.compiled = false;
	this.compiledBlocks = {}; // blockName: new CompiledBlock()
	this.compiledBlocksList = []; // Only required for the mustache templates
	this.empty = false;

	_.extend(this, data);

};
Node.prototype = {
	addChild: function(node) {
		if (!this.children) {
			this.children = [];
		}
		this.children.push(node);
	},

	compile: function() {
		if (this.parent) {
			this.tree.getNode(this.parent).addChild(this);
		}
		this.parseIncludes();
		this.compileBlocks();

		if (this.children.length == 0 && this.blocks.length == 0 && this.includes.length == 0) {
			this.empty = true;
		}
	},

	parseIncludes: function() {
		var i = 0,
			l = this.includes.length,
			nodeId;
		
		for (null; i<l; i++) {
			nodeId = this.includes[i];
			this.tree.getNode(nodeId).isInclude = true;
			this.includes[i] = this.tree.getNode(nodeId);
		}

	},

	
	/**
	 * Recurse the template tree to build up a picture of all the blocks this page 
	 * will include
	 */
	compileBlocks: function() {
		var i, l, blockName;
		
		if (this.compiled) {
			return this.compiledBlocks;
		}

		if (this.parent !== undefined) {
			this.compiledBlocks = this.tree.getNode(this.parent).cloneBlocks();
			_.each(this.compiledBlocks, function(block, name){
				block.definedBySelf = false;
			});
		}

		if (typeof this.compiledBlocks !== 'object') {
			this.compiledBlocks = {};
		}



		for (i=0, l=this.blocks.length; i<l; i++) {
			blockName = this.blocks[i];
			if (typeof this.compiledBlocks[blockName] === 'undefined') {
				this.compiledBlocks[blockName] = new CompiledBlock(blockName, this.page, this.page);
			}
			else {
				this.compiledBlocks[blockName].definedBy = this.page;
				this.compiledBlocks[blockName].definedBySelf = true;
			}
		}

		_.each(this.compiledBlocks, function(block, key){
			this.compiledBlocksList.push(block);
		}, this);
		
		this.compiledBlocksList.sort(function(a,b){
			// TODO
			return a.name.localeCompare(b.name);
		});

		this.compiled = true;
		return this.compiledBlocks;
	},

	cloneBlocks: function(){
		var clone = {};

		this.compileBlocks();

		_.each(this.compiledBlocks, function(block, name){
			clone[name] = block.clone();
		}, this);

		return clone;
	}
};

/**
 * name: as defined by the templates
 * declaredBy: First template in the tree to declaire the block
 * definedBy: The template that finaly defines the content of the block
 * definedBySelf: true if the 
 */
var CompiledBlock = function(name, declaredBy, definedBy) {
	this.name = name;
	this.declaredBy = declaredBy;
	this.definedBy = definedBy;	
	this.definedBySelf = true;
};

CompiledBlock.prototype = {
	clone: function(){
		return _.clone(this);
	}
}


























