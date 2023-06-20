import { Account } from "./account";
import { ChatMessage } from "./chat-message";

export class Chat {
    id!: string;
    messages!: ChatMessage[];
    members!:Account[];
    receiver!:Account;
    sender!:Account;
    encryptionKey!: string;
}
