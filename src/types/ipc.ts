export type TestChannels = 'test:create' | 'test:getAll';
export type CliChannels =
  | 'cli:run'
  | 'cli:input'
  | 'cli:stop'
  | 'cli:output'
  | 'cli:error'
  | 'cli:done'
  | 'cli:setPath'
  | 'cli:status';

export type Channels = TestChannels | CliChannels;
