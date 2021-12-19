import { ItemtypesModule } from './itemtypes.module';

describe('LocationsModule', () => {
  let brandsModule: ItemtypesModule;

  beforeEach(() => {
    brandsModule = new ItemtypesModule();
  });

  it('should create an instance', () => {
    expect(brandsModule).toBeTruthy();
  });
});
