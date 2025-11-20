export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'date' | 'select' | 'boolean' | 'textarea';
  required?: boolean;
  options?: { value: any; viewValue: string }[];
  value?: any;
  placeholder?: string;
}
