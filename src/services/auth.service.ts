import ora from 'ora';
import pc from 'picocolors';
import prompts, { PromptObject } from 'prompts';
import { AuthApi } from '../api/auth.api';
import { ApplicationError, AuthenticationError } from '../errors';
import { getTokenPayload } from '../utilities/tokenHandler';
import { ConfigService } from './config.service';

export class AuthService {
  static currentSessionDetails() {
    try {
      const { display_name, unverified } = getTokenPayload();
      console.log(`Logged in as ${display_name}.`);
      if (unverified)
        console.log(
          pc.red(
            '\n! Your account is not verified. Verify your account and signin again.'
          )
        );
    } catch (err) {
      console.log('Not logged in.\nUse the command `tss login` to login.');
    }
  }

  static async login() {
    if (ConfigService.getConfiguration('authToken')) {
      console.log('You are already logged in.');
      return;
    }
    const questions: PromptObject<string>[] = [
      {
        type: 'text',
        name: 'email',
        message: 'Email linked with The Secret Store account'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password'
      }
    ];

    const { email, password } = await prompts(questions);

    const spinner = ora({
      text: 'Logging you in...'
    }).start();

    try {
      const { authToken, refreshToken } = await AuthApi.sendLoginRequest({
        email,
        password
      });
      if (!authToken) throw new AuthenticationError('Authentication failure');

      ConfigService.addConfigurations({ authToken, refreshToken });
      spinner.succeed('Log in successful.');
    } catch (err) {
      spinner.fail('Login failed');
      throw err;
    }
  }

  static logout() {
    ConfigService.removeConfigurations('authToken', 'refreshToken');
    console.log('Logged out.');
  }

  static async refreshTokens() {
    const spinner = ora('Refreshing tokens...').start();
    try {
      const { authToken, refreshToken } = await AuthApi.requestNewTokenPair();
      ConfigService.addConfigurations({ authToken, refreshToken });
      spinner.succeed('Tokens refreshed.');
    } catch (error) {
      spinner.fail('Failed to refresh tokens.');
      throw new ApplicationError('Could not refresh tokens.', error as Error);
    }
  }
}
