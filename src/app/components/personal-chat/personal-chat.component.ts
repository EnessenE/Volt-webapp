import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Chat } from 'src/app/classes/chat';
import { ChatMessage } from 'src/app/classes/chat-message';
import { AuthService } from 'src/app/services/auth.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-personal-chat',
  templateUrl: './personal-chat.component.html',
  styleUrls: ['./personal-chat.component.scss']
})
export class PersonalChatComponent implements OnInit {
  latestMessage!: string;
  currentChat!: Chat;

  constructor(private authService: AuthService, private websocketService: WebsocketService) {

  }

  async ngOnInit(): Promise<void> {


    var data = await this.websocketService.invoke<Chat>("GetChat");
    console.log(data);
    this.currentChat = data;
    
    this.websocketService.connectMethod("ReceiveChatMessage", (data: ChatMessage) => {
      console.log(data);
      data.message = data.encryptedMessage;
      this.currentChat.messages.push(data);
    });
  }

  sendChat(): void {
    var chatMessage: ChatMessage = {
      encryptedMessage: this.latestMessage,
      message: ''
    }
    this.websocketService.invoke("SendChat", chatMessage)
  }
}