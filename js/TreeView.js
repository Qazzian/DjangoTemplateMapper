var TreeView = function(tree){
	this.tree = tree;
	this.rootEl = $('#mapContainer');
	this.domNodes = {};
	
	this.helper = $('#mustacheHelper');
	this.pageTemplate = $('#PageTemplate');
}

TreeView.prototype = {
	init: function(){
		this.showRootNodes(this.tree.RootNodes);
	},

	bindEvents: function(){
		var self = this;
		$(document).delegate('.pageName', 'click', {self: self}, self.showNode);
		// TODO finish this
	},

	showRootNodes: function(){
		var RootNodes = this.tree.RootNodes;
		for (var i=0, l=RootNodes.length; i<l; i++) {
			this.addNode(RootNodes[i], this.rootEl);
		}
	},

	addNode: function(node, parent) {
		if (!node.domObj) {
			node.domObj = this.pageTemplate.mustache(node);
		}

		parent.append(node.domObj);
	},

	showNode: function(data) {
		console.log("Show node: ", data);
	},

	onPageClick: function() {

	},

	onSectionClick: function() {

	}

}