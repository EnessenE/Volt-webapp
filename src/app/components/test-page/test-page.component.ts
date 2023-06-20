import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {
  ngOnInit(): void {
  }

  plainText!: string;
  encryptText!: string;
  encPassword!: string;
  decPassword!: string;
  conversionEncryptOutput!: string;
  conversionDecryptOutput!: string;

    constructor() {
  }

    //method is used to encrypt and decrypt the text
  convertText(conversion:string) {
      if (conversion=="encrypt") {
        this.conversionEncryptOutput = CryptoJS.AES.encrypt(this.plainText.trim(), this.encPassword.trim()).toString();
      }
      else {
        this.conversionDecryptOutput = CryptoJS.AES.decrypt(this.encryptText.trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8);
     
    }
  }

}
