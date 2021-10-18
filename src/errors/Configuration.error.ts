export class ConfigurationError extends Error {
  constructor() {
    super(
      'Either configuration does not exist or malformed. Remove the configuration file ($HOME/.tssrc) and login again to resolve.'
    );
    this.name = 'ConfigurationError';
  }
}
