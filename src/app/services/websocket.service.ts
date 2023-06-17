import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private connection: signalR.HubConnection;
  connected: boolean = false;
  connecting: boolean = false;

  constructor(private authService: AuthService) {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.serverwebsocket, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => {
          return this.authService.token!;
        }
      })
      .withAutomaticReconnect()
      .build();
    this.connect()
  }

  async connect(): Promise<void> {
    if (this.authService.isLoggedIn) {
      if (!this.connected && !this.connecting) {
        console.log("Connecting to Volt servers");
        this.connecting = true;
        await this.connection.start().then(() => {
          console.log('Connected to Volt server!');
          this.connected = true;
          this.connecting = false;
        }).catch((err) => {
          this.connected = false;
          this.connecting = false;
          return console.error(err.toString());
        });
      }
      while (!this.connected) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100 milliseconds before checking again
      }
    }
    else {
      console.log("Not building a connection as user is not logged in.")
    }
  }

  async invoke<T = any>(methodName: string, ...args: any[]): Promise<T> {
    await this.connect();
    return await this.connection.invoke<T>(methodName, ...args);
  }

  async connectMethod(methodName: string, newMethod: (...args: any[]) => any) {
    await this.connect();
    return this.connection.on(methodName, newMethod);
  }
}
