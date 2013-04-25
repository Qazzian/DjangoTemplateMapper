/*global $, document*/

"use strict";

var TreeView = function(tree){
	this.tree = tree;
	this.rootEl = $('#mapContainer');
	this.domNodes = {};
	
	this.pageTemplate = $('#PageTemplate');
};

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
		
		$(document).delegate('.addNode', 'click', function(event){
			event.stopImmediatePropagation();
			event.preventDefault();
			self.handleAddNode(this, event);
		});
	},

	showRootNodes: function(){
		var i, l, RootNodes = this.tree.RootNodes;
		for (i=0, l=RootNodes.length; i<l; i++) {
			this.rootEl.append(this.createDomElmt(RootNodes[i]));
		}
	},

	/**
	 * Create a new Dom object for the given Node.
	 * Will save each domObj in a cache for later retrieval.
	 * Note that if the same node passed, a duplicate dom object will be created.
	 * This is becaue Included nodes can be in more than one page.
	 */
	createDomElmt: function(node) {
		var newDomElmt;

		if (!this.domNodes[node.page]) {
			this.domNodes[node.page] = [];
		}

		newDomElmt = this.pageTemplate.mustache(node);
		this.domNodes[node.page].push(newDomElmt);
		return newDomElmt;
	},

	showNode: function(event, data) {
		event.stopImmediatePropagation();
		event.preventDefault();

		var target = event.target,
			content = $(target.parentNode).children('ul');
		content.toggleClass('closed');
	},

	/**
	 * Add a sub page
	 */
	handleAddNode: function(target, event) {
		var pageId = target.dataset.pageId,
			parentNode = $(target.parentNode),
			node = this.tree.getNode(pageId),
			domObj = this.createDomElmt(node);

		parentNode.replaceWith(domObj);
	},

	/**
	 * Open the given node and all it's parents so that we can see the full branch.
	 * @assumptions - Root nodes are alway available to the page.
	 * 
	 */
	showNodesTo: function(pageId){
		// TODO finish me
		if (!this.tree.hasNode(pageId)) {
			console.warn("Could not find node " + pageId);
			return;
		}

		var i, l, branch = [this.tree.getNode(pageId)],
			newDom;
		
		while (branch[0].parent) {
			branch.unshift(branch[0].parent);
		}

		for (i=0,l=branch.length; i<l; i++) {
			if (this.domNodes[branch[i].page]) {
				this.open(branch[i].page);
			}
			else {
				newDom = this.createDomElmt(branch[i]);
				// TODO
			}
		}



	}

	open: function(pageId){
		console.log('TODO: ');
	}


}




















