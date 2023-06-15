import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-personal-chat',
  templateUrl: './personal-chat.component.html',
  styleUrls: ['./personal-chat.component.scss']
})
export class PersonalChatComponent implements OnInit {
  connection: signalR.HubConnection;
  latestMessage!: string;
  currentChat!: Chat;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.serverwebsocket, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
  }

  async ngOnInit(): Promise<void> {
    await this.connection.start().then(function () {
      console.log('Connected to Volt server!');
    }).catch(function (err) {
      return console.error(err.toString());
    });


    var data = await this.connection.invoke<Chat>("GetChat");
    console.log(data);
    this.currentChat = data;
    this.connection.on("ReceiveChatMessage", (data: ChatMessage) => {
      console.log(data);
      this.currentChat.messages.push(data);
    });
  }

  sendChat(): void {
    var chatMessage: ChatMessage = {
      message: this.latestMessage
    }
    this.connection.invoke("SendChat", chatMessage)
  }
}

class ChatMessage {
  message!: string;
}
class Account {
  username!: string;
  discriminator!: number;
}
class Chat {
  messages!: ChatMessage[];
  sender!: Account;
  receiver!: Account;
}