import jwt, { JwtPayload } from 'jsonwebtoken';
import { ConfigurationError } from '../errors';
import { ConfigService } from '../services/config.service';

export interface TokenPayload extends JwtPayload {
  id: string;
  display_name: string;
  unverified: boolean;
}

export async function getTokenPayload() {
  try {
    const token = await ConfigService.getConfiguration('authToken');
    const details: TokenPayload = <TokenPayload>(jwt.decode(token) as unknown);

    return details;
  } catch (error) {
    throw new ConfigurationError(error as Error);
  }
}
