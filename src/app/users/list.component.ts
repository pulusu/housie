import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    userslist = null;
 
    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe((users:any) =>{
                this.userslist = users;
                //console.log(this.users);
              
            }   );
    }

    deleteUser(id: string) {
        const user = this.userslist.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => this.userslist = this.userslist.filter(x => x.id !== id));
    }
}