import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Currency, CURRENCY_OPTIONS, CurrencyOption } from '../../utils/currency.utils';

@Component({
    selector: 'app-currency-select',
    standalone: true,
    imports: [CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CurrencySelectComponent),
            multi: true
        }
    ],
    template: `
    <div class="relative">
      <label *ngIf="label" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
      </label>
      <select
        [value]="value"
        (change)="onCurrencyChange($event)"
        [disabled]="disabled"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none bg-white"
        [class.opacity-50]="disabled"
        [class.cursor-not-allowed]="disabled"
      >
        <option value="" disabled>Select Currency</option>
        <option *ngFor="let currency of currencies" [value]="currency.code">
          {{ currency.symbol }} - {{ currency.name }} ({{ currency.code }})
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700" [class.mt-6]="label">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  `,
    styles: [`
    select {
      background-image: none;
    }
  `]
})
export class CurrencySelectComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() disabled: boolean = false;
    @Output() currencyChange = new EventEmitter<Currency>();

    currencies: CurrencyOption[] = CURRENCY_OPTIONS;
    value: Currency = Currency.INR;

    private onChange: (value: Currency) => void = () => { };
    private onTouched: () => void = () => { };

    onCurrencyChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const newValue = target.value as Currency;
        this.value = newValue;
        this.onChange(newValue);
        this.onTouched();
        this.currencyChange.emit(newValue);
    }

    // ControlValueAccessor implementation
    writeValue(value: Currency): void {
        if (value) {
            this.value = value;
        }
    }

    registerOnChange(fn: (value: Currency) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
