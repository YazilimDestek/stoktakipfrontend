import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ProductDB } from './products';
import { MailDB } from './mails';
import { CountryDB } from './countries';
import { ChatDB } from './chat-db';
import { InvoiceDB } from './invoices';
import { ItemDB } from './items';
import { LocationDB } from './location';
import { CompanyDB } from './companies';
import { ReportsDB } from './reports';
import { CategoriesDB } from './categories';
import { StockHistoryDB } from './stockHistory';
import { StockTransTypesDB } from './stockTransTypes';
import { TimeOutDB } from './timeouts';
import { BrandDB } from './brands';
import { LocationTypeDB } from './locationTypes';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    return {
      'products': ProductDB.products,
      'invoices': InvoiceDB.invoices,
      'mails': MailDB.messages,
      'countries': CountryDB.countries,
      'contacts': ChatDB.contacts,
      'chat-collections': ChatDB.chatCollection,
      'chat-user': ChatDB.user,
      'items': ItemDB.items,
      'locations': LocationDB.locations,
      'companies': CompanyDB.companies,
      'reports': ReportsDB.reports,
      'categories': CategoriesDB.categories,
      'stockHistories': StockHistoryDB.stockHistories,
      'variantParams': ItemDB.variantParams,
      'stockTransTypes': StockTransTypesDB.stockTransTypes,
      'timeouts': TimeOutDB.timeouts,
      'brands': BrandDB.brands,
      'locationTypes': LocationTypeDB.locationTypes
    };
  }
}
