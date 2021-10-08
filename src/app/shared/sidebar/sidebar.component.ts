import { Component, OnInit } from '@angular/core';
declare let $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public menus = [
    {name :'Người dùng', url:'',icon:'user',childs:[{name:'Quản lý người dùng',url:'user/user'}]},
    {name:'Hàng hóa',url:'',icon:'list',childs:[{name:'Quản lý loại sản phẩm',url:'/product/type'},{name:'Quản lý sản phẩm',url:'/product/product'}]}];
  constructor() { } 
  ngOnInit(): void {
  }
}
