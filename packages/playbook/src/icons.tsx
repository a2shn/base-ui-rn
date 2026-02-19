import * as React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Default icon for components
export const ComponentIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Rect
      x='3'
      y='3'
      width='7'
      height='7'
      rx='1'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Rect
      x='14'
      y='3'
      width='7'
      height='7'
      rx='1'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Rect
      x='3'
      y='14'
      width='7'
      height='7'
      rx='1'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Rect
      x='14'
      y='14'
      width='7'
      height='7'
      rx='1'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
  </Svg>
);

// Button icon
export const ButtonIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Rect
      x='3'
      y='8'
      width='18'
      height='8'
      rx='2'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Circle cx='8' cy='12' r='1.5' fill={color} />
  </Svg>
);

// Input/TextField icon
export const InputIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Rect
      x='2'
      y='6'
      width='20'
      height='12'
      rx='2'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Line
      x1='6'
      y1='12'
      x2='12'
      y2='12'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
  </Svg>
);

// Switch/Toggle icon
export const SwitchIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Rect
      x='4'
      y='9'
      width='16'
      height='6'
      rx='3'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Circle cx='8' cy='12' r='2' fill={color} />
  </Svg>
);

// Checkbox icon
export const CheckboxIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Rect
      x='4'
      y='4'
      width='16'
      height='16'
      rx='2'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Polyline
      points='7,12 10,15 17,8'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />
  </Svg>
);

// Radio icon
export const RadioIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Circle cx='12' cy='12' r='8' stroke={color} strokeWidth='2' fill='none' />
    <Circle cx='12' cy='12' r='4' fill={color} />
  </Svg>
);

// Slider icon
export const SliderIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Line
      x1='4'
      y1='12'
      x2='20'
      y2='12'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
    <Circle cx='14' cy='12' r='3' fill={color} stroke={color} strokeWidth='2' />
  </Svg>
);

// Select/Dropdown icon
export const SelectIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Rect
      x='3'
      y='6'
      width='18'
      height='12'
      rx='2'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Polyline
      points='9,10 12,13 15,10'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />
  </Svg>
);

// Modal/Dialog icon
export const ModalIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Rect
      x='5'
      y='7'
      width='14'
      height='12'
      rx='2'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Rect x='8' y='4' width='8' height='3' rx='1' fill={color} />
  </Svg>
);

// Tooltip icon
export const TooltipIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Rect
      x='4'
      y='3'
      width='16'
      height='10'
      rx='2'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Path d='M12 13 L10 16 L14 16 Z' fill={color} />
    <Line
      x1='12'
      y1='16'
      x2='12'
      y2='21'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
  </Svg>
);

// Progress/Loading icon
export const ProgressIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Circle
      cx='12'
      cy='12'
      r='8'
      stroke={color}
      strokeWidth='2'
      strokeOpacity='0.2'
      fill='none'
    />
    <Path
      d='M12 4 A8 8 0 0 1 20 12'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
      fill='none'
    />
  </Svg>
);

// Badge icon
export const BadgeIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Circle cx='12' cy='12' r='8' stroke={color} strokeWidth='2' fill='none' />
    <Circle cx='17' cy='7' r='3' fill={color} />
  </Svg>
);

// Avatar icon
export const AvatarIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Circle cx='12' cy='12' r='9' stroke={color} strokeWidth='2' fill='none' />
    <Circle cx='12' cy='10' r='3' fill={color} />
    <Path
      d='M6 19 C6 16 8 14 12 14 C16 14 18 16 18 19'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
      fill='none'
    />
  </Svg>
);

// Card icon
export const CardIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Rect
      x='3'
      y='5'
      width='18'
      height='14'
      rx='2'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Line
      x1='6'
      y1='9'
      x2='12'
      y2='9'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
    <Line
      x1='6'
      y1='13'
      x2='18'
      y2='13'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeOpacity='0.5'
    />
    <Line
      x1='6'
      y1='16'
      x2='15'
      y2='16'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeOpacity='0.5'
    />
  </Svg>
);

// Accordion icon
export const AccordionIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Rect
      x='3'
      y='4'
      width='18'
      height='5'
      rx='1'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Rect
      x='3'
      y='10'
      width='18'
      height='5'
      rx='1'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Rect
      x='3'
      y='16'
      width='18'
      height='5'
      rx='1'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Line
      x1='12'
      y1='13'
      x2='12'
      y2='13'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
  </Svg>
);

// Tabs icon
export const TabsIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Rect
      x='2'
      y='8'
      width='20'
      height='12'
      rx='2'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Path
      d='M6 8 L6 5 L10 5 L10 8'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Path
      d='M12 8 L12 5 L16 5 L16 8'
      stroke={color}
      strokeWidth='2'
      fill={color}
      opacity='0.3'
    />
  </Svg>
);

// Alert icon
export const AlertIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Path
      d='M12 2 L2 20 L22 20 Z'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />
    <Line
      x1='12'
      y1='9'
      x2='12'
      y2='13'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
    <Circle cx='12' cy='17' r='1' fill={color} />
  </Svg>
);

// Menu icon
export const MenuIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Line
      x1='4'
      y1='6'
      x2='20'
      y2='6'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
    <Line
      x1='4'
      y1='12'
      x2='20'
      y2='12'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
    <Line
      x1='4'
      y1='18'
      x2='20'
      y2='18'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
  </Svg>
);

// List icon
export const ListIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Circle cx='6' cy='6' r='2' fill={color} />
    <Circle cx='6' cy='12' r='2' fill={color} />
    <Circle cx='6' cy='18' r='2' fill={color} />
    <Line
      x1='11'
      y1='6'
      x2='20'
      y2='6'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
    <Line
      x1='11'
      y1='12'
      x2='20'
      y2='12'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
    <Line
      x1='11'
      y1='18'
      x2='20'
      y2='18'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
  </Svg>
);

// Image icon
export const ImageIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Rect
      x='3'
      y='3'
      width='18'
      height='18'
      rx='2'
      stroke={color}
      strokeWidth='2'
      fill='none'
    />
    <Circle cx='8.5' cy='8.5' r='1.5' fill={color} />
    <Polyline
      points='3,17 8,12 12,16 16,12 21,17'
      stroke={color}
      strokeWidth='2'
      strokeLinejoin='round'
      fill='none'
    />
  </Svg>
);

// Search icon
export const SearchIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Circle cx='11' cy='11' r='6' stroke={color} strokeWidth='2' fill='none' />
    <Line
      x1='16'
      y1='16'
      x2='20'
      y2='20'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
  </Svg>
);

// Close/Clear icon (X)
export const CloseIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Line
      x1='6'
      y1='6'
      x2='18'
      y2='18'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
    <Line
      x1='18'
      y1='6'
      x2='6'
      y2='18'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
  </Svg>
);

// Back arrow icon (chevron left)
export const BackIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Polyline
      points='15,6 9,12 15,18'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />
  </Svg>
);

// Chevron right icon
export const ChevronRightIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Polyline
      points='9,6 15,12 9,18'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />
  </Svg>
);

// Clock icon (for timestamps)
export const ClockIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Circle cx='12' cy='12' r='9' stroke={color} strokeWidth='2' fill='none' />
    <Line
      x1='12'
      y1='12'
      x2='12'
      y2='7'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
    <Line
      x1='12'
      y1='12'
      x2='15'
      y2='12'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
  </Svg>
);

// Status Circle icon (filled dot for indicators)
export const StatusCircleIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Circle cx='12' cy='12' r='6' fill={color} />
  </Svg>
);

// Arrow Right icon (for state transitions)
export const ArrowRightIcon = ({ size = 24, color = '#666' }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Line
      x1='5'
      y1='12'
      x2='19'
      y2='12'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
    <Polyline
      points='15,8 19,12 15,16'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />
  </Svg>
);

// Icon mapper for component names
export const iconMap: Record<string, React.ComponentType<IconProps>> = {
  button: ButtonIcon,
  input: InputIcon,
  textfield: InputIcon,
  textinput: InputIcon,
  switch: SwitchIcon,
  toggle: SwitchIcon,
  checkbox: CheckboxIcon,
  radio: RadioIcon,
  slider: SliderIcon,
  select: SelectIcon,
  dropdown: SelectIcon,
  picker: SelectIcon,
  modal: ModalIcon,
  dialog: ModalIcon,
  tooltip: TooltipIcon,
  popover: TooltipIcon,
  progress: ProgressIcon,
  loader: ProgressIcon,
  spinner: ProgressIcon,
  badge: BadgeIcon,
  avatar: AvatarIcon,
  card: CardIcon,
  accordion: AccordionIcon,
  collapsible: AccordionIcon,
  tabs: TabsIcon,
  alert: AlertIcon,
  notification: AlertIcon,
  toast: AlertIcon,
  menu: MenuIcon,
  list: ListIcon,
  image: ImageIcon,
  default: ComponentIcon,
};

// Get icon based on component name
export const getIconForComponent = (
  name: string,
): React.ComponentType<IconProps> => {
  const normalized = name.toLowerCase().replace(/[^a-z]/g, '');
  return iconMap[normalized] || iconMap.default;
};
