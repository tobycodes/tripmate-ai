import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { ConfigService } from '../config/config.service';

@Injectable()
export class CryptoService {
  private readonly secret: string;

  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.get('app.cryptoSecret');
  }

  async hash(password: string): Promise<string> {
    return argon2.hash(password, { secret: Buffer.from(this.secret) });
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password, { secret: Buffer.from(this.secret) });
  }
}
