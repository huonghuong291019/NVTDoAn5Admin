import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent extends BaseComponent implements OnInit {
  public products: any;
  public product: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  types:any;
  public uploadedFiles: any[] = [];
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tencaycanh': ['']
    });
    this._api.get('/api/itemgroup/get-menu').takeUntil(this.unsubscribe).subscribe(res => {
      this.types = res;
    });  
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/itemadmin/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/itemadmin/search',{page: this.page, pageSize: this.pageSize, tencaycanh: this.formsearch.get('tencaycanh').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
           hinhanh:data_image,
           tencaycanh:value.tencaycanh,
           maloai:value.maloai,
           gia:parseInt(value.gia),
           soluong:parseInt(value.soluong),
           cachchamsoc:value.cachchamsoc,
           chieucao:value.chieucao,
           ynghia:value.ynghia,
           mota:value.mota,
          };
        this._api.post('/api/itemadmin/create-item',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
        });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          hinhanh:data_image,
          tencaycanh:value.tencaycanh,
          maloai:value.maloai,
          gia:parseInt(value.gia),
          soluong:parseInt(value.soluong),
          cachchamsoc:value.cachchamsoc,
          chieucao:value.chieucao,
          ynghia:value.ynghia,
          mota:value.mota,
          macaycanh:this.product.macaycanh,          
          };
        this._api.post('/api/itemadmin/update-item',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
        });
        }
  } 

  onDelete(row) { 
    this._api.post('/api/itemadmin/delete-item',{macaycanh:row.macaycanh}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.product = null;
    this.formdata = this.fb.group({
      'tencaycanh': ['', Validators.required],
      'hinhanh': [''],
      'maloai': [''],
      'gia': [''],
      'soluong': [''],
      'cachchamsoc': [''],
      'chieucao': [''],
      'ynghia': [''],
      'mota': [''],
    }, {
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.product = null;
    setTimeout(() => {
      $('#createProductModal').modal('toggle');
      this.formdata = this.fb.group({
        'tencaycanh': ['', Validators.required],
        'hinhanh': [''],
        'maloai': [''],
        'gia': [''],
        'soluong': [''],
        'cachchamsoc': [''],
        'chieucao': [''],
        'ynghia': [''],
        'mota': [''],
      }, {
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createProductModal').modal('toggle');
      this._api.get('/api/itemadmin/get-by-id/'+ row.macaycanh).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.product = res; 
          this.formdata = this.fb.group({
            'tencaycanh': [this.product.tencaycanh, Validators.required],
            'hinhanh': [this.product.hinhanh],
            'maloai': [this.product.maloai],
            'gia': [this.product.gia],
            'soluong': [this.product.soluong],
            'cachchamsoc': [this.product.cachchamsoc],
            'chieucao': [this.product.chieucao],
            'ynghia': [this.product.ynghia],
            'mota': [this.product.mota],
          }, {
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createProductModal').closest('.modal').modal('hide');
  }
}
