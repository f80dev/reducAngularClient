import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "../../../node_modules/@angular/material/dialog";
import {DialogData, PromptComponent} from "../prompt/prompt.component";
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatDialog} from "../../../node_modules/@angular/material/dialog";
import {selectFile} from "../tools";

export interface ImageSelectorData {
  quality:number;
  title:string;
  maxsize: number;
  filter:string;
  result:string;
}

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent implements OnInit {

  preview:string;
  icons=[];
  showIcons=false;

  constructor(
    public dialog:MatDialog,
    public deviceService: DeviceDetectorService,
    public dialogRef: MatDialogRef<PromptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageSelectorData) {
    data.title=data.title || "Sélectionner une image";
  }

  addIcons(){
    var root="https://shifumix.com/avatars/";
    if(this.icons.length==0){
      for(var i=1;i<300;i++)
        this.icons.push({photo:root+"file_emojis"+i+".png"});
    }
  }

  onSelectFile(event:any) {
    selectFile(event,this.data.maxsize,(res)=>{
      this.preview=res;
    })
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  selIcon(icon: any) {
    this.showIcons=false;
    this.preview=icon.photo;
  }

  addEmoji() {
    this.dialog.open(PromptComponent,{width: '250px',data: {title: "Utiliser un emoji", question: ""}
    }).afterClosed().subscribe((result) => {
      if(result){
        this.preview=result;
      }
    });
  }

  onEnter(evt:any) {
    if(evt.keyCode==13)
      this.dialogRef.close(this.data.result);
  }

  ngOnInit() {
  }

}
