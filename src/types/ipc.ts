export type TestChannels = 'test:create' | 'test:getAll';
export type ProjectChannels =
  | 'project:list'
  | 'project:add'
  | 'project:update'
  | 'project:delete'
  | 'project:getPath';

export type CliChannels =
  | 'cli:run'
  | 'cli:input'
  | 'cli:stop'
  | 'cli:output'
  | 'cli:error'
  | 'cli:done'
  | 'cli:setPath'
  | 'cli:status';

export type Channels = TestChannels | CliChannels | ProjectChannels;
