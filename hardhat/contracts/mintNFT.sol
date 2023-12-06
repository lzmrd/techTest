 // SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract mintNFT is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 100;
    uint256 private _tokenIds;
    mapping(address => bool) public hasMinted;

    constructor() ERC721("MintNFT", "MNFT") Ownable(msg.sender) {}

    function mint(address user) public onlyOwner {
        require(_tokenIds < MAX_SUPPLY, "Max supply reached");
        require(!hasMinted[user], "You have already minted your NFT");

        _tokenIds++;
        uint256 newItemId = _tokenIds;
        hasMinted[user] = true;
        _mint(user, newItemId);

    }
}

