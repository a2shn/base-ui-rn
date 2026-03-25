import { Content } from './content';
import { Corner } from './corner';
import { Root } from './scroll-area';
import { Scrollbar } from './scrollbar';
import { Thumb } from './thumb';
import { Viewport } from './viewport';

export const ScrollArea = {
  Content,
  Corner,
  Root,
  Scrollbar,
  Thumb,
  Viewport,
};

export { Root as ScrollAreaRoot };
export { Viewport as ScrollAreaViewport };
export { Content as ScrollAreaContent };
export { Scrollbar as ScrollAreaScrollbar };
export { Thumb as ScrollAreaThumb };
export { Corner as ScrollAreaCorner };

export * from './types';
export { useScrollArea } from './use-scroll-area';
