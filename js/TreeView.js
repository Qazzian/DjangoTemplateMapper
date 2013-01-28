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
		this.bindEvents();
	},

	bindEvents: function(){
		var self = this;
		$(document).delegate('.showNHide', 'click', function(event){
			event.stopImmediatePropagation();
			event.preventDefault();
			$(this).parent().toggleClass('closed');
		});
		// TODO finish this
		$(document).delegate('.addNode', 'click', function(event){
			event.stopImmediatePropagation();
			event.preventDefault();
			self.handleAddNode(this, event);
		});
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

	showNode: function(event, data) {
		console.log("Show node: ", event, this);
		event.stopImmediatePropagation();
		event.preventDefault();

		var target = event.target;
		var content = $(target.parentNode).children('ul');
		content.toggleClass('closed');
	},

	handleAddNode: function(target, event) {
		var pageId = target.dataset.pageId,
			parentNode = target.parentNode,
			node = this.tree.getNode(pageId);

			//TODO get html 
			this.addNode(node, $(parentNode));


	},

	onPageClick: function() {

	},

	onSectionClick: function() {

	}

}