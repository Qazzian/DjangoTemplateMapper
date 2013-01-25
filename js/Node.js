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
			this.compiledBlocks = this.tree.getNode(this.parent).compileBlocks();
		}

		if (typeof this.compiledBlocks !== 'object') {
			this.compiledBlocks = {};
		}

		for (i=0, l=this.blocks; i<l; i++) {
			blockName = this.blocks[i];
			if (typeof this.compiledBlocks[blockName] === 'undefined') {
				this.compiledBlocks[blockName] = new CompiledBlock(blockName, this.page, this.page);
			}
		}
	}
};

/**
 * name: as defined by the templates
 * declaredBy: First template in the tree to declaire the block
 * definedBy: The template that finaly defines the content of the block
 */
var CompiledBlock = function(name, declaredBy, definedBy) {
	this.name = name;
	this.declaredBy = declaredBy;
	this.definedBy = definedBy;	
};