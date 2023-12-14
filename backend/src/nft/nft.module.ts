import { Module } from '@nestjs/common';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';

@Module({
  controllers: [NftController], // Registers the NftController to handle incoming requests
  providers: [NftService] // Registers the NftService to provide functionality to the controller
})
export class NftModule {}
