import {render, screen} from "@testing-library/react"
import FirstTest from "./components/card/FirstTest";
import {it, expect} from 'vitest';


it("should have hello world", ()=> {
    render(<FirstTest />)
    const message = screen.queryByText(/Hello World/i)
    expect(message).toBeVisible();



});

