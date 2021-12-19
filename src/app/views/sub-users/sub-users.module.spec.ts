import { SubUserModule } from './sub-users.module';

describe('CompaniesModule', () => {
  let subUsersModule: SubUserModule;

  beforeEach(() => {
    subUsersModule = new SubUserModule();
  });

  it('should create an instance', () => {
    expect(subUsersModule).toBeTruthy();
  });
});
