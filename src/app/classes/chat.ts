import { Account } from "./account";
import { ChatMessage } from "./chat-message";

export class Chat {
    messages!: ChatMessage[];
    sender!: Account;
    receiver!: Account;
}
