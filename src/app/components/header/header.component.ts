import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Account } from 'src/app/classes/account';
import { Chat } from 'src/app/classes/chat';
import { ChatMessage } from 'src/app/classes/chat-message';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  chats: Chat[] | undefined;
  foundUsers: Account[] | undefined;

  constructor(public authService: AuthService, private chatService: ChatService, private websocketService: WebsocketService, private modalService: NgbModal) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.LoggedInActions()
    }
  }
  LoggedInActions() {


    this.websocketService.connectMethod("ReceiveChatMessage", (data: ChatMessage) => {
      console.log("New message!");
    });

    this.chatService.GetUserChats().subscribe(res => {
      this.chats = res;
      console.log(`Got ${this.chats?.length} chats`)
      console.log(this.chats);
    });;
  }

  searchBarModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  closeSearch(){
    this.foundUsers = undefined;
    this.modalService.dismissAll();

  }

  async onSearchInputChange(event: any) {
    var searchText = event.target.value;
    console.log("Searching for " + searchText)
    this.foundUsers = await this.websocketService.invoke("SearchUser", searchText);
    console.log(this.foundUsers);
    console.log("Searched for " + searchText)
  }

  logout() {
    this.authService.doLogout()
  }

}
