//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
contract BI
{
    struct Product
    {
        uint prodID;
        address[] owners;
        string description;
        uint price;
        // uint noOfUnits;
    }

    struct boughtProduct {
        // uint unitsBought;
        address boughtby;
        string review;
    }
    
    struct Buyer {
        uint regStatus;
        uint buyerBal;
    }
    
    struct Seller {
        uint regStatus;
        uint sellerBal;
    }
    Product[] public products ;
    boughtProduct[] public transferredProducts; 
    Product public productinfo;
    uint public available;
    address chairperson;

    mapping(address => Buyer) public Buyers;
    mapping(address => Seller) public Sellers;
    
    constructor () public payable  { 
      
        chairperson = msg.sender;
    }

    modifier onlyChairperson{ 
        require(msg.sender==chairperson);
        _;
    }
    
    modifier validBuyer() {
        require(Buyers[msg.sender].regStatus == 1, "Registered Buyer");
        _;
    }

    modifier validSeller() {
        require(Sellers[msg.sender].regStatus == 2, "Registered Seller");
        _;
    }

    function registerBuyer() public {
        Buyers[msg.sender].regStatus = 1;
        Buyers[msg.sender].buyerBal = address(msg.sender).balance;
    }

    function registerSeller() public {
        Sellers[msg.sender].regStatus = 2;
        Sellers[msg.sender].sellerBal = address(msg.sender).balance;
    }

    function unregister (address payable addr) onlyChairperson public {
        
        if (Buyers[addr].regStatus!= 1) { 
            Buyers[addr].regStatus = 0;
            revert();
        }
        if (Sellers[addr].regStatus!= 2) {
            Sellers[addr].regStatus = 0;
            revert();
        }
        
    }
    // function 
    function fillProductInfo(uint id, address payable owner, uint cost, string memory desc) public validSeller {
       productinfo.prodID = id;
       productinfo.description = desc;
       productinfo.price = cost;
       productinfo.owners.push(owner);
       products.push(productinfo);
       available += 1;
    //    return productinfo;
    }

    function seeProductsInfo () public view returns (Product[] memory) {
        return products;
    }
    
    function checkBalance () public view returns (uint val) {
        // uint x = cp * cost;
        return (Buyers[msg.sender].buyerBal);
    }

    function checkTransferredProducts () public view returns (boughtProduct[] memory) {
        // uint x = cp * cost;
        return transferredProducts;
    }


    function checknNoOfItems () public view returns (uint) {
        // uint x = cp * cost;
        return available;
    }

    function buyProducts(uint id, address payable latest) validBuyer payable external {
        // require(prod.noOfUnits >= count);
        uint cp;
        for (uint x = 0; x <= products.length - 1; ++x) {
            if (products[x].prodID == id) {
                // require(products[x].noOfUnits >= count);
                cp = products[x].price;
                // address payable latest = products[x].owners[owners.length - 1];
                products[x].owners.pop();
                // if (products[x].owners.length == 0) {
                //     available--;
                // }
                available--;
            }
        }
        uint cpether = cp * 1000000000000000000; //change it e^18
        require(Buyers[msg.sender].buyerBal >= (cpether));
        Buyers[msg.sender].buyerBal -= (cpether);
        
        // for (uint x = 0; x <= products.length - 1; ++x) {
        //     if (products[x].prodID == id) {
        //         // require(products[x].noOfUnits >= count);
        //         products[x].owners.pop();
        //         if (products[x].owners.length == 0) {
        //             available--;
        //         }
        //     }
        // }
        boughtProduct memory bp;
        // bp.unitsBought = count;
        bp.boughtby = msg.sender;
        bp.review = "Great Product";
        
        transferredProducts.push(bp);
        
        (latest).transfer(cpether);

    }

}
//batches of products - quantize; initially add balance to smart contract (extra function)