import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'src/app/classes/account';
import { Chat } from 'src/app/classes/chat';
import { ChatMessage } from 'src/app/classes/chat-message';
import { AuthService } from 'src/app/services/auth.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import * as CryptoJS from 'crypto-js';
import { ChatOptions } from 'src/app/classes/chat-options';

@Component({
  selector: 'app-personal-chat',
  templateUrl: './personal-chat.component.html',
  styleUrls: ['./personal-chat.component.scss']
})
export class PersonalChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  latestMessage!: string;
  currentChat: Chat | undefined;
  currentTarget: Account | undefined;

  chatOptions: ChatOptions;

  currentEventListener: any;

  @ViewChild('chatDiv', { static: false }) chatDiv?: ElementRef;
  stayAtBottom: boolean = true;

  constructor(private route: ActivatedRoute, private authService: AuthService, private websocketService: WebsocketService, private renderer: Renderer2) {
    this.chatOptions = new ChatOptions();
    this.chatOptions.decrypt = true;
  }

  onScroll(event: any) {
    const scrollPosition = event.target.scrollTop;
    const maxScrollPosition = event.target.scrollHeight - event.target.clientHeight;

    if (scrollPosition === maxScrollPosition) {
      // User has scrolled to the bottom
      console.log("user scrolled back");
      this.stayAtBottom = true;
    } else {
      console.log("user scrolled away");
      // User has scrolled away from the bottom
      this.stayAtBottom = false;
    }
  }

  ngAfterViewChecked(): void {
    if (this.stayAtBottom) {
      this.scrollToBottom();
    }
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
      this.currentTarget = await this.websocketService.invoke<Account>("GetUser", id);
      console.log("Chatting with " + this.currentTarget?.username + "#" + this.currentTarget?.discriminator)


      var data = await this.websocketService.invoke<Chat>("GetChat", this.currentTarget?.id);
      console.log("INIT INIT INIT")
      console.log(data);
      this.currentChat = data;
      this.scrollToBottom();
    });



    this.currentEventListener = await this.websocketService.connectMethod("ReceiveChatMessage", async (data: ChatMessage) => {
      if ((this.currentChat != null && this.currentChat.id == data.chatId) || (data.receiver?.id == this.currentTarget?.id || data.sender?.id == this.currentTarget?.id)) {
        console.log("Got a new message in this chat: " + data.encryptedMessage);
        this.currentChat?.messages.push(data);
      }
      else {
        console.log("Got a message for a different chat")
      }
    });
  }

  scrollToBottom() {
    const element = this.chatDiv?.nativeElement;
    if (element) {
      this.renderer.setProperty(element, 'scrollTop', element.scrollHeight)
    };
  }

  encryptText(text: string): string {
    return CryptoJS.AES.encrypt(text.trim(), this.currentChat!.encryptionKey.trim()).toString();
  }

  async sendChat(): Promise<void> {
    var chatMessage: ChatMessage = {
      encryptedMessage: "empty",
      receiver: this.currentTarget,
      chatId: this.currentChat?.id
    }
    if (this.currentChat == null) {
      console.log("No chat data found. Retrieving");
      this.currentChat = await this.websocketService.invoke<Chat>("GetOrCreateChat", chatMessage);
      if (this.currentChat != null){
        console.log("chat data found. Retrieved, the new key is: "+ this.currentChat.encryptionKey);
      }
    }

    chatMessage = {
      encryptedMessage: this.encryptText(this.latestMessage),
      receiver: this.currentTarget,
      chatId: this.currentChat?.id
    }
    this.websocketService.invoke("SendDirectChat", chatMessage)
  }
}