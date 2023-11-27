using app.ariba2hc as app from '../db/data-model';

service OrderHeader {
   entity Orders as projection on app.Orders; 
}

service OrderItem {
     entity Items as projection on app.Items;   

}
