import { Component, Input } from '@angular/core';
import { Chat } from 'src/app/classes/chat';
import { ChatMessage } from 'src/app/classes/chat-message';
import * as CryptoJS from 'crypto-js';
import { ChatOptions } from 'src/app/classes/chat-options';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @Input() chatMessage!: ChatMessage;
  @Input() currentChat!: Chat;
  @Input() chatOptions?: ChatOptions;

  decryptText(text: string): string {
    if (this.chatOptions?.decrypt) {
      return CryptoJS.AES.decrypt(text.trim(), this.currentChat!.encryptionKey.trim()).toString(CryptoJS.enc.Utf8);
    }
    else {
      return text;
    }
  }
}
