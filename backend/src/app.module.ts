import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NftModule } from './nft/nft.module';
import { BlockchainListenerService } from 'blockchainListener'; // Importing BlockchainListenerService

@Module({
  imports: [NftModule], // Importing the NftModule to include its functionalities
  controllers: [AppController], // Registering the AppController to handle incoming requests
  providers: [AppService, BlockchainListenerService], // Registering the AppService and BlockchainListenerService to provide functionalities to the module
})
export class AppModule {}
