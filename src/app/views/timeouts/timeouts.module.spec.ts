import { TimeOutModule } from './timeouts.module';

describe('timeoutModule', () => {
  let timeoutModule: TimeOutModule;

  beforeEach(() => {
    timeoutModule = new TimeOutModule();
  });

  it('should create an instance', () => {
    expect(timeoutModule).toBeTruthy();
  });
});
