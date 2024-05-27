import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
user: any
displayedColumns: string[] = [ 'name', 'email'];
dataSource:any;

  constructor(private UserService: UserService){
    this.GetUsers()
  }

  GetUsers(){
    this.UserService.GetUser().subscribe(
      (data:any)=> {
        this.user=data.User
        console.log(this.user)
      },
      (error)=>{
        console.log(error);
        
      }
      
    )
  }
  
}
