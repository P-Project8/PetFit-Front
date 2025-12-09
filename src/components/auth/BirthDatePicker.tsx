import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui';
import type { ControllerRenderProps } from 'react-hook-form';

interface BirthDatePickerProps {
  field: ControllerRenderProps<
    {
      email: string;
      userId: string;
      password: string;
      name: string;
      birth: string;
    },
    'birth'
  >;
}

export default function BirthDatePicker({ field }: BirthDatePickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [y, m, d] = field.value ? field.value.split('-') : ['', '', ''];

  let daysInMonth = 31;
  if (y && m) {
    daysInMonth = new Date(parseInt(y), parseInt(m), 0).getDate();
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function handleDateChange(type: 'y' | 'm' | 'd', value: string) {
    let newY = y;
    let newM = m;
    let newD = d;

    if (type === 'y') newY = value;
    if (type === 'm') {
      newM = value.padStart(2, '0');
      const maxDay = new Date(
        parseInt(newY || '2000'),
        parseInt(newM),
        0
      ).getDate();
      if (parseInt(newD) > maxDay) newD = '';
    }
    if (type === 'd') newD = value.padStart(2, '0');

    field.onChange(`${newY || ''}-${newM || ''}-${newD || ''}`);
  }

  return (
    <FormItem>
      <FormLabel>생년월일</FormLabel>
      <FormControl>
        <div className="flex gap-2">
          <Select
            onValueChange={(val) => handleDateChange('y', val)}
            value={y || undefined}
          >
            <FormControl>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="년도" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[200px]">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}년
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(val) => handleDateChange('m', val)}
            value={m ? parseInt(m).toString() : undefined}
          >
            <FormControl>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="월" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[200px]">
              {months.map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {month}월
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(val) => handleDateChange('d', val)}
            value={d ? parseInt(d).toString() : undefined}
          >
            <FormControl>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="일" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[200px]">
              {days.map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}일
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormControl>
      <FormMessage className="text-xs" />
    </FormItem>
  );
}
