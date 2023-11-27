namespace app.ariba2hc;

entity Orders {
  key vendorId: String(50);
  documentNumber  : String(50);
  customerName  : String(500);
  supplierName :  String(500);
}
  
entity Items {
  key documentNumber  : String(50);
  quantity  : Double;
  agreementDate :  String(500);
}