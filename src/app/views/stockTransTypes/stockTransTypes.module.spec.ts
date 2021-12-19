import { StockTransTypesModule } from './stockTransTypes.module';

describe('StockTransTypesModule', () => {
  let stockTransTypesModule: StockTransTypesModule;

  beforeEach(() => {
    stockTransTypesModule = new StockTransTypesModule();
  });

  it('should create an instance', () => {
    expect(stockTransTypesModule).toBeTruthy();
  });
});
