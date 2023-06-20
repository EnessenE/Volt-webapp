import { Account } from "./account";

export class ChatMessage {
    encryptedMessage!: string;
    decryptedMessage?: string;
    sender?: Account;
    receiver?: Account;
    chatId?: string;
    created?: Date;
}
