// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IFirstContract {
    function balanceOf(address owner) external view returns (uint256);
}

contract RestrictedCollection is ERC721, Ownable {
    address public firstContractAddress;

    uint256 public constant MAX_SUPPLY = 40;
    uint256 public mintedCount = 0;

    uint256 public constant MAX_PER_TX = 5;
    uint256 public constant FIRST_15_PRICE = 0.00000005 ether;
    uint256 public constant REST_PRICE = 0.0006 ether;

    mapping(uint256 => string) public customNames;

    event NameChanged(uint256 indexed tokenId, string newName);


    constructor(address _firstContractAddress) ERC721("MintNFTSecond", "M2NFT") Ownable(msg.sender) {
        firstContractAddress = _firstContractAddress;
    }

    function mintNFT(uint256 numberOfTokens) public payable {
        require(mintedCount + numberOfTokens <= MAX_SUPPLY, "Max supply exceeded");
        require(numberOfTokens <= MAX_PER_TX, "Exceeds max per transaction");  

        IFirstContract firstContractInstance = IFirstContract(firstContractAddress);
        require(firstContractInstance.balanceOf(msg.sender) > 0, "Must own a first NFT");

        uint256 totalPrice;
        if (mintedCount < 15) {
            totalPrice = FIRST_15_PRICE * numberOfTokens;
        } else {
            totalPrice = REST_PRICE * numberOfTokens;
        }

        require(msg.value >= totalPrice, "Ether sent is not correct");

        for (uint256 i = 0; i < numberOfTokens; i++) {
            mintedCount++;
            _mint(msg.sender, mintedCount);
        }
    }

    function purchaseCustomName(uint256 tokenId, string memory name) public payable {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(msg.value >= 0.0004 ether, "Insufficient payment");
        customNames[tokenId] = name;

        emit NameChanged(tokenId, name);
    }

    // Altre funzioni necessarie...
}
