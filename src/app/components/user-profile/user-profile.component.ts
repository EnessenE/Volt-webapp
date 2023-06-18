import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'src/app/classes/account';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  user!: Account;

  constructor(private route: ActivatedRoute, private websocketService: WebsocketService) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      console.log(params);
      var id = params['id'];
      this.user = await this.websocketService.invoke("GetUser", id);
    });
  }
}
