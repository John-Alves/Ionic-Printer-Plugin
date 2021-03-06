import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
 
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-page01',
  templateUrl: './page01.page.html',
  styleUrls: ['./page01.page.scss'],
})
export class Page01Page implements OnInit { 
  pdfObj = null;

  constructor(
    public navCtrl: NavController, 
    private plt: Platform, 
    private file: File, 
    private fileOpener: FileOpener,
    private bluetoothSerial: BluetoothSerial,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.gerarPDF();
  }

  gerarPDF(){
    let base64exemplo = "data:image/png;base64,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";
    let docDefinition = {
      content: [
        { text: "TESTE", style: 'estilo1', margin: [0, 20, 0, 20] },
        {
          image: base64exemplo,
          width: 150
        },
        {
          ul: [
            'Bacon',
            'Rips',
            'BBQ',
          ]
        }
      ],
      styles: {
        estilo1: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }

  testarImpressao02(){
    this.pdfObj.getBuffer((buffer) => {
      this.enviaBluetoothSerial(buffer);

      let blob = new Blob([buffer], { type: 'application/pdf' });
      this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
        this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
      })
    });
  }

  enviaBluetoothSerial(buffer){
    this.bluetoothSerial.write(buffer).then(() => console.log("Funcionou!"), (error) => console.log(error));
  }
}
