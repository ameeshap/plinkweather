import {render, screen } from '@testing-library/react';
import { expect} from 'vitest';
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover'
import {
    Command,
    CommandDialog,
  } from "../components/ui/command";

describe("Command Components", () => {
    test("renders Command component", () => {
      render(<Command>Test Command</Command>);
      expect(screen.getByText("Test Command")).toBeInTheDocument();
    });
})

test("renders CommandDialog component", () => {
    render(<CommandDialog open>Test Dialog</CommandDialog>);
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
});

describe("Popover Components", () => {
    test("renders Popover component", () => {
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Popover Content</PopoverContent>
        </Popover>
      );
    })
});



  






