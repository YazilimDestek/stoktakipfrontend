import { StockHistoryModule } from './stockhistory.module';

describe('StockHistoryModule', () => {
  let stockhistoryModule: StockHistoryModule;

  beforeEach(() => {
    stockhistoryModule = new StockHistoryModule();
  });

  it('should create an instance', () => {
    expect(stockhistoryModule).toBeTruthy();
  });
});
