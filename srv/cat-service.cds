using app.ariba2hc as app from '../db/data-model';

service CatalogService {
   entity Orders as projection on app.Orders;
}
