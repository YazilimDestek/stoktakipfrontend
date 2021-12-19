export class StockHistoryDB {
    static stockHistories = [
        {
            id: '1',
            barcode:' 1234343',
            fromLocationId: '1',
            fromLocationName: 'Kiza',
            toLocationId: '2',
            toLocationName: 'Ankara',
            transTypeId: 'Yeni Giriş',
            indexValue:'10',
            stockTransferDate: '10/10/2019',
            brandName: 'Eca',
            catName: 'G4',
            attachment: {
                "image1": "./assets/images/products/headphone-4.jpg"
              }
        },
        {
            id: '2',
            barcode:' 5645645',
            fromLocationId: '1',
            fromLocationName: 'Kiza',
            toLocationId: '4',
            toLocationName: 'Adana',
            transTypeId: 'Sökme',
            indexValue:'13',
            stockTransferDate: '10/10/2019',
            brandName: 'Kale Kalıp',
            catName: 'B25N',
            attachment: {
                "image1": "./assets/images/products/headphone-4.jpg"
              }
        },
        {
            id: '3',
            barcode:' 978765',
            fromLocationId: '3',
            fromLocationName: 'Kütahya',
            toLocationId: '2',
            toLocationName: 'Ankara',
            transTypeId: 'Tamir & Bakım ve Kalibrasyon',
            indexValue:'12',
            stockTransferDate: '10/10/2019',
            brandName:'Alfagas',
            catName: 'U10',
            requiredFields : [{
                index: '4234.44',
            }, 
            ],
            attachment: {
                "image1": "assets/images/Capture1.JPG"
              }
        }
    ]
    static uploadFiles =[]
}