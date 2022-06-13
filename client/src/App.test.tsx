import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import { render, fireEvent } from '@testing-library/react'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('App Component', () => {
  it('rendered app', () => {
    const { getByTestId } = render(<App />);
    const app = getByTestId("main");

    expect(app).toBeTruthy();
  })

  it('rendered dark mood button', () => {
    const { getByTestId } = render(<App />);
    const button = getByTestId("dark-mood");

    expect(button.innerHTML).toBe('Dark Mood' );
    expect(button).toBeTruthy();
  })

  it('click on dark mood button', () => {
    const { getByTestId } = render(<App />);
    const button = getByTestId("dark-mood");

    fireEvent.click(button);

    expect(button.innerHTML).toBe('Light Mood' );
    expect(button).toBeTruthy();
  })

  it('not exist tickets', () => {
    const { getByTestId } = render(<App />);
    const h2 = getByTestId("not-ticket");

    expect(h2.innerHTML).toBe('Loading..' );
    expect(h2).toBeTruthy();
  })

  it('show button - More Tickets', () => {
    const { getByTestId } = render(<App />);
    const button = getByTestId("more");

    expect(button.innerHTML).toBe('More Tickets' );
    expect(button).toBeTruthy();
  })
});
