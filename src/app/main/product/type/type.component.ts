import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css'],
})
export class TypeComponent extends BaseComponent implements OnInit {
  public types: any;
  public type: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  submitted = false;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tenloai': ['']
    });
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/itemgroupadmin/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.types = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/itemgroupadmin/search',{page: this.page, pageSize: this.pageSize, tenloai: this.formsearch.get('tenloai').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.types = res.data;
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
        let tmp = {
           tenloai:value.tenloai,
           mota:value.mota,
          };
        this._api.post('/api/itemgroupadmin/create-itemgroup',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
    } else { 
        let tmp = {
           tenloai:value.tenloai,
           mota:value.mota,
           maloai:this.type.maloai,          
          };
        this._api.post('/api/itemgroupadmin/update-itemgroup',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/itemgroupadmin/delete-itemgroup',{maloai:row.maloai}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.type = null;
    this.formdata = this.fb.group({
      'tenloai': ['', Validators.required],
      'mota': [''],
    }, {
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.type = null;
    setTimeout(() => {
      $('#createTypeModal').modal('toggle');
      this.formdata = this.fb.group({
        'tenloai': ['', Validators.required],
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
      $('#createTypeModal').modal('toggle');
      this._api.get('/api/itemgroupadmin/get-by-id/'+ row.maloai).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.type = res; 
          this.formdata = this.fb.group({
            'tenloai': [this.type.tenloai, Validators.required],
            'mota': [this.type.mota],
          }, {
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createTypeModal').closest('.modal').modal('hide');
  }
}
