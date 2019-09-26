/*
Copyright 2017-Present The Kunta Protocol Authors
This file is part of the Kunta Protocol library.
The Kunta Protocol is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
The Kunta Protocol is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License
along with the Kunta Protocol library. If not, see <http://www.gnu.org/licenses/>.
*/
	var account_hash = "<ACCOUNT HASH>"
  	var BC_URL = ""
	loadLocalBC()
  	const BC_LOAD_STATES = {
  		NOT_LOADED: 0,
  		LOADED: 1
  	}

  	changeBCLoadStatus(BC_LOAD_STATES.NOT_LOADED)
  	getAllAccountBlockchains()

  	function loadBC(bid){
  		console.log("Loading BC: "+bid)
  		var blockchainDetails = getBlockchainInfoByID(bid)
  		getDeploymentByBID(bid)
  	}

  	function updateSummary(){

  	}

  	function changeBCLoadStatus(BCLstatus){
  		console.log(BCLstatus)
  		$("#BCLoadStatus").html("...")
  		$("#BCLoadStatus").removeClass("badge-warning")
  		$("#BCLoadStatus").removeClass("badge-success")
  		switch(BCLstatus){
  			case BC_LOAD_STATES.NOT_LOADED:
  				$("#BCLoadStatus").addClass("badge-warning")
  				$("#BCLoadStatus").html("Not Loaded")
  				break
  			case BC_LOAD_STATES.LOADED:
  				$("#BCLoadStatus").addClass("badge-success")
  				$("#BCLoadStatus").html("Loaded")
  				break
  		}
  	}

  	function addBlockchain(){
  		console.log(account_hash)
  		var BCC_OBJECT = $("#BCC_COPY").val();
  		console.log(  "BCC_OBJECT: "+BCC_OBJECT )
  		console.log(  "BASE64: "+B64encode(JSON.stringify( BCC_OBJECT ))  )
  		$.ajax({
		    url: 'http://kunta.io/api/?E=CreateBlockchain',
		    headers: {},
		    type: "GET",
		    dataType: "json",
		    data: {
		    	"ah": account_hash,
		    	"bcc": B64encode(JSON.stringify( BCC_OBJECT ))
		    },
		    success: function (result) {
		        console.log(result);    
		        if(result.status == 1){
		        	var bID = result.bid
			        console.log(bID);   
			        $("#BlockchainID").html(bID)
			        getAllAccountBlockchains()
		        }else{
		        	console.log("No blockchain created")
		        }
		    },
		    error: function () {
		        console.error("error");
		    }
		});
  	}

  	function getBlockchainInfoByID(bid){
  		$.ajax({
		    url: 'http://kunta.io/api/?E=GetBlockchainInfoByID',
		    headers: {},
		    type: "GET",
		    dataType: "json",
		    data: {
		    	"bid": bid
		    },
		    success: function (result) {
		        changeBCLoadStatus(BC_LOAD_STATES.LOADED)
		        var bID = result.result.identifier
		        $("#BlockchainID").html(bID)
		        return result
		    },
		    error: function () {
		        console.error("error");
		    }
		});
  	}

  	function getAllAccountBlockchains(){
  		$.ajax({
		    url: 'http://kunta.io/api/?E=GetAllAccountBlockchains',
		    headers: {},
		    type: "GET",
		    dataType: "json",
		    data: {
		    	"aid": '1'
		    },
		    success: function (result) {
		        console.log(result);    
		        var blockchains = result.blockchains
		        if(blockchains.length > 0){
		        	$(".bcrow").remove()
		        	for(var bc = 0; bc < blockchains.length; bc++){
		        		var blockchainInstance = blockchains[bc]
		        		console.log(bc)
		        		console.log(blockchainInstance)
		        		console.log(blockchainInstance.date_created)
		        		console.log(blockchainInstance.configuration)
		        		$("#bcTableParent").append('<tr class="bcrow">'+
											      '<th scope="row">'+blockchainInstance.blockchain_id+'</th>'+
											      '<td><button id="'+blockchainInstance.identifier+'" type="button" class="btn btn-warning btn-sm">View Configuration</button></td>'+
											      '<td>'+blockchainInstance.date_created+'</td>'+
											      '<td><b>'+blockchainInstance.identifier+'</b></td>'+
											      '<td><div class="btn-group" role="group" aria-label="Button group with nested dropdown">'+
					    '<button type="button" class="btn btn-success btn-sm" onclick="loadBC('+blockchainInstance.blockchain_id+')">Load</button>'+
					    '<button type="button" class="btn btn-info btn-sm">Analyze</button>'+
					    '<div class="btn-group" role="group">'+
					    '  <button id="btnGroupDrop1" type="button" class="btn btn-danger btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Manage</button>'+
					    '  <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">'+
					    '    <a class="dropdown-item" href="javascript: return false;"  onclick="createDeployment('+blockchainInstance.blockchain_id+')">Deploy</a>'+
					    '    <a class="dropdown-item" href="#">Stop</a>'+
					    '  </div>'+
					    '</div>'+
					    '</div></td>'+
					    '</tr>')
			        	$('#'+blockchainInstance.identifier).popover({
			        		animation: true,
			        		title: "Configuraton for "+blockchainInstance.identifier, 
			        		content: '<pre class="preBC">'+atob(blockchainInstance.configuration)+'</pre>', 
			        		placement: "left",
			        		trigger:"click",
			        		html: true
			        	})
		        	}
		        }else{
		        	console.error("Account has no blockchains")
		        }
		    },
		    error: function () {
		        console.error("error");
		    }
		});
  	}

  	function getBlocks(){
  		$.ajax({
		    url: BC_URL+'/getBlocks',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    type: "POST", 
		    dataType: "json",
		    data: '{"data" : "I NEED SOMETHING"}',
		    success: function (result) {
				var block_height = result[result.length - 1].header.blockIndex;
				$("#block_height").html(block_height)
				var block_hash = result[result.length - 1].header.hash;
				$("#block_hash").html(block_hash)
				var state_hash = result[result.length - 1].body.data.STATE_HASH;
				$("#state_hash").html(state_hash)
		        fillContentBox(JSON.stringify(result, undefined, 2),"#contentBoxBlock")
				drawNetworkGraph(result)
				verifyChain()
		    },
		    error: function () {
		        console.error("error");
		    }
		});
  	}

  	function verifyChain(){
  		$.ajax({
		    url: BC_URL+'/verifyChain',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    type: "POST", 
		    dataType: "json",
		    data: '{"data" : "I NEED SOMETHING"}',
		    success: function (result) {
		    	var verified = result.verified
		        console.log(verified,"#contentBoxBlock"); 
		        if(verified == true){
		        	$("#verify_chain").html('<button type="button" class="btn btn-success">Valid <span class="badge badge-light">4</span></button>')
		        }else{
		        	$("#verify_chain").html('<button type="button" class="btn btn-danger">Invalid <span class="badge badge-light">4</span></button>')
		        } 
		    },
		    error: function () {
		        console.error("error");
		    }
		});
  	}

  	function getCurrentBlock(){
  		$.ajax({
		    url: BC_URL+'/getBlocks',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    type: "POST", 
		    dataType: "json",
		    data: '{"data" : "I NEED SOMETHING"}',
		    success: function (result) {
		        console.log(JSON.stringify(result[result.length-1]),"#contentBoxBlock"); 
		        fillContentBox(JSON.stringify(result[result.length-1], undefined, 2),"#contentBoxBlock") 
		    },
		    error: function () {
		        console.error("error");
		    }
		});
  	}

  	function addTransaction_female(){
  		console.log("addTransaction female")
  		var female_type = $("#female_type").val()
  		var female_class = $("#female_class").val()
  		var female_script = $("#female_script").val()
  		var female_source = $("#female_source").val()
  		var female_message = $("#female_message").val()
  		if(female_type == "" || female_class == "" || female_script == "" || female_message == ""){
  			console.log("ERROR BLANK FEMALE")
  			console.log("female_type: "+female_type)
  			console.log("female_class: "+male_class)
  			console.log("female_script: "+female_script)
  			console.log("female_source: "+female_source)
  			console.log("female_message: "+female_message)
  			return false
  		}else{
  			console.log("complete female")
  			console.log("female_type: "+female_type)
  			console.log("female_class: "+male_class)
  			console.log("female_script: "+female_script)
  			console.log("female_source: "+female_source)
  			console.log("female_message: "+female_message)
  		}

		var addtransaction_account_voting_female = '{"type" : "'+female_type+'", "class" : "'+female_class+'", "destination": "", "source": "'+female_source+'", "script" : "'+female_script+'", "message": "'+female_message+'"}'

		var addtransaction_account_verdict_female = '{"type" : "verdict", "class" : "female", "destination": "", "source": "USER2", "script" : "votes OP_ATLEAST_ZERO OP_VERIFY", "message": "MESSAGETEST"}'

		var txList = [
					  addtransaction_account_voting_female,
					  ]

		for(var i = 0; i < txList.length; i++){
			var rootInstanceData = txList[i]
	  		$.ajax({
			    url: BC_URL+'/addTransaction',
			    headers: {
			        'Content-Type': 'application/json',
			    },
			    type: "POST", 
			    dataType: "json",
			    data: rootInstanceData,
			    success: function (result) {
			        console.log(result); 
			        fillContentBox(JSON.stringify(result, undefined, 2),"#contentBoxTransaction")   
			    },
			    error: function () {
			        console.error("error");
			    }
			});
	  	}
  	}

  	function addTransaction_male(){
  		console.log("addTransaction male")
  		var male_type = $("#male_type").val()
  		var male_class = $("#male_class").val()
  		var male_destination = $("#male_destination").val()
  		var male_source = $("#male_source").val()
  		var male_script = $("#male_script").val()
  		var male_partner = $("#male_partner").val()
  		var male_message = $("#male_message").val()
  		if(male_type == "" || male_class == "" || male_script == "" || male_partner == "" || male_message == "" ){
  			console.log("ERROR BLANK MALE")
  			console.log("male_type: "+male_type)
  			console.log("male_class: "+male_class)
  			console.log("male_script: "+male_script)
  			console.log("male_partner: "+male_partner)
  			console.log("male_message: "+male_message)
  			return false
  		}else{
  			console.log("MALE COMPLETE")
  			console.log("male_type: "+male_type)
  			console.log("male_class: "+male_class)
  			console.log("male_script: "+male_script)
  			console.log("male_partner: "+male_partner)
  			console.log("male_message: "+male_message)
  		}

		var addtransaction_account_voting_male = '{"type" : "'+male_type+'", "class" : "'+male_class+'", "destination": "'+male_destination+'", "source": "'+male_source+'", "script" : "'+male_script+'", "partner": "'+male_partner+'", "message": "'+male_message+'"}'
		var addtransaction_account_verdict_male = '{"type" : "verdict", "class" : "male", "script" : "vote", "partner": "8c35aea06b89c5d227b6152b7c06b3fb2e0758e1410080309be8986420dba739", "message": "MESSAGETEST"}'

		var txList = [
					  addtransaction_account_voting_male, 
					  ]

		for(var i = 0; i < txList.length; i++){
			var rootInstanceData = txList[i]
	  		$.ajax({
			    url: BC_URL+'/addTransaction',
			    headers: {
			        'Content-Type': 'application/json',
			    },
			    type: "POST",
			    dataType: "json",
			    data: rootInstanceData,
			    success: function (result) {
			        console.log(result); 
			        fillContentBox(JSON.stringify(result, undefined, 2),"#contentBoxTransaction")   
			    },
			    error: function () {
			        console.error("error");
			    }
			});
	  	}
  	}

  	function getUnprocessedRootInstances(){
  		$.ajax({
		    url: BC_URL+'/getUnprocessedTransactions',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    type: "POST",
		    dataType: "json",
		    data: '',
		    success: function (result) {
		        console.log(result); 
		        fillContentBox(JSON.stringify(result, undefined, 2),"#contentBoxTransaction")   
		    },
		    error: function () {
		        console.error("error");
		    }
		});
  	}

  	function addPeer(){
  		var peerToAdd = $("#peerToAdd").val()
  		console.log("adding peer: "+peerToAdd)
  		$.ajax({
		    url: BC_URL+'/addPeer',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    type: "POST",
		    dataType: "json",
		    data: '{"newPeer" : "'+peerToAdd+'"}',
		    success: function (result) {
		        console.log(result); 
		        fillContentBox(JSON.stringify(result, undefined, 2),"#contentBoxPeer")   
		    },
		    error: function () {
		        console.error("error");
		    }
		});
  	}

  	function findRootInstance(){
  		var rootInstanceToFind = $("#findRootInstance").val()
  		console.log("finding root instance: "+rootInstanceToFind)
  		$.ajax({
		    url: BC_URL+'/findRootInstance',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    type: "POST", 
		    dataType: "json",
		    data: '{"hash" : "'+rootInstanceToFind+'"}',
		    success: function (result) {
		        console.log(result); 
		        fillContentBox(JSON.stringify(result, undefined, 2),"#contentBoxTransaction") 
		    },
		    error: function () {
		        console.error("findRootInstance error");
		    }
		});
  	}

  	function getPeers(){
  		$.ajax({
		    url: BC_URL+'/peers',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    type: "POST", 
		    dataType: "json",
		    data: '{"data" : "TELL ME ALL OF THE PEERS YOU KNOW"}',
		    success: function (result) {
		        console.log(result); 
		        fillContentBox(JSON.stringify(result, undefined, 2),"#contentBoxPeer")   
		    },
		    error: function () {
		        console.error("error");
		    }
		});
  	}

  	var currentChainHash = null

  	function GetChainHash(){
  		$.ajax({
		    url: BC_URL+'/GetChainHash',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    type: "POST", 
		    dataType: "json",
		    data: '',
		    success: function (result) {
		    	if(currentChainHash != result.hash){
		    		currentChainHash = result.hash
		    		getBlocks()
		    	}else{
		    		//console.log(result); 
		    	}
		    },
		    error: function (e) {
		        //console.error(e);
		    }
		});
  	}

  	function searchBlockchain(){
  		$("#chainSearchQuery").val()
    	var allRootInstances = []
        currentChain.forEach(block => {
        	if(block.body.rootInstances.length > 0){
        		block.body.rootInstances.forEach(rootInstance => {
        			allRootInstances.push(rootInstance)
        		})
        	}
        })

        var found = allRootInstances.find(function(ri){
			return ri.hash == condition
		});

		if(found == undefined){
			found = currentChain.find(function(block){
				return block.header.hash == hash
			});
			if(found != undefined){
				//$("#details_label").html("Block ")
			}
		}else{
			//$("#details_label").html("Root Instance ")
		}
		fillContentBox(JSON.stringify(found, undefined, 2),"#contentBoxBlock")
    }


  	function getDeploymentByBID(bid){
  		$.ajax({
		    url: 'http://kunta.io/api/?E=GetDeploymentsByBlockchainID',
		    headers: {},
		    type: "GET", 
		    dataType: "json",
		    data: {
		    	"bid": bid
		    },
		    success: function (result) {
		        console.log(result)  
		        console.log(result.dh)
  				getDeploymentStatus(result.dh)
		    },
		    error: function () {
		        console.error("error");
		    }
		});
  	}

  	function getDeploymentStatus(dh){
  		$.ajax({
		    url: 'http://kunta.io/api/?E=GetDeploymentStatus',
		    headers: {},
		    type: "GET", 
		    dataType: "json",
		    data: {
		    	"dh": dh
		    },
		    success: function (result) {
		        console.log(result) 
		        receivedDeployment(result)
		    },
		    error: function () {
		        console.error("error");
		    }
		});
  	}

  	function receivedDeployment(deployment){
  		console.log(deployment)
  		BC_URL = "http://"+deployment.servicesCreated.status.loadBalancer.ingress[0].hostname+":3001"
  	}

  	function loadLocalBC(){
  		console.log("loading local BC")
  		var tracked_ip = $("#node_ip").val();
  		BC_URL = "http://" + tracked_ip + ":3001";

  	}

  	function createDeployment(bid){
  		console.log("creating deployment for bid: "+bid)
  		$.ajax({
		    url: 'http://kunta.io/api/?E=CreateDeployment',
		    headers: {},
		    type: "GET", 
		    dataType: "json",
		    data: {
		    	"bid": bid
		    },
		    success: function (result) {
		    	console.log("result from deployment")
		        console.log(result);    
		    },
		    error: function () {
		        console.error("error");
		    }
		});
  	}

  	function removeDeployment(dh){
  		console.log("removing deployment for dh: "+dh)
  		$.ajax({
		    url: 'http://kunta.io/api/?E=RemoveDeployment',
		    headers: {},
		    type: "GET",
		    dataType: "json",
		    data: {
		    	"dh": dh
		    },
		    success: function (result) {
		        console.log(result);    
		    },
		    error: function () {
		        console.error("error");
		    }
		});
  	}

  	function fillContentBox(content, contentBox){
  		$(contentBox).html(content)
  	}

    function initDrawNetworkGraph(){

	    var nodeHolder = []
	    var edgeHolder = []

	    getBlocksNG((function(CHAIN){
	    	if( !CHAIN || CHAIN == undefined){
	    		throw new Error("getBlocksNG ERROR")
	    	}else{
	    		drawNetworkGraph(CHAIN)
	    	}
	    }))
	}

  	function getBlocksNG(callback = null){
  		console.log("url: "+BC_URL)
  		$.ajax({
		    url: BC_URL+'/getBlocks',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    type: "POST", 
		    dataType: "json",
		    data: '{"data" : "I NEED SOMETHING"}',
		    success: function (result) {
				if (callback != null) { callback(result) }
		    },
		    error: function () {
		        console.log("error getBlocksNG");
		    }
		});
  	}

  	var currentChain = null
  	var nodes = new vis.DataSet()
    var edges = new vis.DataSet()
    var network = null
    var options = {
    	height: '100%',
		width: '100%',
		edges: {
	    //inheritColors: false
	  },
	  nodes: {
	    fixed: false,
	    //parseColor: false
	  },
	  interaction:{
	  	//hover:false,
	  	//click:true,
	  	tooltipDelay: 2000,
	  },
	  manipulation: {
		enabled: false
	  } 
    };

    function updateNode(node) {
        try {
            nodes.add(node);
        }
        catch (err) {
            //console.log(err);
            nodes.update(node);
        }
    }

    function updateEdge(edge) {
        try {
            edges.add(edge);
        }
        catch (err) {
            //console.log(err);
            edges.update(edge);
        }
    }

	function drawNetworkGraph(CHAIN){
	    currentChain = CHAIN
	    var male_color = "blue" //"#ADD8E6"
	    var female_color = "red" //"#FF69B4"
	    var block_color = "green"
	    var genesis_block_color = "#000000"
	    var interim_block_color = "orange"

    	var nodeHolder = []
		var edgeHolder = []
		nodes.clear();
		edges.clear();

    	var default_draw_limit = 100
    	var vis_window_threshold = ($("#draw_limit").val() == "") ? default_draw_limit : $("#draw_limit").val()
    	var vis_window = 3
    	var draw_limit = (CHAIN.length > vis_window_threshold) ? vis_window_threshold : CHAIN.length
    	var beginning_index = (CHAIN.length > vis_window_threshold) ? (CHAIN.length - vis_window_threshold) : 0

    	console.log("draw_limit: "+draw_limit)
    	console.log("beginning_index: "+beginning_index)

		for( var i = beginning_index; i < CHAIN.length; i++ ){
	    	var iBlock = CHAIN[i]
		    if(i == 0){
		    	var n1 = {
					 id: iBlock.header.hash, 
					 label: 'B'+(i+1), 
					 color: genesis_block_color,
					 title: "<pre class='node_tooltip'>"+JSON.stringify(iBlock, undefined, 2)+"</pre>"
					 }
		    	nodeHolder.push(n1)
		    	updateNode(n1)
		    }else if(i != 0 && nodeHolder.length == 0){
		    	var n1 = {
					 id: iBlock.header.hash, 
					 label: 'B'+(i+1), 
					 color: interim_block_color,
					 title: "<pre class='node_tooltip'>"+JSON.stringify(iBlock, undefined, 2)+"</pre>"
					 }
		    	nodeHolder.push(n1)
		    	updateNode(n1)
	    	}else{
		    	var n2 = {
    					 id: iBlock.header.hash, 
    					 label: 'B'+(i+1), 
    					 color: block_color,
    					 title: "<pre class='node_tooltip'>"+JSON.stringify(iBlock, undefined, 2)+"</pre>"
    					}
		    	nodeHolder.push(n2)
		    	updateNode(n2)
		    	var e2 = {
    					 from: iBlock.header.previousHash,
    					 to: iBlock.header.hash,
    					 arrows:'to'
    					}
		    	edgeHolder.push(e2)
		    	updateEdge(e2)
		    }
		    for(var j = 0; j < iBlock.body.rootInstances.length; j++){
		    	var RI = iBlock.body.rootInstances[j]
		    	if(RI.class == "male"){
		    		var nm = {
    						 id: RI.hash, 
    						 label: 'T'+(RI.index+1), 
    						 color: male_color,
    						 title: "<pre class='node_tooltip'>"+JSON.stringify(RI, undefined, 2)+"</pre>"
    						}
		    		nodeHolder.push(nm)
		    		updateNode(nm)
		    		var em = {
    						 from: RI.hash, 
    						 to: RI.partner,
    						 dashes: true
    						}
		    		edgeHolder.push(em)
		    		updateEdge(em)
		    	} else if(RI.class == "female"){
		    		var nf = {
    						 id: RI.hash, 
    						 label: 'T'+(RI.index+1), 
    						 color: female_color,
    						 title: "<pre class='node_tooltip'>"+JSON.stringify(RI, undefined, 2)+"</pre>"
    						}
		    		nodeHolder.push(nf)
		    		updateNode(nf)
		    		var ef = {
    			             from: RI.hash, 
    			             to: iBlock.header.hash,
    			             dashes: true
    			             }
		    		edgeHolder.push(ef)
		    		updateEdge(ef)
		    	}
		    }
    	}

    	//nodes.clear();
        //edges.clear();
    	//updateEdge(edgeHolder)
    	//updateNode(nodeHolder)

	    // create an array with edges
	    // nodes = new vis.DataSet(nodes);
    	// edges = new vis.DataSet(edges);

	    var container = document.getElementById('BC_VIZ');
	    if(network == null){
		    nodes = new vis.DataSet(nodeHolder);
    		edges = new vis.DataSet(edgeHolder);
		    var data = {
		      nodes: nodes,
		      edges: edges
		    }; 
		    network = new vis.Network(container, data, options);
		    network.on("click", function (params) {		    
		        var nodeAt = this
		        console.log('click event, getNodeAt returns: ' + nodeAt.getNodeAt(params.pointer.DOM));
		        console.log(JSON.stringify(params, null, 4))
		        var found = searchChain(nodeAt.getNodeAt(params.pointer.DOM))
		        $("#highlight").html(JSON.stringify(found, null, 4))
		        $('#mainDetailModal').modal('toggle')
		    });
		}else{
		
		}
		network.stabilize();
	}

	$('#exampleModalLong').on('shown.bs.modal', function () {
	  $('#myInput').trigger('focus')
	})

	function stabalizeNetwork(){
		network.stabilize();
	}

	function resetG(){
        network.stabilize();
	}

    function searchChain(condition){
    	var allRootInstances = []
        currentChain.forEach(block => {
        	if(block.body.rootInstances.length > 0){
        		block.body.rootInstances.forEach(rootInstance => {
        			allRootInstances.push(rootInstance)
        		})
        	}
        })

        var found = allRootInstances.find(function(ri){
			return ri.hash == condition
		});

		if(found == undefined){
			found = currentChain.find(function(block){
				return block.header.hash == condition
			});
			if(found != undefined){
				$("#details_label").html("Block ")
			}
		}else{
			$("#details_label").html("Root Instance ")
		}
		return found
    }

    initDrawNetworkGraph()

	function buildHtmlTable(selector, myList) {
	  var columns = addAllColumnHeaders(myList, selector);
	  for (var i = 0; i < myList.length; i++) {
	    var row$ = $('<tr/>');
	    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
	      var cellValue = myList[i][columns[colIndex]];
	      if (cellValue == null) cellValue = "";
	      row$.append($('<td/>').html(cellValue));
	    }
	    $(selector).append(row$);
	  }
	}

	function addAllColumnHeaders(myList, selector) {
	  var columnSet = [];
	  var headerTr$ = $('<tr/>');
	  for (var i = 0; i < myList.length; i++) {
	    var rowHash = myList[i];
	    for (var key in rowHash) {
	      if ($.inArray(key, columnSet) == -1) {
	        columnSet.push(key);
	        headerTr$.append($('<th/>').html(key));
	      }
	    }
	  }
	  $(selector).append(headerTr$);
	  return columnSet;
	}

	var rootHolder = []

	function addRootCell(){
		var div = document.getElementById('root_config_cell_holder');
		div.innerHTML += '<hr><div class="container root_config_cell" id="">'+
	  					 '<div class="row" style="background: #ccc; padding: 10px; border: 1px black solid;">'+
			  				'<div class="input-group mb-3">'+
							  '<div class="input-group-prepend">'+
							    '<span class="input-group-text" id="inputGroup-sizing-default">Name:</span>'+
							  '</div>'+
							  '<input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default">'+
							'</div>'+

							'<div class="input-group mb-3">'+
							  '<div class="input-group-prepend">'+
							    '<label class="input-group-text" for="inputGroupSelect01">Access Type:</label>'+
							  '</div>'+
							  '<select class="custom-select" id="inputGroupSelect01">'+
							    '<option selected>Choose...</option>'+
							    '<option value="1">Public</option>'+
							    '<option value="2">Private</option>'+
							  '</select>'+
							'</div>'+

							'<div class="input-group mb-3">'+
							  '<div class="input-group-prepend">'+
							    '<span class="input-group-text" id="inputGroup-sizing-default">Code:</span>'+
							  '</div>'+
							  '<input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default">'+
							'</div>'+
							'<div class="input-group mb-3">'+
							  '<div class="input-group-prepend">'+
							    '<span class="input-group-text" id="inputGroup-sizing-default">Return:</span>'+
							  '</div>'+
							  '<input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default">'+
							'</div>'+
						'</div>'+
					'</div><br>'
	}

	function CreateBCConfigOject(){

	}

	function UILog(content){
		$("#UILog").html(content)
	}

	setInterval(GetChainHash, 1000)
	


