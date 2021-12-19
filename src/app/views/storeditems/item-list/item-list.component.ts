import { StockService } from 'src/app/shared/services/stock.service';
import { ItemkindService } from 'src/app/shared/services/itemkind.service';
import { ItemtypeService } from 'src/app/shared/services/itemtype.service';
import { BrandService } from './../../../shared/services/brand.service';
import { DataLayerService } from './../../../shared/services/data-layer.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ItemService } from 'src/app/shared/services/item.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { UserService } from 'src/app/shared/services/user.service';
import * as XLSX from 'xlsx';

import { Router } from '@angular/router';
import { columnsByPin, id } from '@swimlane/ngx-datatable/release/utils';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
    @media screen {
        .modal-adaptive  .modal-lg {
            width: 50% !important;
            max-width: calc(50%);
        }
        `]
})

export class ItemListComponent implements OnInit {
    product : any = {};
    records: any[]
    itemForm: FormGroup;
    filterForm: FormGroup;
    variantForm: FormGroup;
    item: any = {};
    brands: any[];
    filter: any = {};
    storedItemDetail: any = {};
    editMode = false;
    newVariant : Variant = new Variant();
    filterOpen = false;
    categories : any = [];
    itemKinds : any = [];
    itemTypes : any = [];
    newSpecification : Specification;
    public loading;
    public name = '';
    itemHistories: any[] = [];
    category : any = {};
    showCategoryFields = false;
    public catMandatoryFields : any [] = [];
    data : any [];
    //pagination
    public isLastPage : Boolean;
    public pageSize = 0;
    public totalPages = 0;
    public totalCount = 0;
    public currentPage = 1;
    public userData: any={};
    public titles : any []= [];
    public requiredFieldTitles : any []= [];
    modalReference: NgbModalRef;

    constructor(
        private dl: DataLayerService,
        private itemService: ItemService,
        private brandService: BrandService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private stockService : StockService,
        private itemkindService : ItemkindService,
        private itemtypeService : ItemtypeService,
        private categoryService : CategoryService,
        private _fb: FormBuilder,
        private router: Router,
        private userService:UserService,
        public datepipe: DatePipe
    ) { 
        

        this.itemForm = this._fb.group({
            name: [''], // ürün adı
            serialNumber:['',[Validators.required]], // seri no
            barcode:[''], // ürün barkodu
            description:[''], // ürün açıklaması
            brandId:['',[Validators.required]], // marka adı
            categoryId: ['',[Validators.required]], // kategori adı
            itemTypeId: ['',[Validators.required]],
            itemKindId: ['',[Validators.required]],
            isSingular : false,
            usingVariants: false
          });
    }

    ngOnInit() {
        this.filter.pageCount = 20;
        this.filter.pageIndex = 1;
         var id = JSON.parse(localStorage.getItem('user')).id;
         this.userService.getUser(id).subscribe(res=>{
             this.userData=res.entity;
             //console.log(this.userData);
         })
         
        this.loadItems();
        this.getBrands();
        this.getCategories();
    }
    printToExcel(){
        var printData = <any>[];
        let excelData = [];
        var storedItem = <any>[];
        storedItem.push("Ürün Adı");
        storedItem.push("Seri No");
        storedItem.push("Barkod");
        storedItem.push("Tekil Ürün?");
        storedItem.push("Varyantlı?");
        storedItem.push("Ürün Açıklaması");
        storedItem.push("Marka");
        storedItem.push("Kategori");
        storedItem.push("Oluşturulma Tarihi");
        storedItem.push("Son Güncelleme Tarihi"); 
        
        this.records.forEach( element => {
            var specifications = JSON.parse(element.specifications);
            if(specifications){
                specifications.forEach( field => {
                    if(!this.titles.includes(field.text)){
                        this.titles.push(field.text);
                    }
                });
            }
            var requiredFields = JSON.parse(element.requiredFieldValues);
            if(requiredFields){
                requiredFields.forEach( field => {
                    if(!this.requiredFieldTitles.includes(field.name)){
                        this.requiredFieldTitles.push(field.name);
                    }
                });
            }
        });
        
        //this.titles = this.titles.reverse();
        for (var i = 0; i < this.titles.length ; i++) {
            storedItem[this.titles[i]] = this.titles[i];
        }
        /* this.records.forEach( element => {
            var requiredFields = JSON.parse(element.requiredFieldValues);
            if(requiredFields){
                requiredFields.forEach( field => {
                    if(!this.requiredFieldTitles.includes(field.name)){
                        this.requiredFieldTitles.push(field.name);
                    }
                });
            }
        }); */
        for (var i = 0; i < this.requiredFieldTitles.length ; i++) {
            storedItem[this.requiredFieldTitles[i]] = this.requiredFieldTitles[i];
        }
        //this.requiredFieldTitles = this.requiredFieldTitles.reverse();
        printData.push(storedItem); 


        this.records.forEach( product => {
            storedItem = <any>[];
            storedItem.push(product.name); // ürün adı
            storedItem.push(product.serialNumber);
            storedItem.push(product.barcode);

            if(product.isSingular == true){
                storedItem.push("Evet");
            }else{
                storedItem.push("Hayır");
            }
            if(product.isUsingVariants == true){
                storedItem.push("Evet");
            }else{
                storedItem.push("Hayır");
            }
            storedItem.push(product.description);
            storedItem.push(product.brand.name);

            storedItem.push(product.category.name);
            storedItem.push(this.datepipe.transform(product.createdDateTime, 'dd/MM/yyyy'));
            storedItem.push(this.datepipe.transform(product.updatedDateTime, 'dd/MM/yyyy'));

           
            
            var specifications = JSON.parse(product.specifications);
            if(specifications){
                for( var i = 0 ; i < specifications.length ; i++){

                    for( var y = 0; y < this.titles.length ; y ++){

                        if(specifications[i].text == this.titles[y]){
                            storedItem[this.titles[y]] = specifications[i].value;
                        }
                    }
                }
            }
            var requiredFields = JSON.parse(product.requiredFieldValues);
            if(requiredFields){
                for( var i = 0 ; i < requiredFields.length ; i++){

                    for( var y = 0; y < this.requiredFieldTitles.length ; y ++){

                        if(requiredFields[i].name == this.requiredFieldTitles[y]){
                            storedItem[this.requiredFieldTitles[y]] = requiredFields[i].value;
                        } else {
                        }
                    }
                }
            }
            printData.push(storedItem);
        });
        function ec(r, c){
            return XLSX.utils.encode_cell({r:r,c:c});
        }
        function delete_row(ws, row_index){
            var variable = XLSX.utils.decode_range(ws["!ref"])
            for(var R = row_index; R < variable.e.r; ++R){
              for(var C = variable.s.c; C <= variable.e.c; ++C){
                ws[ec(R,C)] = ws[ec(R+1,C)];
              }
            }
            variable.e.r--
            ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
        }
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(printData);
            
                    /* generate workbook and add the worksheet */
                    const wb: XLSX.WorkBook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                    delete_row(ws, 0)
                    XLSX.writeFile(wb, 'urunler.xlsx');
    }

    deleteVariant(index){
        if(this.item.variants.length >= index){
            this.item.variants.splice(index,1);
        }
    }
    filterProduct(){
        this.filter.pageCount = null;
        this.filter.pageIndex = null;
        this.loading = true;
        this.itemService.getItems(this.filter).subscribe(res => {

                this.loading = false;
                this.records = res.entities;
                this.currentPage = res.meta.basePaginationModel.currentPage;
                this.isLastPage = res.meta.basePaginationModel.isLastPage;
                this.totalPages = res.meta.basePaginationModel.totalPages;
                this.totalCount = res.meta.basePaginationModel.totalCount;
                //console.log(this.records);
                
            },
            (error: Response) => {
                this.loading = false;
                if(error.status === 401){
                    this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                    localStorage.removeItem('Token');
                    this.router.navigateByUrl('/sessions/signin');
                } else {
                    this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                }
            })
    }
    clearFilter(){
        this.filter = {};
        this.filter.pageCount = 20;
        this.filter.pageIndex = 1;
        this.loadItems();
    }

    delete(index){
        if(index!=0){
            this.newVariant.variantParams.splice(index,1);
        }
    }

    addVariantFields(init){
        if(!this.newVariant){
            this.newVariant = new Variant();
        }

        if(!this.newVariant.variantParams){
            this.newVariant.variantParams = [];
        }

        if(init){
            if(this.newVariant.variantParams.length == 0){
                this.newVariant.variantParams.push({
                    text: '',
                    value: '',
                 });
            }
        }else{
            this.newVariant.variantParams.push({
                text: '',
                value: '',
             });
        }
        
    }

    saveVariant(){
        if(!this.item.variants){
            this.item.variants = [];
        }
        
        this.item.variants.push(this.newVariant);
        this.newVariant = new Variant();
        this.addVariantFields(true);
    }

    loadItems() {
        this.loading = true;
        this.itemService.getItems(this.filter).subscribe(res => {
                this.loading = false;
                this.records = res.entities;
                this.currentPage = res.meta.basePaginationModel.currentPage;
                this.isLastPage = res.meta.basePaginationModel.isLastPage;
                this.totalPages = res.meta.basePaginationModel.totalPages;
                this.totalCount = res.meta.basePaginationModel.totalCount;
                
            },
            (error: Response) => {
                this.loading = false;
                if(error.status === 401){
                    this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                    localStorage.removeItem('Token');
                    this.router.navigateByUrl('/sessions/signin');
                } else {
                    this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                }
            })
    }

    getBrands(){
        this.loading = true;
        this.brandService.getBrands().subscribe(result =>{
            this.loading = false;
            this.brands = result;
        },
        (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                localStorage.removeItem('Token');
                this.router.navigateByUrl('/sessions/signin');
            } else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        });
    }

    getCategories(){
        this.loading = true;
        this.categoryService.getCategories().subscribe(result => {
            if(result.meta.isSuccess == true){
                this.loading = false;
                this.categories = result.entities;
            }else{
                this.toastr.error('Hata!', result.meta.errorMessage, { timeOut: 5000 });
            }
		},
        (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                localStorage.removeItem('Token');
                this.router.navigateByUrl('/sessions/signin');
            } else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        })

        this.itemkindService.getall().subscribe(result => {
            if(result.meta.isSuccess == true){
                this.itemKinds = result.entities;
            }else{
                this.toastr.error('Hata!', result.meta.errorMessage, { timeOut: 5000 });
            }
        },
        (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                localStorage.removeItem('Token');
                this.router.navigateByUrl('/sessions/signin');
            } else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        })

        this.itemtypeService.getall().subscribe(result => {
            //console.log('result',result);
            if(result.meta.isSuccess == true){
                //console.log('isSuccess',true);
                this.itemTypes = result.entities;
                //console.log('itemTypes', this.itemTypes);
            }else{
                this.toastr.error('Hata!', result.meta.errorMessage, { timeOut: 5000 });
            }
        },
        (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                localStorage.removeItem('Token');
                this.router.navigateByUrl('/sessions/signin');
            } else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        })
    }

    getCategoryFields(id){
        this.catMandatoryFields = [];
        this.categoryService.getCategory(id).subscribe( 
            result => {
                    this.category = result.entity;
                        if(this.category.mandatoryFields.length > 0){
                            this.category.mandatoryFields.forEach(element => {
                            if (element.isRequiredOnDefinition) {
                                element.value = '';
                                this.catMandatoryFields.push(element);
                                
                            }
                        });
                    }
        })
    }
    /*showCat(){
       console.log("sda", this.catMandatoryFields);
    }*/
    openItemModal(newItem){
        this.reset();
        this.modalReference = this.modalService.open(newItem, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
          });

    }
    reset(){
        this.addSpecification();
        this.item = {};
        this.editMode = false;
        this.item.usingVariants = false;
        this.item.isSingular = true;
        this.catMandatoryFields = [];
    }

    saveItem(){
        console.log("item", this.item);
        if(this.itemForm.valid){
            this.loading = true;
            this.item.requiredFieldValues = this.catMandatoryFields;
            if(!this.item.createdUserId){
                this.itemService.createItem(this.item).subscribe(result => {
                    if(result.meta.isSuccess == true){
                        this.loading = false;
                        this.item = {};
                        this.loadItems();
                        this.modalReference.close();
                        this.toastr.success('Ürün Oluşturuldu!', 'Başarılı!', { timeOut: 3000 });
                    }else{
                        this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
                        if(result.meta.error === 'authority.error'){
    
                            this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen tekrar giriş yapınız !', 'Error!', { timeOut: 4000 });
                            localStorage.removeItem('Token');
                            this.router.navigateByUrl('/sessions/signin');
                        }
                    }
                },
                (error: Response) => {
                    this.loading = false;
                    if(error.status === 401){
                        this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                        localStorage.removeItem('Token');
                        this.router.navigateByUrl('/sessions/signin');
                    } else {
                        this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                    }
                })
            }else if(this.item.createdUserId){
                
                this.itemService.updateItem(this.item).subscribe(result => {
                    if(result.meta.isSuccess === true){
                        this.loading = false;
                        this.loadItems();
                        this.modalReference.close();
                        this.toastr.success('Ürün Güncellendi!', 'Başarılı!', { timeOut: 3000 });
                    } else {
                        this.loading = false;
                        this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
                        if(result.meta.error === 'authority.error'){
                            this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen tekrar giriş yapınız !', 'Error!', { timeOut: 4000 });
                            localStorage.removeItem('Token');
                            this.router.navigateByUrl('/sessions/signin');
                        }
                    }
                    
                },
                (error: Response) => {
                    this.loading = false;
                    if(error.status === 401){
                        this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                        localStorage.removeItem('Token');
                        this.router.navigateByUrl('/sessions/signin');
                    } else {
                        this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                    }
                })

            }
            
         } else {
            this.validateAllFormFields(this.itemForm);
         }
    }


    isFieldValidForms(field: string) {
        return !this.itemForm.get(field).valid && this.itemForm.get(field).touched;
    }


    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }
        
       

    /* addNewItem(newItem){
        
        this.modalService.open(newItem, {size: 'lg', windowClass: 'modal-adaptive'})
        .result.then((result) => {
            this.loading = true;
            this.item.requiredFieldValues = this.catMandatoryFields;
            this.itemService.createItem(this.item).subscribe(item => {
                if(item.meta.isSuccess == true){
                    this.loadItems();
                    this.loading = false;
                }else{
                    this.toastr.error('HATA!', item.meta.errorMessage, { timeOut: 5000 });
                    if(result.meta.error === 'authority.error'){

                        this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen tekrar giriş yapınız !', 'Error!', { timeOut: 4000 });
                        localStorage.removeItem('Token');
                        this.router.navigateByUrl('/sessions/signin');
                    }
                }
            },
            (error: Response) => {
                this.loading = false;
                if(error.status === 401){
                    this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                    localStorage.removeItem('Token');
                    this.router.navigateByUrl('/sessions/signin');
                } else {
                    this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                }
            })
        }, (reason) => {
        });
    } */

    getDetail(row, detailModal){
        this.loading = true;
        this.data = [];
        this.stockService.getStockHistories(this.filter).subscribe(result => {
            //console.log(result);
            this.data = result.entities;
            this.itemHistories = [];
            this.data.forEach(element => {
                if(element.itemId == id){
                    this.itemHistories.push(element);
                    //console.log("histories", this.itemHistories);
                }
            });
            
            
        })
        this.itemService.getItem(row.serialNumber, row.brandId).subscribe(item => {
            this.storedItemDetail = item.entity;
            //console.log(this.storedItemDetail);
            this.loading = false;
        },
        (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                localStorage.removeItem('Token');
                this.router.navigateByUrl('/sessions/signin');
            } else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        });
        this.modalService.open(detailModal, { size:'lg', ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
            }, (reason) => {
            });
    }
    updateItem(row, updateItemModal){
        this.catMandatoryFields = [];
        this.itemService.getItem(row.serialNumber, row.brandId).subscribe(item => {
            this.item = item.entity;
            // kategori zorunlu alanların güncellenmesi için
            if(this.item.requiredFieldValues){
                this.catMandatoryFields = this.item.requiredFieldValues;
                //console.log("item", this.catMandatoryFields);
            }
            
        })
        
        this.addVariantFields(true);
        this.addSpecification();// ürün özellik ekleme alanının gelmesi için ekledim.
        this.modalReference = this.modalService.open(updateItemModal, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
        });
        this.editMode = true;
    }
    deleteItem(item, modal) {
        //console.log(id)
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
                this.loading = true;
                this.itemService.deleteItem(item)
                    .subscribe(result => {
                        if(result.meta.isSuccess === true){
                            this.loading = false;
                            this.toastr.success('Ürün Silindi!', 'Başarılı!', { timeOut: 3000 });
                            this.loadItems();
                        } else {
                            this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
                            if(result.meta.error === 'authority.error'){
                                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen tekrar giriş yapınız !', 'Error!', { timeOut: 4000 });
                                localStorage.removeItem('Token');
                                this.router.navigateByUrl('/sessions/signin');
                            }
    
                        }
                    },
                    (error: Response) => {
                        this.loading = false;
                        if(error.status === 401){
                            this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                            localStorage.removeItem('Token');
                            this.router.navigateByUrl('/sessions/signin');
                        } else {
                            this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
                        }
                    })
            }, (reason) => {
            });
    }

    toggle() {
        if(!this.item.usingVariants || this.item.usingVariants === undefined || this.item.usingVariants === false){
            this.item.usingVariants = true;
            this.addVariantFields(true);
            this.item.isSingular = false;
            
        }else{
            this.item.usingVariants = false;
            this.item.variants = [];
            //this.item.isSingular = true;
        }
       
    }
    toggleSingularCheckbox(){
        if(!this.item.isSingular || this.item.isSingular === undefined || this.item.isSingular === false){
            this.item.isSingular = true;
            this.item.usingVariants = false;
            
        }else{
            this.item.isSingular = false;
        }
    }
    addSpecification(){
        if(!this.newSpecification){
            this.newSpecification = new Specification();
        }
            this.newSpecification.text = '';
            this.newSpecification.value = '';
    }
    saveSpecification(){
        if(!this.item.specifications){
            this.item.specifications = [];
        }
        
        this.item.specifications.push(this.newSpecification);
        //console.log(this.item.specifications);
        this.newSpecification = new Specification();
        this.addSpecification();
        //console.log(this.item)
    }
    deleteSpecification(index){
        if(this.item.specifications.length >= index){
            this.item.specifications.splice(index,1);
        }
    }

}

export class Variant {
    variantParams : VariantParams[];
    barcode : '';
    gtin : '';
}

export class VariantParams {
    text: string;
    value: string;
}
export class Specification {
    text: string;
    value: string;
}
