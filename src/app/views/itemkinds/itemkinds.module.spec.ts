import { ItemkindsModule } from './itemkinds.module';

describe('LocationsModule', () => {
  let brandsModule: ItemkindsModule;

  beforeEach(() => {
    brandsModule = new ItemkindsModule();
  });

  it('should create an instance', () => {
    expect(brandsModule).toBeTruthy();
  });
});
