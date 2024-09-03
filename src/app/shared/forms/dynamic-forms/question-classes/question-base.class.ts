import { MatFormFieldAppearance } from "@angular/material/form-field";

export class QuestionBase<T> {
  value: T | undefined;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  type: string;
  options: {key: string; value: string}[];
  materialCss: MatFormFieldAppearance;
  suffix: string | undefined;
  prefix: string | undefined;

  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      order?: number;
      controlType?: string;
      type?: string;
      options?: {key: string; value: string}[];
      materialCss?: MatFormFieldAppearance;
      suffix?: string;
      prefix?: string;
    } = {},
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
    this.materialCss = options.materialCss || 'fill';
    this.suffix = options.suffix;
    this.prefix = options.prefix;
  }
}