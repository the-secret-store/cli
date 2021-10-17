import prompts, { PromptObject } from 'prompts';
import { AuthenticationError } from '../errors';
import { sendLoginRequest } from '../api/auth.api';
import { addConfiguration } from './config.service';

export async function login() {
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

  // todo: add spinner
  const authToken = await sendLoginRequest({ email, password });
  if (!authToken) throw new AuthenticationError('Authentication failure');

  addConfiguration({ authToken });
}
