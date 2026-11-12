
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ChipGroup } from './ChipGroup';

const options = [
  { value: 'appliances', label: 'Побутова техніка' },
  { value: 'electronics', label: 'Електроніка' },
  { value: 'furniture', label: 'Меблі' },
];

describe('ChipGroup', () => {
  describe('single selection', () => {
    it('renders all options', async () => {
      await render(
        <ChipGroup
          mode="single"
          options={options}
          value="appliances"
          onChange={jest.fn()}
        />,
      );

      expect(screen.getByText('Побутова техніка')).toBeTruthy();
      expect(screen.getByText('Електроніка')).toBeTruthy();
      expect(screen.getByText('Меблі')).toBeTruthy();
    });

    it('calls onChange when another chip is pressed', async () => {
      const onChange = jest.fn();

      await render(
        <ChipGroup
          mode="single"
          options={options}
          value="appliances"
          onChange={onChange}
        />,
      );

      await fireEvent.press(screen.getByText('Електроніка'));

      expect(onChange).toHaveBeenCalledWith('electronics');
    });

    it('does not call onChange when the selected chip is pressed', async () => {
      const onChange = jest.fn();

      await render(
        <ChipGroup
          mode="single"
          options={options}
          value="appliances"
          onChange={onChange}
        />,
      );

      await fireEvent.press(screen.getByText('Побутова техніка'));

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('multiple selection', () => {
    it('adds a chip to the selection', async () => {
      const onChange = jest.fn();

      await render(
        <ChipGroup
          mode="multiple"
          options={options}
          value={['appliances']}
          onChange={onChange}
        />,
      );

      await fireEvent.press(screen.getByText('Електроніка'));

      expect(onChange).toHaveBeenCalledWith([
        'appliances',
        'electronics',
      ]);
    });

    it('removes a chip from the selection', async () => {
      const onChange = jest.fn();

      await render(
        <ChipGroup
          mode="multiple"
          options={options}
          value={['appliances', 'electronics']}
          onChange={onChange}
        />,
      );

      await fireEvent.press(screen.getByText('Електроніка'));

      expect(onChange).toHaveBeenCalledWith(['appliances']);
    });
  });
});
