import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'literal'
})
export class LiteralPipe implements PipeTransform {

  transform(value: number,decimal:number=2,lang: string="fr"): string {
    let rc="";

    for(let k=2;k<=10;k++)
      if(value==1/k)rc="1/"+k;

    if(Math.trunc(value*100)==33)rc="1/3";

    if(rc.length>0)
      return(rc);
    else {
      if(Math.trunc(value)==value)decimal=0;
      return value.toFixed(decimal);
    }

  }

}
