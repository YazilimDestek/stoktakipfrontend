import { LocationTypesModule } from './locationTypes.module';

describe('LocationsModule', () => {
  let locationTypesModule: LocationTypesModule;

  beforeEach(() => {
    locationTypesModule = new LocationTypesModule();
  });

  it('should create an instance', () => {
    expect(locationTypesModule).toBeTruthy();
  });
});
