import pc from 'picocolors';
import prompts, { PromptObject } from 'prompts';
import { AuthenticationError } from '../errors';
import { sendLoginRequest } from '../api/auth.api';
import {
  addConfiguration,
  getConfiguration,
  removeConfiguration
} from './config.service';
import ora from 'ora';
import { getTokenPayload } from '../utilities/tokenHandler';

export function currentSessionDetails() {
  try {
    const { display_name, unverified } = getTokenPayload();
    console.log(`Logged in as ${display_name}.`);
    if (unverified)
      console.log(
        pc.red('\n! Your account is not verified. Verify your account and signin again.')
      );
  } catch (err) {
    console.log('Not logged in.\nUse the command `tss login` to login.');
  }
}

export async function login() {
  if (getConfiguration('authToken')) {
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
    const authToken = await sendLoginRequest({ email, password });
    if (!authToken) throw new AuthenticationError('Authentication failure');

    addConfiguration({ authToken });
    spinner.succeed('Log in successful.');
  } catch (err) {
    spinner.fail('Login failed');
    throw err;
  }
}

export function logout() {
  removeConfiguration('authToken');
  console.log('Logged out.');
}
