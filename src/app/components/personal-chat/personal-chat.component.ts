import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Chat } from 'src/app/classes/chat';
import { ChatMessage } from 'src/app/classes/chat-message';
import { AuthService } from 'src/app/services/auth.service';
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

  constructor(private authService: AuthService) {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.serverwebsocket, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory:() => {
          return this.authService.token!;
      }})
      .withAutomaticReconnect()
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
      data.message = data.encryptedMessage;
      this.currentChat.messages.push(data);
    });
  }

  sendChat(): void {
    var chatMessage: ChatMessage = {
      encryptedMessage: this.latestMessage,
      message: ''
    }
    this.connection.invoke("SendChat", chatMessage)
  }
}