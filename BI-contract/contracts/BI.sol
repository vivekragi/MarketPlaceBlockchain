//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "./token/ERC20/ERC20.sol";
import "./MyOwnable.sol";
pragma experimental ABIEncoderV2;
contract BI is ERC20, Ownable
{
    struct Product
    {
        uint prodID;
        address[] owners;
        string description;
        uint price;
    }

    struct boughtProduct {
        address boughtBy;
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
    
    constructor () ERC20("BuffaloInstrumentsToken", "BITS")  { 
        _mint(msg.sender, 1000000 * 10 ** decimals());
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


    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function registerBuyer(uint amt) public {
        Buyers[msg.sender].regStatus = 1;
        _transfer(chairperson,msg.sender, amt);
        // Buyers[msg.sender].buyerBal = address(msg.sender).balance;
    }

    function registerSeller(uint amt) public {
        Sellers[msg.sender].regStatus = 2;
        _transfer(chairperson,msg.sender, amt);
        // Sellers[msg.sender].sellerBal = address(msg.sender).balance;
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
    }

    function seeProductsInfo () public view returns (Product[] memory) {
        return products;
    }
    
    function checkBalance (address acc) public view returns (uint val) {
        
        return balanceOf(acc);
    }

    function checkTransferredProducts () public view returns (boughtProduct[] memory) {
        
        return transferredProducts;
    }


    function checknNoOfItems () public view returns (uint) {
        
        return available;
    }

    function buyProducts(uint id, address latest, uint amt) validBuyer payable external {
        
        uint cp;
        for (uint x = 0; x <= products.length - 1; ++x) {
            if (products[x].prodID == id) {
                
                cp = products[x].price;
                
                products[x].owners.pop();
                available--;
            }
        }
        // uint cpether = cp * 1000000000000000000; //change it e^18
        // require(Buyers[msg.sender].buyerBal >= (cpether));
        // Buyers[msg.sender].buyerBal -= (cpether);
        _transfer(msg.sender, latest, amt);
        
        boughtProduct memory bp;
        // bp.unitsBought = count;
        bp.boughtBy = msg.sender;
        bp.review = "Great Product";
        
        transferredProducts.push(bp);
        
        // (latest).transfer(cpether);

    }

}