import { Controller, Post, Body, HttpException, HttpStatus, Req, Res } from '@nestjs/common';
import { NftService } from './nft.service';
import { ethers } from 'ethers';

@Controller('nft')
export class NftController {
    constructor(private readonly nftService: NftService) {}

    @Post('mint') // Endpoint for minting NFT
    async mint(@Body() body: { userAddress: string }) {
        if (!body.userAddress || !ethers.isAddress(body.userAddress)) {
            // Validation: Checks if userAddress is valid
            throw new HttpException('Invalid user address', HttpStatus.BAD_REQUEST); // Throws a Bad Request error if the user address is invalid
        }
        try {
            const result = await this.nftService.mint(body.userAddress); // Calls the mint function from the NftService to mint an NFT for the provided user address
            return { transactionHash: result }; // Returns the transaction hash upon successful minting
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR); // Throws an Internal Server Error if an error occurs during the minting process
        }
    }
}
