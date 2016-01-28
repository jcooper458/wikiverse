export const wikiverse = {

	sigmaSettings: {
	    doubleClickEnabled: false,
	    minEdgeSize: 1,
	    maxEdgeSize: 3,
	    minNodeSize: 5,
	    maxNodeSize: 15,
	    enableEdgeHovering: true,
	    edgeHoverColor: 'edge',
	    defaultEdgeHoverColor: '#000',
	    labelThreshold: 15,
	    edgeHoverSizeRatio: 1,
	    edgeHoverExtremities: true,
	    mouseWheelEnabled: false,
	    labelSize: "proportional",
	    labelColor: "node",
	    labelHoverShadow: "node",
	    labelHoverColor: "node"
	},
	sigmaRenderer: {
	    container: document.getElementById('mindmap'),
	    type: 'canvas'
	},
	//set default settings for the searches
	searchLang: "en",
	instagramSearchType: "hashtag",
	flickrSearchType: "textQuery",
	flickrSortType: "relevance",
	youtubeSortType:"relevance",
	twitterSearchType: "popular",

};