import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NftModule } from './nft/nft.module';
import { BlockchainListenerService } from 'blockchainListener';

@Module({
  imports: [NftModule],
  controllers: [AppController],
  providers: [AppService, BlockchainListenerService],
})
export class AppModule {}
