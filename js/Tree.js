var Tree = function() {
	this.AllNodes = {};
	this.RootNodes = [];
};

Tree.prototype = {
	init: function() {
		if (!window.map) {
			alert("Error! \nCannot load template map data from templateMap.js");
			return;
		}

		this.parseData(window.map);
	},

	hasNode: function(pageId){
		return !!this.AllNodes[pageId];
	},

	addNode: function(nodeId, data) {
		data = data || {page: nodeId};
		data.page = data.page || nodeId;
		this.AllNodes[nodeId] = new Node(data, this);
		return this.AllNodes[nodeId];
	},

	getNode: function(nodeId) {
		if (!this.AllNodes[nodeId]) {
			this.addNode(nodeId);
		}
		return this.AllNodes[nodeId];
	},

	parseData: function(map) {
		var node, pageId, parent;

		// First build the child parent relationships
		_.each(map, function(node, pageId){
			this.addNode(pageId, node);
		}, this);

		// get all the nodes to compile tree data about themselves.
		_.invoke(_.values(this.AllNodes), 'compile');

		// Now Nodes know about thier own context we can build tree level information
		_.each(this.AllNodes, function(node, pageId){
			if (typeof node.parent === 'undefined' && node.isInclude === false) {
					this.RootNodes.push(node);
				}
		}, this);

	}
};