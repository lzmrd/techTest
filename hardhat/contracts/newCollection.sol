// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interface to interact with the first contract
interface IFirstContract {
    function balanceOf(address owner) external view returns (uint256);
}

 contract RestrictedCollection is ERC721URIStorage, Ownable {
    address public firstContractAddress; // Address of the first contract

    uint256 public constant MAX_SUPPLY = 40; // Maximum supply of NFTs in the collection
    uint256 public mintedCount = 0; // Count of minted NFTs

    uint256 public constant MAX_PER_TX = 5; // Maximum tokens allowed per transaction
    uint256 public constant FIRST_15_PRICE = 0.00000005 ether; // Price for the first 15 tokens
    uint256 public constant REST_PRICE = 0.0006 ether; // Price for tokens after the first 15

    mapping(uint256 => string) public customNames; // Mapping of custom names to token IDs

    event NameChanged(uint256 indexed tokenId, string newName); // Event emitted when a name is changed
    event TokenMinted(uint256 indexed tokenId, address owner); // Event emitted when a token is minted

    constructor(address _firstContractAddress) ERC721("MintNFTSecond", "M2NFT") Ownable(msg.sender) {
        firstContractAddress = _firstContractAddress; // Set the address of the first contract
    }

    function mintNFT(uint256 numberOfTokens) public payable {
        require(mintedCount + numberOfTokens <= MAX_SUPPLY, "Max supply exceeded"); // Ensure maximum supply is not exceeded
        require(numberOfTokens <= MAX_PER_TX, "Exceeds max per transaction"); // Ensure tokens per transaction limit

        IFirstContract firstContractInstance = IFirstContract(firstContractAddress); // Create instance of the first contract
        require(firstContractInstance.balanceOf(msg.sender) > 0, "Must own a first NFT"); // Check ownership of the first NFT

        uint256 totalPrice;
        if (mintedCount < 15) {
            totalPrice = FIRST_15_PRICE * numberOfTokens; // Calculate total price for first 15 tokens
        } else {
            totalPrice = REST_PRICE * numberOfTokens; // Calculate total price for tokens after the first 15
        }

        require(msg.value >= totalPrice, "Ether sent is not correct"); // Check sent ether against total price

        for (uint256 i = 0; i < numberOfTokens; i++) {
            mintedCount++;
            _mint(msg.sender, mintedCount); // Mint NFTs to who calls the function
            emit TokenMinted(mintedCount, msg.sender); // Emit event for minted token
        }
    }

    function purchaseCustomName(uint256 tokenId, string memory name) public payable {
        require(ownerOf(tokenId) == msg.sender, "Not the owner"); // Check if caller is the owner of the token
        require(msg.value >= 0.0004 ether, "Insufficient payment"); // Check the payment amount
        customNames[tokenId] = name; // Set the custom name for the token

        emit NameChanged(tokenId, name); // Emit event for name change
    }

    // Set the token URI for each NFT, because it's the function called by backend every time an event is emitted
    function setTokenURI(uint256 tokenId, string memory _tokenURI) public onlyOwner {
        _setTokenURI(tokenId, _tokenURI); 
    }
}
