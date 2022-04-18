let x = []
let image = localStorage.getItem("image") ? JSON.parse(localStorage.getItem("image")) : {}
App = {
  web3: null,
  contracts: {},
//   address:'0x74a9A59478dc66060Ae61BfEFa918F6b63A95612',
  url: 'http://127.0.0.1:7545',
  network_id:3, // 5777 for local
  seller:null,
//   buyer:'0xc4033C62AB9394D300C67209358aa6bd125691ab',
  current_address: null,
  value:1000000000000000000,
  index:0,
  margin:10,
  left:15,
  init: function() {
    console.log("Initiating Web3 Provider")
    return App.initWeb3();
  },

  initWeb3: function() {    
    console.log("Initiating Web3 Provider")     
    if (window.ethereum){
		web3 = new Web3(web3.currentProvider);
		try {
		  //Request account access
		window.ethereum.request({ method: "eth_requestAccounts" });
		} catch (error) {
		  // User denied account access...
		  console.error("User denied account access");
		}
		App.web3Provider = web3.currentProvider;
		console.log("modern dapp browser");
	  }
	  // Legacy dapp browsers...
	  else if (window.web3) {
		App.web3Provider = window.web3.currentProvider;
		console.log("legacy dapp browser");
	  }
	  // if no injected web3 instance is detected, fall back to Ganache
	  else {
		App.web3Provider = new Web3.providers.HttpProvider(App.url);
	  }

	  web3 = new Web3(App.web3Provider);
  
	//   App.populateAddress();   
	  return App.initContract();  
  },

  initContract: function() { 
	$.getJSON('BI.json', function(data) {
		// Get the necessary contract artifact file and instantiate it with truffle-contract
		var bi = data;
		App.contracts.BI = TruffleContract(bi);
	
		// Set the provider for our contract
		App.contracts.BI.setProvider(web3.currentProvider);	 

		console.log("Initiating Web3 contracts")
		console.log(App.contracts.BI)
	  });

    return App.bindEvents();
  },  

  bindEvents: function() {  
    // $(document).on('click', '#initilaizeCounter', function(){
    //    App.handleInitialization(jQuery('#Initialize').val());
    // });

    $(document).on('click', '#registerbuy', function(){
      App.handleRegisterBuyer();
    });

	$(document).on('click', '#registersell', function(){
		App.handleRegisterSeller();
	  });

	  $(document).on('click', '#buyerbalance', function(){
		App.handleBuyerBalance();
	  });
	  
	  $(document).on('click', '#products', function(){
		App.handleProducts();
	  });

	  $(document).on('click', '#totalItems', function(){
		App.handleTotalItems();
	  });
	  $(document).on('click', '#totalItems', function(){
		App.handleTransferredProducts();
	  });
    // $(document).on('click', '#available_items', function(){
    //   App.handleGet();
    // });

// 	$(document).on('click', '#lowprice', function(){
// 		App.handlelowprice();
// 	  });

	// $(document).on('click', '#lowage', function(){
	// 	App.handlelowage();
	//   });

    $(document).on('click', '#buyrequest',function(){
      App.handlebuy(jQuery('#pid').val(), jQuery('#buyadress').val());
	//   App.handlebuy(jQuery('#pid').val());
	//   App.handlebuy(id, owner, cost, desc)
    });
	// $(document).on('click', 'pid',function(){
	// 	App.handlebuy(jQuery('#pid').val());
	//   });

    $(document).on('click', '#sellrequest', function(){

		var id = jQuery('#ID').val()
		// var itmcnt = jQuery('#itemscount').val()
		var owner = jQuery('#owner').val()
		var cost = jQuery('#cost').val()
		var desc = jQuery('#desc').val()
      App.handlesell(id, owner, cost, desc)
    });
    
//   },

//   populateAddress : function(){  
//     App.handler=App.web3.givenProvider.selectedAddress;
  },  

//   handleRegisterBuyer:function(){
//     App.web3.eth.getAccounts().then(function(accounts){
//       var account = accounts[0]
//       var option={from:account} 
//       App.contracts.Counter.methods.registerBuyer()
//     .send(option)
//     .on('receipt',(receipt)=>{

// 		jQuery('#register_success').text("Hello, you are registered Successfully as Buyer, your adrress is : " + account)
    
//     });
//   });
//   },
  handleRegisterBuyer:function(){
	var registerInstance;
    web3.eth.getAccounts(function(error, accounts) {
    var account = accounts[0];

    App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;
    return registerInstance.registerBuyer({from: account});
    }).then(function(result, err){
		if(result){
            if(result.receipt.status == true)
            jQuery('#register_success').text("Hello, you are registered Successfully, your adrress is : " + account)
        }  
	});
});
},
//   handleRegisterSeller:function(){
//     App.web3.eth.getAccounts().then(function(accounts){
//       var account = accounts[0]
//       var option={from:account} 
//       App.contracts.Counter.methods.registerBuyer()
//     .send(option)
//     .on('receipt',(receipt)=>{

// 		jQuery('#register_success').text("Hello, you are registered Successfully as Seller, your adrress is : " + account)
    
//     });
//   });
//   },
  handleRegisterSeller:function(){
	var registerInstance;
    web3.eth.getAccounts(function(error, accounts) {
    var account = accounts[0];

    App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;
    return registerInstance.registerSeller({from: account});
    }).then(function(result, err){
		if(result){
            if(result.receipt.status == true)
            jQuery('#register_success').text("Hello, you are registered Successfully, your adrress is : " + account)
        }  
	});
});
},

//   handleGet:function(){
	
//   },

  handleTotalItems:function(){
	var registerInstance;
    web3.eth.getAccounts(function(error, accounts) {
    var account = accounts[0];

    App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;
	registerInstance.checknNoOfItems({from: account}).then((result)=>{

		jQuery('#gettotalItems').text("Total Available Items : " + result.toString())
	})
});
});
		// App.contracts.Counter.methods.checknNoOfItems().call(
		// 	function(err, result){
		// 		if(!err){
		// 			// var price = result.price
		// 			console.log(result)
		// 			jQuery('#gettotalItems').append("<i > Present Items : </i>" , result);
		// 			//+ "<br\>" + "<i>\nID : "+ r +"</i>" + "<br\>" + "<i>Price : "+ price + " ETH" + "</i>")
		// 		}
		// 	});
  },
  handleProducts:function(){
	// App.contracts.Counter.methods.get_LowCostRacquet()
    // .call()
    // .then((r)=>{
	// 	console.log(r)

	var registerInstance;
	web3.eth.getAccounts(function(error, accounts) {
	var account = accounts[0];
	App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;

	return registerInstance.seeProductsInfo({from: account}).then((result)=>{
		x = result;
		console.log(x, result.length);
		result.forEach((ele, i)=>{
			console.log("hi-ds")

			jQuery('#getproducts').append("<i > Present Products : </i> " , "<br></br>");
			jQuery('#getproducts').append("Product Id: ", result[i].prodID.toString())
			jQuery('#getproducts').append("<br></br>")
			jQuery('#getproducts').append("Product owners ", result[i].owners.toString())
			jQuery('#getproducts').append("<br></br>")
			jQuery('#getproducts').append("Description of Product: ", result[i].description.toString())
			jQuery('#getproducts').append("<br></br>")
			jQuery('#getproducts').append("price of Product: ", result[i].price.toString())
			jQuery('#getproducts').append("<br></br>")
			console.log(image)
			if(parseInt(result[i].prodID, 10) in image){
				const data = document.createElement('img')
				console.log("hi")
				console.log(image, result[i].prodID)
				data.src = image[parseInt(result[i].prodID, 10)];
				data.width = "400"
				data.height = "400"
				console.log(data)
				jQuery("#getproducts").append(data)	
			}
		})
		
	})

});
});

		// App.contracts.Counter.methods.seeProductsInfo().call(
		// 	function(err, result){
		// 		if(!err){
		// 			// var price = result.price
		// 			console.log(result.length)
		// 			for (var i = 0; i < result.length; i++) {
		// 				jQuery('#getproducts').append("<i > Present Products : </i> " , result[i] + "<br></br>");
		// 				jQuery('#getproducts').append("<br></br>")
		// 			}
					
					
		// 			//+ "<br\>" + "<i>\nID : "+ r +"</i>" + "<br\>" + "<i>Price : "+ price + " ETH" + "</i>")
		// 		}
		// 	});
  },

  handleTransferredProducts:function(){
	var registerInstance;
	web3.eth.getAccounts(function(error, accounts) {
	var account = accounts[0];
	App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;

	return registerInstance.checkTransferredProducts({from: account}).then((result)=>{
		x = result;
		console.log(x);
		for (var i = 0; i < result.length; i++) {
			
			jQuery('#gettransferredproducts').append("<i > Transferred Products : </i> " , "<br></br>");
			jQuery('#gettransferredproducts').append("<i > Products bought by  : </i> " , result[i].boughtby.toString(),"<br></br>");
			jQuery('#gettransferredproducts').append("<i > Transferred Products : </i> " , result[i].review.toString(),"<br></br>");
			// jQuery('#gettransferredproducts').append("<i > Transferred Products : </i> " , "<br></br>");

			jQuery('#gettransferredproducts').append("<br></br>")
		}
		
	})

});
});
  },
  handleBuyerBalance:function(){
	var registerInstance;
	web3.eth.getAccounts(function(error, accounts) {
	var account = accounts[0];
	App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;

	return registerInstance.checkBalance({from: account}).then((result)=>{
		jQuery('#getbuyerbalance').append("<i > Buyer Balance : </i>" , result.toString());
		
	})

});
});
},
//   handleBuyerBalance:function(){
// 	// App.contracts.Counter.methods.get_LowCostRacquet()
//     // .call()
//     // .then((r)=>{
// 	// 	console.log(r)
// 		App.contracts.Counter.methods.checkBalance().call(
// 			function(err, result){
// 				if(!err){
// 					// var price = result.price
// 					console.log(result)
// 					jQuery('#getbuyerbalance').append("<i > Buyer Balance : </i>" , result);
// 					//+ "<br\>" + "<i>\nID : "+ r +"</i>" + "<br\>" + "<i>Price : "+ price + " ETH" + "</i>")
// 				}
// 			});
//   },


  handlebuy:function(val, adress){
    // if (adress===''){
    //   alert("Please enter a valid decrementing value.")
    //   return false
    // }


var registerInstance;
	web3.eth.getAccounts(function(error, accounts) {
	var account = accounts[0];
	App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;
	console.log(x)
	let price = 0;
	for (var i = 0; i < x.length; ++i) {
		if(x[i].prodID == val) {
			price = x[i].price;
			break;
		}
	}
	console.log(price);
	return registerInstance.buyProducts(val, adress, {from: account, value: web3.utils.toWei(price.toString(), "ether")}).then((result)=>{
		// jQuery('#getbuyerbalance').append("<i > Buyer Balance : </i>" , result.toString());
		console.log(result)
		
		if(result){
            if(result.receipt.status == true){
			// App.product_ids.push(id1)
			// console.log(App.product_ids)
            alert("Item Bought Successfully")
			}
        }  
	})

});
});

// 	App.web3.eth.getAccounts().then(function(accounts){
// 		var account = accounts[0]
// 		var option={from:account} 
// 		// console.log(option);
// 		console.log(val, adress);
//     App.contracts.Counter.methods.buyProducts(val, adress)
//     .send(option)
//     .on('receipt',(receipt)=>{
//       console.log(receipt)
//       if(receipt.status){
//         toastr.success("Counter is decremented by " + adress);
//     }});
// });
  
  },
  handlesell:function(id, owner, cost, desc){
	  var x = document.getElementById("url").value;
	  image[id] = x;
	  localStorage.setItem("image", JSON.stringify(image))
	  var registerInstance;
	  web3.eth.getAccounts(function(error, accounts) {
	  var account = accounts[0];
	  App.contracts.BI.deployed().then(function(instance) {
	  registerInstance = instance;
			
	  return registerInstance.fillProductInfo(id, owner, cost, desc, {from: account}).then((result)=>{
		if(result){
            if(result.receipt.status == true){
			// App.product_ids.push(id1)
			// console.log(App.product_ids)
            alert("Item Added Successfully")
			}
        }  
		  
	  })
  
  });
  });
  },

//   handlesell:function(id, owner, cost, desc) {

  
// 	  App.web3.eth.getAccounts().then(function(accounts){
// 		  var account = accounts[0]
// 		  var option={from:account} 
// 		  App.seller = account
// 		//   console.log(App.contracts.Counter.methods.productinfo())
// 		  console.log(App.seller)
		  
// 		//   console.log(App.contracts.Counter.methods.fillProductInfo(id, no_of_items, owner,cost,desc))
// 		  App.contracts.Counter.methods.fillProductInfo(id,owner,cost,desc)
// 		  .send(option)
// 		  .on('receipt',(receipt)=>{
// 		  if(receipt.status){
// 			  toastr.success("Counter is incremented by " + incrementValue);
// 		  }});


		  
// 		});

		// App.contracts.Counter.methods.productinfo().call(
		// 	function(err, result){
		// 		if(!err){
		// 			console.log(result)
		// 		}});
		
    // .call()
    // .then((r)=>{
	// console.log(r)
    //   jQuery('#getitems').text("Total Available Items : " + r)
    // })
//   },
 
// abi: [
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "id",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "address payable",
// 				"name": "latest",
// 				"type": "address"
// 			}
// 		],
// 		"name": "buyProducts",
// 		"outputs": [],
// 		"stateMutability": "payable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "id",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "address payable",
// 				"name": "owner",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "cost",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "desc",
// 				"type": "string"
// 			}
// 		],
// 		"name": "fillProductInfo",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "registerBuyer",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "registerSeller",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"stateMutability": "payable",
// 		"type": "constructor"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address payable",
// 				"name": "addr",
// 				"type": "address"
// 			}
// 		],
// 		"name": "unregister",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "available",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "",
// 				"type": "address"
// 			}
// 		],
// 		"name": "Buyers",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "regStatus",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "buyerBal",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "checkBalance",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "val",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "checknNoOfItems",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "checkTransferredProducts",
// 		"outputs": [
// 			{
// 				"components": [
// 					{
// 						"internalType": "address",
// 						"name": "boughtby",
// 						"type": "address"
// 					},
// 					{
// 						"internalType": "string",
// 						"name": "review",
// 						"type": "string"
// 					}
// 				],
// 				"internalType": "struct BI.boughtProduct[]",
// 				"name": "",
// 				"type": "tuple[]"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "productinfo",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "prodID",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "description",
// 				"type": "string"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "price",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "products",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "prodID",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "description",
// 				"type": "string"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "price",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "seeProductsInfo",
// 		"outputs": [
// 			{
// 				"components": [
// 					{
// 						"internalType": "uint256",
// 						"name": "prodID",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "address[]",
// 						"name": "owners",
// 						"type": "address[]"
// 					},
// 					{
// 						"internalType": "string",
// 						"name": "description",
// 						"type": "string"
// 					},
// 					{
// 						"internalType": "uint256",
// 						"name": "price",
// 						"type": "uint256"
// 					}
// 				],
// 				"internalType": "struct BI.Product[]",
// 				"name": "",
// 				"type": "tuple[]"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "",
// 				"type": "address"
// 			}
// 		],
// 		"name": "Sellers",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "regStatus",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "sellerBal",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "transferredProducts",
// 		"outputs": [
// 			{
// 				"internalType": "address",
// 				"name": "boughtby",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "review",
// 				"type": "string"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	}
// ]

}


$(function() {
  $(window).load(function() {
    App.init();
  });

});
