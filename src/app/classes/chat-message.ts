import { Account } from "./account";

export class ChatMessage {
    encryptedMessage!: string;
    message!: string;
    sender?: Account;
    receiver?: Account;
    chatId?: string;
}
