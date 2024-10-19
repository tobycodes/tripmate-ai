import { Global, Module } from '@nestjs/common';
import { CryptoAdapter } from './crypto.adapter';

@Global()
@Module({
  providers: [CryptoAdapter],
  exports: [CryptoAdapter],
})
export class CryptoModule {}
