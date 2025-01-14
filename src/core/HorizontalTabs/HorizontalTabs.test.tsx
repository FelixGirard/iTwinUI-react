/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { HorizontalTab } from './HorizontalTab';
import { HorizontalTabs, HorizontalTabsProps } from './HorizontalTabs';

const renderComponent = (
  initialProps?: Partial<HorizontalTabsProps>,
  initialChildren?: React.ReactNode,
) => {
  const defaultProps: HorizontalTabsProps = {
    labels: [
      <HorizontalTab key={1} label='Label 1' />,
      <HorizontalTab key={2} label='Label 2' />,
      <HorizontalTab key={3} label='Label 3' />,
    ],
  };
  const props = { ...defaultProps, ...initialProps };
  const children = initialChildren ?? 'Test content';
  return render(<HorizontalTabs {...props}>{children}</HorizontalTabs>);
};

it('should render tabs', () => {
  const { container } = renderComponent();

  expect(container.querySelector('.iui-tabs-wrapper')).toBeTruthy();

  const tabContainer = container.querySelector('.iui-tabs') as HTMLElement;
  expect(tabContainer).toBeTruthy();
  expect(tabContainer.className).toEqual('iui-tabs iui-default');
  expect(tabContainer.querySelectorAll('.iui-tab').length).toBe(3);
  screen.getByText('Test content');
});

it('should render borderless tabs', () => {
  const { container } = renderComponent({ type: 'borderless' });

  const tabContainer = container.querySelector('.iui-tabs') as HTMLElement;
  expect(tabContainer).toBeTruthy();
  expect(tabContainer.className).toContain('iui-tabs iui-borderless');
});

it('should render pill tabs', () => {
  const { container } = renderComponent({ type: 'pill' });

  const tabContainer = container.querySelector('.iui-tabs') as HTMLElement;
  expect(tabContainer).toBeTruthy();
  expect(tabContainer.className).toContain('iui-tabs iui-pill');
});

it('should render green tabs', () => {
  const { container } = renderComponent({ color: 'green' });

  const tabContainer = container.querySelector('.iui-tabs') as HTMLElement;
  expect(tabContainer).toBeTruthy();
  expect(tabContainer.className).toContain('iui-green');
});

it('should call onTabSelected when switching tabs', () => {
  const onTabSelected = jest.fn();
  const { container } = renderComponent({ onTabSelected });

  const tabs = container.querySelectorAll('.iui-tab');
  expect(tabs.length).toBe(3);
  fireEvent.click(tabs[2]);
  expect(onTabSelected).toHaveBeenCalledWith(2);
});

it('should set active tab', () => {
  const { container } = renderComponent({ activeIndex: 2 });

  const tabs = container.querySelectorAll('.iui-tab');
  expect(tabs.length).toBe(3);
  expect(tabs[0].className).not.toContain('iui-tab iui-active');
  expect(tabs[1].className).not.toContain('iui-tab iui-active');
  expect(tabs[2].className).toContain('iui-tab iui-active');
});

it('should not fail with invalid active tab and set the closest one', () => {
  const { container } = renderComponent({ activeIndex: 100 });

  const tabs = container.querySelectorAll('.iui-tab');
  expect(tabs.length).toBe(3);
  expect(tabs[0].className).not.toContain('iui-tab iui-active');
  expect(tabs[1].className).not.toContain('iui-tab iui-active');
  expect(tabs[2].className).toContain('iui-tab iui-active'); // 2 is closest to 100
});

it('should render strings in HorizontalTab child component', () => {
  const { container } = renderComponent({
    labels: ['item0', 'item1', 'item2'],
  });

  const tabs = container.querySelectorAll('.iui-tab');
  expect(tabs.length).toBe(3);
  tabs.forEach((tab, index) => {
    const label = tab.querySelector('.iui-tab-label') as HTMLElement;
    expect(label).toBeTruthy();
    expect(label.firstElementChild?.textContent).toEqual(`item${index}`);
  });
});

it('should add .iui-large if HorizontalTab has sublabel', () => {
  const { container } = renderComponent({
    labels: [
      <HorizontalTab key={0} label='item0' sublabel='Sublabel0' />,
      <HorizontalTab key={1} label='item1' sublabel='Sublabel1' />,
      <HorizontalTab key={2} label='item2' sublabel='Sublabel2' />,
    ],
  });
  expect(container.querySelector('.iui-tabs.iui-large')).toBeTruthy();

  const tabs = container.querySelectorAll('.iui-tab');
  expect(tabs.length).toBe(3);
  tabs.forEach((tab, index) => {
    const label = tab.querySelector('.iui-tab-label') as HTMLElement;
    expect(label.textContent).toEqual(`item${index}Sublabel${index}`);
  });
});

it('should add custom classnames', () => {
  const { container } = renderComponent({
    tabsClassName: 'customTabsClassName',
    contentClassName: 'customContentClassName',
  });

  const tabsContainer = container.querySelector('ul.customTabsClassName');
  expect(tabsContainer).toBeTruthy();
  const content = container.querySelector('div.customContentClassName');
  expect(content).toBeTruthy();
});

it('should handle keypresses', () => {
  const mockOnTabSelected = jest.fn();
  const { container } = renderComponent({ onTabSelected: mockOnTabSelected });

  const tablist = container.querySelector('.iui-tabs') as HTMLElement;
  const tabs = Array.from(tablist.querySelectorAll('.iui-tab'));

  // alt key
  fireEvent.keyDown(tablist, { key: 'ArrowRight', altKey: true });
  expect(mockOnTabSelected).not.toHaveBeenCalled();

  // 0 -> 1
  fireEvent.keyDown(tablist, { key: 'ArrowRight' });
  expect(mockOnTabSelected).toBeCalledWith(1);
  expect(document.activeElement).toBe(tabs[1]);

  // 1 -> 2
  fireEvent.keyDown(tablist, { key: 'ArrowRight' });
  expect(mockOnTabSelected).toBeCalledWith(2);
  expect(document.activeElement).toBe(tabs[2]);

  // 2 -> 0
  fireEvent.keyDown(tablist, { key: 'ArrowRight' });
  expect(mockOnTabSelected).toBeCalledWith(0);
  expect(document.activeElement).toBe(tabs[0]);

  // 0 -> 2
  fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
  expect(mockOnTabSelected).toBeCalledWith(2);
  expect(document.activeElement).toBe(tabs[2]);

  // 2 -> 1
  fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
  expect(mockOnTabSelected).toBeCalledWith(1);
  expect(document.activeElement).toBe(tabs[1]);
});

it('should handle keypresses when focusActivationMode is manual', () => {
  const mockOnTabSelected = jest.fn();
  const { container } = renderComponent({
    focusActivationMode: 'manual',
    onTabSelected: mockOnTabSelected,
  });

  const tablist = container.querySelector('.iui-tabs') as HTMLElement;
  const tabs = Array.from(tablist.querySelectorAll('.iui-tab'));

  // 0 -> 1
  fireEvent.keyDown(tablist, { key: 'ArrowRight' });
  expect(mockOnTabSelected).not.toBeCalled();
  expect(document.activeElement).toBe(tabs[1]);

  // select 1
  fireEvent.keyDown(tablist, { key: 'Enter' });
  expect(mockOnTabSelected).toBeCalledWith(1);

  // 1 -> 0
  fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
  expect(mockOnTabSelected).not.toBeCalledWith(0);
  expect(document.activeElement).toBe(tabs[0]);

  // select 0
  fireEvent.keyDown(tablist, { key: ' ' });
  expect(mockOnTabSelected).toBeCalledWith(0);
});

it('should set focused index when tab is clicked', () => {
  const mockOnTabSelected = jest.fn();
  const { container } = renderComponent({ onTabSelected: mockOnTabSelected });

  const tablist = container.querySelector('.iui-tabs') as HTMLElement;
  const tabs = Array.from(tablist.querySelectorAll('.iui-tab'));

  // click 1
  fireEvent.click(tabs[1]);
  expect(mockOnTabSelected).toBeCalledWith(1);
  expect(document.activeElement).toBe(tabs[1]);

  // 1 -> 2
  fireEvent.keyDown(tablist, { key: 'ArrowRight' });
  expect(mockOnTabSelected).toBeCalledWith(2);
  expect(document.activeElement).toBe(tabs[2]);
});
