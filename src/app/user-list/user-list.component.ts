import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ApiService } from '../api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'exads-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) 
    paginator: MatPaginator;
  @ViewChild('sortUserList', { static: false }) 
    sortUserList = new MatSort();

  constructor(
    private apiService:ApiService,
    private router: Router
  ) { }

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["username", "full_name", "email", "id_status", "created_date"]
  usersList: any = [];
  selectedPageSize: string = "20";

  ngOnInit() {
    this.getUsers();
  }

  ngAfterViewInit() {    
    this.dataSource.sort = this.sortUserList;
  }

  getUsers(): void {
    this.apiService.getUsers().subscribe(data =>{
      this.usersList = data["data"];
      this.dataSource.data = this.usersList.users;
      this.dataSource.paginator = this.paginator;
    }); 
  }

  setPageSize(event): void {
    if(event){
      this.selectedPageSize = event;
      setTimeout(() =>{
        this.dataSource.paginator = this.paginator;
      },1000);
    }
  }

  createNewUser(): void{
    this.router.navigate(['users/create-user']);
  }
}
