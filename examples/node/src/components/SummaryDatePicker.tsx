import moment from 'moment'
import { DatePickerOption } from '../Types';
import { OptionList } from '@shopify/polaris';

let mainDatePickerSelectedOption = 'today';

let options: DatePickerOption[] = [
  {
    value: {
      start: moment().startOf('day'),
      end: moment().endOf('day'),
      id: 'today',
    },
    label: 'Today',
    active: mainDatePickerSelectedOption === 'today',
  },
  {
    value: {
      start: moment().subtract(1, 'day').startOf('day'),
      end: moment().subtract(1, 'day').startOf('day'), //.endOf('day') // bug with endOf day
      id: 'yesterday',
    },
    label: 'Yesterday',
    active: mainDatePickerSelectedOption === 'yesterday',
  },
  {
    value: {
      start: moment().subtract(7, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last7Days',
    },
    label: 'Last 7 days',
    active: mainDatePickerSelectedOption === 'last7Days',
  },
  {
    value: {
      start: moment().subtract(30, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last30Days',
    },
    label: 'Last 30 days',
    active: mainDatePickerSelectedOption === 'last30Days',
  },
  {
    value: {
      start: moment().subtract(90, 'days').startOf('day'),
      end: moment().subtract(1, 'day').endOf('day'),
      id: 'last90Days',
    },
    label: 'Last 90 days',
    active: mainDatePickerSelectedOption === 'last90Days',
  },
];

export const SummaryDatePicker = () => {
  return (
    <OptionList
      options={options as any}
      onChange={(selected) => console.log(selected)}
      selected={[]}
    />
  );
};