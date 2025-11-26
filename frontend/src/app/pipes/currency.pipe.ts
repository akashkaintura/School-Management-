import { Pipe, PipeTransform } from '@angular/core';
import { Currency, formatCurrency } from '../utils/currency.utils';

@Pipe({
    name: 'currency',
    standalone: true
})
export class CurrencyPipe implements PipeTransform {
    transform(amount: number, currency: Currency = Currency.INR, showCode: boolean = false): string {
        return formatCurrency(amount, currency, showCode);
    }
}
