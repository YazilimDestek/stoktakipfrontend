import { CategoriesModule } from './categories.module';

describe('SettingsModule', () => {
  let categoriesModule: CategoriesModule;

  beforeEach(() => {
    categoriesModule = new CategoriesModule();
  });

  it('should create an instance', () => {
    expect(categoriesModule).toBeTruthy();
  });
});
