import { BrandService } from 'src/app/shared/services/brand.service';
import { CategoryService } from './../../shared/services/category.service';
import { Utils } from './../../shared/utils';
import { LocationService } from './../../shared/services/location.service';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { EChartOption } from 'echarts';
import { echartStyles } from '../../shared/echart-styles';
import { StockService } from 'src/app/shared/services/stock.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbDate, NgbCalendar, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
	selector: 'stockhistory',
	templateUrl: './stockhistory.component.html',
	styles: []
})
export class StockHistoryComponent implements OnInit {
	itemRequiredFieldTitles: any [] = [];
	titles: any [] = [];
	stockHistories : any [];
	categories : any [];
	transTypes : any [];
	stockTransferDetail: any = {};
	locations : any [];
	brands : any [];
	stock: any = {};
	filter: any = {};
	stockForm: FormGroup;
	filterForm: FormGroup;
	url: string;
	file: File = null;
	search: any = {};
	resultList : any []= [];
	selectedItem = [];
	selectedVariant = [];
	SelectionType = SelectionType;
	selectedItemDetail;
	selectedItemVariantDetail;
	viewMode: boolean = false;
	public loading;
	selectedItemVariants : any [];
	selectedItemVariantsList: any [] = [];
	variantMode: boolean = false;
	showStockCard: boolean = false;
	variantId;
	public serialNumber: '';
	public brandId: number;
	categoryId;
	catMandatoryFields : any [] = [];
	category : any = {};
	fileName: string;
	public filterOpen = false ;
	public userData: any = {};
	model;
	transType: any = {};
	messages = {
		emptyMessage: `Veri Bulunmamaktadır`
	}
	//pagination
    public isLastPage : Boolean;
    public pageSize = 0;
    public totalPages = 0;
    public totalCount = 0;
    public currentPage = 1;
	modalReference : NgbModalRef;
	constructor(
		private stockHistoryService :StockService,
		private categoryService : CategoryService,
		private locationService : LocationService,
		private brandService : BrandService,
		private modalService: NgbModal,
		private _fb: FormBuilder,
		calendar: NgbCalendar,
		private  router: Router,
		private toastr: ToastrService,
		private userService:UserService
	) { 
		this.stockForm = this._fb.group({
			serialNumber:[''],
			brandId:[0],
			itemVariantId:[0],
			fromLocationId:[0],
			locationId:[0, Validators.required],
			transTypeId: [0, Validators.required],
			qty:[0]
		});
		
		this.filter.stockStartDate = calendar.getPrev(calendar.getToday(), 'd', 10);
		this.filter.stockEndDate = calendar.getToday();
		
		
	}

	ngOnInit() {
		this.filter.pageSize = 20;
        this.filter.page = 1;
		this.LoadData(this.filter);
		var id = JSON.parse(localStorage.getItem('user')).id;
         this.userService.getUser(id).subscribe(res=>{
             this.userData=res.entity;
         })
	}

	filterStockHistory(){
		this.filter.page = null;
		this.filter.pageSize = null;
		//this.LoadData(this.filter);
		this.getStockHistories();
		
	}
	getStockHistories(){
		this.loading = true;
		var startPass = this.filter.stockStartDate;
		var endPass = this.filter.stockEndDate;
		this.filter.stockStartDate = Utils.ngbDateToDate(this.filter.stockStartDate);
		this.filter.stockEndDate = Utils.ngbDateToDate(this.filter.stockEndDate);
		this.stockHistoryService.getStockHistories(this.filter).subscribe(result => {
			this.loading = false;
			this.filter.stockStartDate = startPass;
			this.filter.stockEndDate = endPass;
			if(result.meta.isSuccess == true){
				this.stockHistories = result.entities;
				this.stockHistories.forEach(item => {
					if(item.itemRequiredFields){
						item.itemRequiredFields.forEach(itemField => {
							if(!this.itemRequiredFieldTitles.includes(itemField.name)){
								this.itemRequiredFieldTitles.push(itemField.name);
								
							}
						});
					}
					this.itemRequiredFieldTitles = this.itemRequiredFieldTitles.sort();
					
					item.requiredFields.forEach(field => {
						if(!this.titles.includes(field.name)){
							this.titles.push(field.name);
						}
					});
				});
				this.titles = this.titles.sort();
				this.currentPage = result.meta.basePaginationModel.currentPage;
                this.isLastPage = result.meta.basePaginationModel.isLastPage;
                this.totalPages = result.meta.basePaginationModel.totalPages;
				this.totalCount = result.meta.basePaginationModel.totalCount;
			}else{
				this.toastr.error(result.meta.errorMessage, 'Hata!', { timeOut: 3000 });
			}

		}, (error: Response) => {
			this.loading = false;
			this.filter.stockStartDate = startPass;
			this.filter.stockEndDate = endPass;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Hata!', { timeOut: 3000 });
				localStorage.removeItem('Token');
				this.router.navigateByUrl('/sessions/signin');
            }else {
                this.toastr.error('İnternet bağlantınızı kontrol ederek tekrar deneyiniz.', 'Hata!', { timeOut: 3000 });
            }
        })
		
	}
	resetSearch(){
		this.showStockCard = false;
		this.resultList = [];
		this.selectedItem = [];
		this.selectedVariant = [];
		this.catMandatoryFields = [];
		this.selectedItemVariantsList = [];
		this.selectedItemDetail = {};
		this.selectedItemVariantDetail = {};
	}
	searchItem(){
		this.resetSearch();
		this.stockHistoryService.searchItem(this.search).subscribe( result => {
			    this.resultList = [];
				if(result.entities){
					if(result.entities.length == 0){
						this.toastr.warning('Stok Bulunamadı!', 'Bilgi', { timeOut: 3000, closeButton: true, progressBar: true });
					}else{
						this.resultList = result.entities.map(row => ({
							serialNumber: row['serialNumber'],
							brandId: row['brandId'],
							brand: row['brand'],
							isSingular: row['isSingular'],
							brandName: row['brand']['name'],
							name: row['name'],
							categoryName: row['category']['name']
						  }));
					}
				}
		})
	}
	onSelectItem(event) {
		this.selectedItemDetail = event.selected[0];
		this.selectedItem = [];
		//this.viewMode = false;
		this.resultList = [];
		//console.log("item Detail",this.selectedItemDetail);
		this.serialNumber = this.selectedItemDetail.serialNumber;
		this.brandId = this.selectedItemDetail.brandId;
		this.categoryId = this.selectedItemDetail.categoryId;
		this.getCategoryFields(this.categoryId);// kategori ek alanları
		if(this.selectedItemDetail.isUsingVariants === true){
			let id = this.selectedItemDetail.id;
			this.stockHistoryService.searchItemVariants(id).subscribe( result => {
				
				this.selectedItemVariantsList = result.entities;
				//console.log("variantList",this.selectedItemVariantsList);
				//this.variantMode = true;
				this.showStockCard = false;
			})

		} else {
			this.showStockCard = true;
		}
	  }
	  
	getCategoryFields(id){
		  if(id){
			this.catMandatoryFields = [];
			this.categoryService.getCategory(id).subscribe( 
				result => {
						this.category = result.entity;
							if(this.category.mandatoryFields.length > 0){
								this.category.mandatoryFields.forEach(element => {
								if (element.isRequiredOnMove) {
									element.value = '';
									this.catMandatoryFields.push(element);
									
								}
							});
						}
						//console.log("categoryFields",this.catMandatoryFields);
			})
		  }
    }
	onSelectItemVariant(event) {
		this.selectedItemVariantDetail = event.selected[0];
		//console.log("variant Detail",this.selectedItemVariantDetail);
		this.variantId = this.selectedItemVariantDetail.id;
		this.showStockCard = true;
		//this.variantMode = false;
		this.selectedItemVariantsList = [];
		
	  }
	getValueDocumentRequired(id){
		this.stockHistoryService.getStockTransType(id).subscribe(result => {
			this.transType = result.entity;
        }, (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
                localStorage.removeItem('Token');
                this.router.navigateByUrl('/sessions/signin');
            }else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        })
	}
	
	LoadData(filter){
		this.loading = true;
		var startPass = this.filter.stockStartDate;
		var endPass = this.filter.stockEndDate;
		this.filter.stockStartDate = Utils.ngbDateToDate(this.filter.stockStartDate);
		this.filter.stockEndDate = Utils.ngbDateToDate(this.filter.stockEndDate);
		this.stockHistoryService.getStockHistories(filter).subscribe(result => {
			this.loading = false;
			this.filter.stockStartDate = startPass;
			this.filter.stockEndDate = endPass;
			if(result.meta.isSuccess == true){
				this.stockHistories = result.entities;
				this.stockHistories.forEach(item => {
					if(item.itemRequiredFields){
						item.itemRequiredFields.forEach(itemField => {
							if(!this.itemRequiredFieldTitles.includes(itemField.name)){
								this.itemRequiredFieldTitles.push(itemField.name);
								
							}
						});
					}
					this.itemRequiredFieldTitles = this.itemRequiredFieldTitles.sort();
					
					item.requiredFields.forEach(field => {
						if(!this.titles.includes(field.name)){
							this.titles.push(field.name);
						}
					});
				});
				this.titles = this.titles.sort();
				this.currentPage = result.meta.basePaginationModel.currentPage;
                this.isLastPage = result.meta.basePaginationModel.isLastPage;
                this.totalPages = result.meta.basePaginationModel.totalPages;
				this.totalCount = result.meta.basePaginationModel.totalCount;
			}else{
				this.toastr.error(result.meta.errorMessage, 'Hata!', { timeOut: 3000 });
			}

		}, (error: Response) => {
			this.loading = false;
			this.filter.stockStartDate = startPass;
			this.filter.stockEndDate = endPass;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Hata!', { timeOut: 3000 });
				localStorage.removeItem('Token');
				this.router.navigateByUrl('/sessions/signin');
            }else {
                this.toastr.error('İnternet bağlantınızı kontrol ederek tekrar deneyiniz.', 'Hata!', { timeOut: 3000 });
            }
        })
		this.locationService.getLocations().subscribe(results =>{
			 this.locations = results;
			 
		}, (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
				localStorage.removeItem('Token');
				this.router.navigateByUrl('/sessions/signin');
            }else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        });
		this.stockHistoryService.getStockTransTypes().subscribe(result => {
			this.transTypes = result;
			
		}, (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
				localStorage.removeItem('Token');
				this.router.navigateByUrl('/sessions/signin');
            }else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        });
		this.categoryService.getCategories().subscribe(result => {
			
			if(result.meta.isSuccess == true){
                
                this.categories = result;
            }else{
               this.toastr.error('Kategori!', result.meta.errorMessage, { timeOut: 5000 });
            }
		}, (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
				localStorage.removeItem('Token');
				this.router.navigateByUrl('/sessions/signin');
            }else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        });
		this.brandService.getBrands().subscribe(result => {
			this.brands = result;
			
		}, (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
				localStorage.removeItem('Token');
				this.router.navigateByUrl('/sessions/signin');
            }else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
        })
	}
	getDetail(id, detailModal){
		this.loading = true;
        this.stockHistoryService.getStockHistory(id).subscribe(result => {
			this.stockTransferDetail = result.entity;
			this.loading = false;
			//console.log("stockHistoryDetail",this.stockTransferDetail);
		}, (error: Response) => {
            this.loading = false;
            if(error.status === 401){
                this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
				localStorage.removeItem('Token');
				this.router.navigateByUrl('/sessions/signin');
            }else {
                this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
            }
		})
		
        this.modalService.open(detailModal, { size:'lg', ariaLabelledBy: 'modal-basic-title', centered: true })
            .result.then((result) => {
            }, (reason) => {
            });
	}

	reset(){
		this.url = '';
		this.stock = {};
		this.search = {};
		this.selectedItemDetail = {};
		this.selectedItemVariantDetail = {};
		this.showStockCard = false;
		this.resultList = [];
		this.selectedItemVariantsList = [];
		this.catMandatoryFields = [];
	}

	save(){
		this.loading = true;
		this.stock.serialnumber = this.serialNumber;
		this.stock.brandId = this.brandId;
		this.stock.variantId = this.variantId;
		this.stock.requiredFieldValues = this.catMandatoryFields; // kategori alanları 
		this.stock.documentPath = this.fileName;
        this.stockHistoryService.createStockHistory(this.stock).subscribe(result => {
			if(result.meta.isSuccess == true){
				this.loading = false;
				this.stock = {};
				this.LoadData(this.filter);
				this.modalReference.close();
			}else{
				this.toastr.error('HATA!', result.meta.errorMessage, { timeOut: 5000 });
				if(result.meta.error === 'authority.error'){
					this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen tekrar giriş yapınız !', 'Error!', { timeOut: 4000 });
					localStorage.removeItem('Token');
					this.router.navigateByUrl('/sessions/signin');
				}
			}
            this.loading = false;
		}, (error: Response) => {
			this.loading = false;
			if(error.status === 401){
				this.toastr.error('Yetkisiz işlem. İşlem yapabilmek için lütfen giriş yapınız !', 'Error!', { timeOut: 3000 });
				localStorage.removeItem('Token');
				this.router.navigateByUrl('/sessions/signin');
			}else {
				this.toastr.error('Beklenmeyen bir hata ile karşılaşıldı.Lütfen servis sağlayıcınızla görüşün !', 'Error!', { timeOut: 3000 });
			}
		});
	}

	addStockTransfer(newTransfer){
		this.reset();
        this.modalReference = this.modalService.open(newTransfer, {size: 'lg', windowClass: 'modal-adaptive'})
        this.modalReference.result.then((result) => {
            
          }, (reason) => {
            
          });
		
	}
	expandImage(modal){
        this.modalService.open(modal, {size: 'lg', windowClass: 'modal-adaptive'})
        .result.then((result) => {
        }, (reason) => {
        });
	}
	readUrl(event: any) {
        if (event.target.files && event.target.files[0]) {
            if (event.target.files[0].type === 'image/png' || event.target.files[0].type === 'image/jpeg'
             || event.target.files[0].type === 'image/jpg' ) {
                    let reader = new FileReader();
                    reader.onload = (event: any) => {
                    this.url =  event.target.result;
                    };
					reader.readAsDataURL(event.target.files[0]);
					this.file = event.target.files[0];

					const formData = new FormData();
					formData.append('file', this.file);
					this.stockHistoryService.uploadImage(formData).subscribe(
						(result:any) => {
								var response=JSON.parse(result["_body"]) 
							if(response.isSucces){
								this.fileName =response.documentPath
							}
							else {

								this.toastr.error(response.errorMessage, 'Error!', { timeOut: 3000 });
							}

					});
					
                } 
        }
	}

   
            

}
export enum SelectionType {
	single = 'single',
}