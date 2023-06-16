import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
    transform(value: number[]): string {
        const year = value[0];
        const month = this.addLeadingZero(value[1]);
        const day = this.addLeadingZero(value[2]);

        return `${day}/${month}/${year}`;
    }

    private addLeadingZero(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }
}