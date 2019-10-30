import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "../../../node_modules/@angular/material/dialog";
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatDialog} from "../../../node_modules/@angular/material/dialog";
import {rotate, selectFile} from "../tools";
import {PromptComponent} from "../prompt/prompt.component";
import {ApiService} from "../api.service";
import {MatSnackBar} from "@angular/material";

export interface ImageSelectorData {
  quality:number;
  title:string;
  square:boolean;
  maxsize: number;
  filter:string;
  result:string;
  emoji:boolean;
  width:number;
  height:number;
}

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent implements OnInit {

  icons=[];
  showIcons=false;
  pictures=[];

  constructor(
    public dialog:MatDialog,
    public snackBar:MatSnackBar,
    public api:ApiService,
    public deviceService: DeviceDetectorService,
    public dialogRef: MatDialogRef<ImageSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if(data.emoji==null)data.emoji=false;
    if(data.width!=null && data.width==data.height)data.square=true;
    data.title=data.title || "Sélectionner une image";
    if(data.square==null)data.square=true;
    data.maxsize=data.maxsize || 500;
    data.width=data.width || data.maxsize;
    if(data.square)data.height=data.width;
    if(data.width>data.maxsize)data.width=data.maxsize;
    if(data.height>data.maxsize)data.height=data.maxsize;
  }

  addIcons(){
    var root="https://shifumix.com/avatars/";
    if(this.icons.length==0){
      for(var i=1;i<300;i++)
        this.icons.push({photo:root+"file_emojis"+i+".png"});
    }
    this.showIcons=true;
  }

  onSelectFile(event:any) {
    selectFile(event,this.data.maxsize,this.data.quality,this.data.square,(res)=>{
      this.data.result=res;
    })
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  rotatePhoto() {
    rotate(this.data.result,90,this.data.quality,(res)=>{
      this.data.result=res;
    });
  }


  selIcon(icon: any) {
    this.showIcons=false;
    this.data.result=icon.photo;
  }

  addEmoji() {
    this.dialog.open(PromptComponent,{width: '250px',data: {title: "Utiliser un emoji", question: ""}
    }).afterClosed().subscribe((result) => {
      if(result){
        this.data.result=result;
      }
    });
  }

  ngOnInit() {
  }

  addUrl() {
    this.dialog.open(PromptComponent, {
      width: '250px', data: {title: "Un mot clé ou directement une adresse internet de votre image", question: ""}
    }).afterClosed().subscribe((result) => {
      if (result) {
        if(result.startsWith("http")){
          this.data.result=result;
        } else {
          this.api.searchImage(result,15).subscribe((r:any)=>{
            if(r==null || r.length==0)
              this.snackBar.open("Désolé nous n'avons pas trouvé d'images pour le mot "+result,"",{duration:2000});
            else
              this.pictures=r;
          })
        }

      }
    });
  }

  selPicture(tile: any) {
    this.data.result=tile;
    this.pictures=[];
  }
}
