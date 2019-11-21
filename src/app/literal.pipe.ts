import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'literal'
})
export class LiteralPipe implements PipeTransform {

  transform(value: number,decimal:number=2,lang: string="fr"): string {
    let rc="";

    for(let k=1;k<10;k++)
      if(value==1/k)rc="1/"+k;

    if(Math.trunc(value*100)==33)rc="tiers";
    if(value==0.25)rc="quart";
    if(value==0.1)rc="dixième";

    if(rc.length>0)
      return(rc);
    else
      return value.toFixed(decimal);
  }

}
