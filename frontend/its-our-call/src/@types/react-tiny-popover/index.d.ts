declare module 'react-tiny-popover' {
  import * as React from 'react';

  export interface ContentLocation {
      top: number;
      left: number;
  }

  export interface ContentRendererArgs {
      position: Position;
      align: Align;
      nudgedLeft: number;
      nudgedTop: number;
      targetRect: ClientRect;
      popoverRect: ClientRect;
  }

  export interface ContentLocationGetterArgs {
      position: Position;
      align: Align;
      nudgedLeft: number;
      nudgedTop: number;
      targetRect: ClientRect;
      popoverRect: ClientRect;
  }

  export type ContentRenderer = (args: ContentRendererArgs) => JSX.Element;
  export type ContentLocationGetter = (args: ContentLocationGetterArgs) => ContentLocation;

  export type Position = 'left' | 'right' | 'top' | 'bottom';
  export type Align = 'start' | 'center' | 'end';

  export interface PopoverProps {
      children: JSX.Element;
      isOpen: boolean;
      content: ContentRenderer | JSX.Element;
      contentLocation?: ContentLocationGetter | ContentLocation;
      padding?: number;
      position?: Position | Position[];
      onClickOutside?: (e: MouseEvent) => void;
      disableReposition?: boolean;
      containerClassName?: string;
      containerStyle?: Partial<CSSStyleDeclaration>;
      align?: Align;
      transitionDuration?: number;
      windowBorderPadding?: number;
  }

  export interface ArrowContainerProps {
      children: JSX.Element;
      position: Position;
      targetRect: ClientRect;
      popoverRect: ClientRect;
      style?: React.CSSProperties;
      arrowSize?: number;
      // tslint:disable-next-line:no-any
      arrowColor?: React.CSSWideKeyword | any;
      arrowStyle?: React.CSSProperties;
  }

  export const ArrowContainer: React.StatelessComponent<ArrowContainerProps>;
  export default class Popover extends React.Component<PopoverProps> { }
}
