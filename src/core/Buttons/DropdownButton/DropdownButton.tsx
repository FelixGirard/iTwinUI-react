/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from 'react';
import cx from 'classnames';
import { Button, ButtonProps } from '../Button';
import { DropdownMenu } from '../../DropdownMenu';
import { Position } from '../../../utils';
import SvgCaretDown2 from '@bentley/icons-generic-react/cjs/icons/CaretDown2';
import SvgCaretUp2 from '@bentley/icons-generic-react/cjs/icons/CaretUp2';

import { useTheme } from '../../utils/hooks/useTheme';
import '@bentley/itwinui/css/button.css';

export type DropdownButtonProps = {
  /**
   * Items in the dropdown menu.
   * Pass a function that takes the `close` argument (to close the menu),
   * and returns a list of `MenuItem` components.
   */
  menuItems: (close: () => void) => JSX.Element[];
} & Omit<ButtonProps, 'onClick' | 'styleType' | 'endIcon'>;

/**
 * Button that opens a DropdownMenu.
 * @example
 * const menuItems = (close: () => void) => [
 *   <MenuItem key={1} onClick={onClick(1, close)}>Item #1</MenuItem>,
 *   <MenuItem key={2} onClick={onClick(2, close)}>Item #2</MenuItem>,
 * ];
 * <DropdownButton menuItems={menuItems}>Default</DropdownButton>
 */
export const DropdownButton: React.FC<DropdownButtonProps> = (props) => {
  const { menuItems, className, size, children, ...rest } = props;

  useTheme();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const [menuWidth, setMenuWidth] = React.useState(0);
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      setMenuWidth(ref.current.offsetWidth);
    }
  }, [children, size]);

  return (
    <DropdownMenu
      position={Position.BOTTOM_RIGHT}
      menuItems={menuItems}
      style={{ minWidth: menuWidth }}
      onOpen={() => setIsMenuOpen(true)}
      onClose={() => setIsMenuOpen(false)}
    >
      <Button
        className={cx('iui-dropdown', className)}
        size={size}
        endIcon={isMenuOpen ? <SvgCaretUp2 /> : <SvgCaretDown2 />}
        ref={ref}
        {...rest}
      >
        {children}
      </Button>
    </DropdownMenu>
  );
};

export default DropdownButton;
