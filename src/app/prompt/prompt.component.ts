import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogData {
  title: string;
  result: string;
  question:string;
  onlyConfirm:boolean;
}


@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.css']
})

export class PromptComponent {

  constructor(
    public dialogRef: MatDialogRef<PromptComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter(evt:any) {
    if(evt.keyCode==13)
      this.dialogRef.close(this.data.result);
  }
}
