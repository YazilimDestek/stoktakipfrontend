import { LocationsModule } from './locations.module';

describe('LocationsModule', () => {
  let locatiosModule: LocationsModule;

  beforeEach(() => {
    locatiosModule = new LocationsModule();
  });

  it('should create an instance', () => {
    expect(locatiosModule).toBeTruthy();
  });
});
