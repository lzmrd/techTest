import { Controller, Post, Body, HttpException, HttpStatus, Req, Res } from '@nestjs/common';
import { NftService } from './nft.service'; // Assicurati di creare questo servizio
import { ethers } from 'ethers';

@Controller('nft')
export class NftController {
    constructor(private readonly nftService: NftService) {}

    /* @Post('mint')
    async mintNFT(
        @Req
        @Body() body: { userAddress: string })
        @Res
        {
        try {
            console.log('user address:', body.userAddress)
            const result = await this.nftService.mintNft(body.userAddress);
            return { transactionHash: result };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
 */
@Post('mint')
async mint(@Body() body: { userAddress: string }) {
    if (!body.userAddress || !ethers.isAddress(body.userAddress)) {
        throw new HttpException('Invalid user address', HttpStatus.BAD_REQUEST);
    }
    try {
        const result = await this.nftService.mint(body.userAddress);
        return { transactionHash: result };
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}}
