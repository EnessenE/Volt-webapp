import { Component } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-voice-test-page',
  templateUrl: './voice-test-page.component.html',
  styleUrls: ['./voice-test-page.component.scss']
})
export class VoiceTestPageComponent {
  private connection: signalR.HubConnection;
  connected: boolean = false;
  connecting: boolean = false;
  isStreaming: boolean = false;
  currentData: any;


  private audioContext?: AudioContext;
  private mediaStream?: MediaStream;

  constructor(private authService: AuthService) {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.servervoicewebsocket, {
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

  ngOnInit() {
    this.audioContext = new AudioContext();
    this.registerAudioDataHandler();
    this.registerStreaming();
  }

  registerStreaming(){
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaStream = stream;
        const audioSource = this.audioContext!.createMediaStreamSource(stream);
        const scriptProcessor = this.audioContext!.createScriptProcessor(4096, 1, 1);

        audioSource.connect(scriptProcessor);
        scriptProcessor.connect(this.audioContext!.destination);

        scriptProcessor.addEventListener('audioprocess', (event) => {
          const inputBuffer = event.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);
          const dataToSend = new Float32Array(inputData.length);
          dataToSend.set(inputData);

          if (this.isStreaming) {
            this.connection.invoke('SendAudioData', dataToSend); // Invoke your server-side method to send audio data
          }
        });
      })
      .catch(error => console.error(`Error accessing microphone: ${error}`));
  }

  startStreaming() {
    this.isStreaming = true;
  }
  stopStreaming() {
    this.isStreaming = false;
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
      this.disconnect();
      console.log("Not building a connection as user is not logged in.")
    }
  }

  registerAudioDataHandler() {
    this.connection.on('ReceiveAudioData', (audioData: Float32Array) => {
      // Process received audio data as per your requirements
      console.log('Received audio data:', audioData);

      // Example: Play the audio data through the Web Audio API
      const audioBuffer = this.audioContext!.createBuffer(1, audioData.length, this.audioContext!.sampleRate);
      audioBuffer.getChannelData(0).set(audioData);
      const audioSource = this.audioContext!.createBufferSource();
      audioSource.buffer = audioBuffer;
      audioSource.connect(this.audioContext!.destination);
      audioSource.start();
    });
  }

  async disconnect(): Promise<void> {
    this.connection.stop();
    this.connected = false;
    this.connecting = false;
  }


}
