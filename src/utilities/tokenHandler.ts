import jwt, { JwtPayload } from 'jsonwebtoken';
import { ConfigurationError } from '../errors';
import { getConfiguration } from '../services/config.service';

export interface TokenPayload extends JwtPayload {
  id: string;
  display_name: string;
  unverified: boolean;
}

export function getTokenPayload() {
  try {
    const token = getConfiguration('authToken');
    const details: TokenPayload = <TokenPayload>jwt.decode(token);

    return details;
  } catch (error) {
    throw new ConfigurationError(error as Error);
  }
}
