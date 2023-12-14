// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract mintNFT is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 100; // Maximum number of NFTs that can be minted
    uint256 private _tokenIds; // Counter to keep track of token IDs
    mapping(address => bool) public hasMinted; // Mapping to track if an address has minted an NFT

    constructor() ERC721("MintNFT", "MNFT") Ownable(msg.sender) {} // Constructor setting up the ERC721 token and Ownable

    // Function to mint an NFT
    function mint(address user) public onlyOwner {
        require(_tokenIds < MAX_SUPPLY, "Max supply reached"); // Ensure the maximum supply limit is not reached
        require(!hasMinted[user], "You have already minted your NFT"); // Check if the user has already minted an NFT

        _tokenIds++; // Increment token ID
        uint256 newItemId = _tokenIds; // Assign a new token ID
        hasMinted[user] = true; // Mark the user as having minted an NFT
        _mint(user, newItemId); // Mint the NFT and assign it to the user
    }
}
