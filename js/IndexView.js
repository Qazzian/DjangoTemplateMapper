var IndexView = function(tree){
	this.tree = tree;
	this.allNodes = [];

	this.container = $('#indexContainer');
	this.title = this.container.find('h3');
	this.rootEl = this.container.find('ul');
	this.template = $('#indexTemplate');
}

IndexView.prototype = {
	init: function() {
		var self = this;

		this.title.on('click', this.toggleOpen);
		this.container.addClass('closed');
		this.container.delegate('a.indexLink', 'click', function(event){
			self.onPageClick(event);
		});

		this.update();
		this.render();
	},

	update: function(){
		
		_.each(this.tree.AllNodes, function(block, name){
			this.allNodes.push(block);
		}, this);

		this.allNodes.sort(function(a, b){
			b.page.localeCompare(a.page);
		});
	},

	render: function(){
		// TODO 
		_.each(this.allNodes, function(node, index){
			this.rootEl.append(this.template.mustache(node))
		}, this);
		

	},

	toggleOpen: function(){
		$(this).closest('#indexContainer').toggleClass('closed')
	},

	onPageClick: function(event){
		var pageId = event.target.dataset.pageId;
		event.preventDefault();
		event.stopImmediatePropagation();

		if (pageId) {
			treeView.showNodesTo(pageId);
		}


	}
}