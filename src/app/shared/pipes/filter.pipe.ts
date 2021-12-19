import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(array: any[], query: string): any {
    if (query) {
      return  array.filter(row=> (this.turkishToLower(row.name).indexOf(query.toLowerCase()) > -1)
      );
    }
    return array;
  }

  turkishToLower(input){
      if(input){
          var string = this;
          var letters = { "İ": "i", "I": "i", "Ş": "s", "Ğ": "g", "Ü": "u", "Ö": "o", "Ç": "c" };
          string = input.replace(/(([İIŞĞÜÇÖ]))/g, function(letter){ return letters[letter]; })
          return input.toLowerCase();
      }else{
          return '';
      }
  }
}