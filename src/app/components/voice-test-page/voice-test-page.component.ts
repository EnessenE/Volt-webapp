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
  mediaRecorder?: MediaRecorder;
  audioChunks: Blob[] = [];
  isRecording = false;
  private connection: signalR.HubConnection;
  connected: boolean = false;
  connecting: boolean = false;
  audioStream!: Observable<AudioBuffer>;
  isStreaming: boolean = false;
  currentData: any;

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
    // Check browser compatibility
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('getUserMedia is not supported');
      return;
    }
  }


  startStreaming() {
    if (!this.isStreaming) {
      this.isStreaming = true;

      // Request audio stream from the user's microphone
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => this.handleAudioStream(stream))
        .catch(error => console.error('Error accessing microphone:', error));
    } else {
      console.warn('Streaming is already in progress.');
    }
  }

  getChannelData(audioBuffer: AudioBuffer): Float32Array[] {
    const channelData: Float32Array[] = [];
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      channelData.push(audioBuffer.getChannelData(channel));
    }
    return channelData;
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

  async disconnect(): Promise<void> {
    this.connection.stop();
    this.connected = false;
    this.connecting = false;
  }



  handleAudioStream(stream: MediaStream) {
    console.log("Trying to handle audio stream...")
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    // Create an Observable that emits the audio stream data 
    this.audioStream = new Observable<AudioBuffer>(observer => {
      console.log("Trying to handle AudioBuffer...")

      const bufferSize = 2048;
      const scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);

      scriptProcessor.onaudioprocess = event => {
        const audioBuffer = event.inputBuffer;
        console.log("data in buffer! Size: " + audioBuffer.length)

        const [left] = [audioBuffer.getChannelData(0)]
        const interleaved = new Float32Array(left.length)
        for (let src = 0, dst = 0; src < left.length; src++, dst += 2) {
          interleaved[dst] = left[src]
        }


        //this.connection.invoke("SendAudio", audioBuffer);
        this.play(interleaved);
        observer.next(audioBuffer);
      };

      source.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);

      return () => {
        scriptProcessor.disconnect();
        source.disconnect();
      };
    });

  }

  async play(data: ArrayBuffer) {
    console.log("Trying to replay something of length: " + data.byteLength)
    const context = new AudioContext();
    const buffer = await context.decodeAudioData(data);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
  }
}
