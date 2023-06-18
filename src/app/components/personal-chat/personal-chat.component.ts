import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { Account } from 'src/app/classes/account';
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
export class PersonalChatComponent implements OnInit, OnDestroy {
  latestMessage!: string;
  currentChat: Chat | undefined;
  currentTarget: Account | undefined;
  currentEventListener: any;

  constructor(private route: ActivatedRoute, private authService: AuthService, private websocketService: WebsocketService) {

  }
  ngOnDestroy(): void {
    this.currentEventListener?.off()
    console.log("component gone!")
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.currentEventListener?.off()
      console.log(params);
      var id = params['id'];
      this.currentTarget = await this.websocketService.invoke("GetUser", id);
      console.log("Chatting with " + this.currentTarget?.username + "#" + this.currentTarget?.discriminator)


      var data = await this.websocketService.invoke<Chat>("GetChat", this.currentTarget?.id);
      console.log(data);
      this.currentChat = data;
    });



    this.currentEventListener = await this.websocketService.connectMethod("ReceiveChatMessage", (chat: Chat, data: ChatMessage) => {
      if (this.currentChat == null || this.currentChat.id == chat.id) {
        console.log("Got a new message in this chat: " + data);
        this.currentChat = chat;
        data.message = data.encryptedMessage;
      }
      else {
        console.log("Got a message for a different chat")
      }
    });
  }

  sendChat(): void {
    var chatMessage: ChatMessage = {
      encryptedMessage: this.latestMessage,
      message: '',
      receiver: this.currentTarget,
      chatId: this.currentChat?.id
    }
    this.websocketService.invoke("SendDirectChat", chatMessage)
  }
}