import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { ConfigAdapter } from '../config/config.adapter';

@Injectable()
export class CryptoAdapter {
  private readonly secret: string;

  constructor(private readonly config: ConfigAdapter) {
    this.secret = this.config.get('app.cryptoSecret');
  }

  async hash(password: string): Promise<string> {
    return argon2.hash(password, { secret: Buffer.from(this.secret) });
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password, { secret: Buffer.from(this.secret) });
  }
}
