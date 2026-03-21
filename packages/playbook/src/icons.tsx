import * as React from 'react';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Default icon for components
export const ComponentIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Rect
      fill='none'
      height='7'
      rx='1'
      stroke={color}
      strokeWidth='2'
      width='7'
      x='3'
      y='3'
    />
    <Rect
      fill='none'
      height='7'
      rx='1'
      stroke={color}
      strokeWidth='2'
      width='7'
      x='14'
      y='3'
    />
    <Rect
      fill='none'
      height='7'
      rx='1'
      stroke={color}
      strokeWidth='2'
      width='7'
      x='3'
      y='14'
    />
    <Rect
      fill='none'
      height='7'
      rx='1'
      stroke={color}
      strokeWidth='2'
      width='7'
      x='14'
      y='14'
    />
  </Svg>
);

// Button icon
export const ButtonIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Rect
      fill='none'
      height='8'
      rx='2'
      stroke={color}
      strokeWidth='2'
      width='18'
      x='3'
      y='8'
    />
    <Circle cx='8' cy='12' fill={color} r='1.5' />
  </Svg>
);

// Input/TextField icon
export const InputIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Rect
      fill='none'
      height='12'
      rx='2'
      stroke={color}
      strokeWidth='2'
      width='20'
      x='2'
      y='6'
    />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='6'
      x2='12'
      y1='12'
      y2='12'
    />
  </Svg>
);

// Switch/Toggle icon
export const SwitchIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Rect
      fill='none'
      height='6'
      rx='3'
      stroke={color}
      strokeWidth='2'
      width='16'
      x='4'
      y='9'
    />
    <Circle cx='8' cy='12' fill={color} r='2' />
  </Svg>
);

// Checkbox icon
export const CheckboxIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Rect
      fill='none'
      height='16'
      rx='2'
      stroke={color}
      strokeWidth='2'
      width='16'
      x='4'
      y='4'
    />
    <Polyline
      fill='none'
      points='7,12 10,15 17,8'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
    />
  </Svg>
);

// Radio icon
export const RadioIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Circle cx='12' cy='12' fill='none' r='8' stroke={color} strokeWidth='2' />
    <Circle cx='12' cy='12' fill={color} r='4' />
  </Svg>
);

// Slider icon
export const SliderIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='4'
      x2='20'
      y1='12'
      y2='12'
    />
    <Circle cx='14' cy='12' fill={color} r='3' stroke={color} strokeWidth='2' />
  </Svg>
);

// Select/Dropdown icon
export const SelectIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Rect
      fill='none'
      height='12'
      rx='2'
      stroke={color}
      strokeWidth='2'
      width='18'
      x='3'
      y='6'
    />
    <Polyline
      fill='none'
      points='9,10 12,13 15,10'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
    />
  </Svg>
);

// Modal/Dialog icon
export const ModalIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Rect
      fill='none'
      height='12'
      rx='2'
      stroke={color}
      strokeWidth='2'
      width='14'
      x='5'
      y='7'
    />
    <Rect fill={color} height='3' rx='1' width='8' x='8' y='4' />
  </Svg>
);

// Tooltip icon
export const TooltipIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Rect
      fill='none'
      height='10'
      rx='2'
      stroke={color}
      strokeWidth='2'
      width='16'
      x='4'
      y='3'
    />
    <Path d='M12 13 L10 16 L14 16 Z' fill={color} />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='12'
      x2='12'
      y1='16'
      y2='21'
    />
  </Svg>
);

// Progress/Loading icon
export const ProgressIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Circle
      cx='12'
      cy='12'
      fill='none'
      r='8'
      stroke={color}
      strokeOpacity='0.2'
      strokeWidth='2'
    />
    <Path
      d='M12 4 A8 8 0 0 1 20 12'
      fill='none'
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
    />
  </Svg>
);

// Badge icon
export const BadgeIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Circle cx='12' cy='12' fill='none' r='8' stroke={color} strokeWidth='2' />
    <Circle cx='17' cy='7' fill={color} r='3' />
  </Svg>
);

// Avatar icon
export const AvatarIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Circle cx='12' cy='12' fill='none' r='9' stroke={color} strokeWidth='2' />
    <Circle cx='12' cy='10' fill={color} r='3' />
    <Path
      d='M6 19 C6 16 8 14 12 14 C16 14 18 16 18 19'
      fill='none'
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
    />
  </Svg>
);

// Card icon
export const CardIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Rect
      fill='none'
      height='14'
      rx='2'
      stroke={color}
      strokeWidth='2'
      width='18'
      x='3'
      y='5'
    />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='6'
      x2='12'
      y1='9'
      y2='9'
    />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeOpacity='0.5'
      strokeWidth='1.5'
      x1='6'
      x2='18'
      y1='13'
      y2='13'
    />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeOpacity='0.5'
      strokeWidth='1.5'
      x1='6'
      x2='15'
      y1='16'
      y2='16'
    />
  </Svg>
);

// Accordion icon
export const AccordionIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Rect
      fill='none'
      height='5'
      rx='1'
      stroke={color}
      strokeWidth='2'
      width='18'
      x='3'
      y='4'
    />
    <Rect
      fill='none'
      height='5'
      rx='1'
      stroke={color}
      strokeWidth='2'
      width='18'
      x='3'
      y='10'
    />
    <Rect
      fill='none'
      height='5'
      rx='1'
      stroke={color}
      strokeWidth='2'
      width='18'
      x='3'
      y='16'
    />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='12'
      x2='12'
      y1='13'
      y2='13'
    />
  </Svg>
);

// Tabs icon
export const TabsIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Rect
      fill='none'
      height='12'
      rx='2'
      stroke={color}
      strokeWidth='2'
      width='20'
      x='2'
      y='8'
    />
    <Path
      d='M6 8 L6 5 L10 5 L10 8'
      fill='none'
      stroke={color}
      strokeWidth='2'
    />
    <Path
      d='M12 8 L12 5 L16 5 L16 8'
      fill={color}
      opacity='0.3'
      stroke={color}
      strokeWidth='2'
    />
  </Svg>
);

// Alert icon
export const AlertIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Path
      d='M12 2 L2 20 L22 20 Z'
      fill='none'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
    />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='12'
      x2='12'
      y1='9'
      y2='13'
    />
    <Circle cx='12' cy='17' fill={color} r='1' />
  </Svg>
);

// Menu icon
export const MenuIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='4'
      x2='20'
      y1='6'
      y2='6'
    />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='4'
      x2='20'
      y1='12'
      y2='12'
    />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='4'
      x2='20'
      y1='18'
      y2='18'
    />
  </Svg>
);

// List icon
export const ListIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Circle cx='6' cy='6' fill={color} r='2' />
    <Circle cx='6' cy='12' fill={color} r='2' />
    <Circle cx='6' cy='18' fill={color} r='2' />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='11'
      x2='20'
      y1='6'
      y2='6'
    />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='11'
      x2='20'
      y1='12'
      y2='12'
    />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='11'
      x2='20'
      y1='18'
      y2='18'
    />
  </Svg>
);

// Image icon
export const ImageIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Rect
      fill='none'
      height='18'
      rx='2'
      stroke={color}
      strokeWidth='2'
      width='18'
      x='3'
      y='3'
    />
    <Circle cx='8.5' cy='8.5' fill={color} r='1.5' />
    <Polyline
      fill='none'
      points='3,17 8,12 12,16 16,12 21,17'
      stroke={color}
      strokeLinejoin='round'
      strokeWidth='2'
    />
  </Svg>
);

// Search icon
export const SearchIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Circle cx='11' cy='11' fill='none' r='6' stroke={color} strokeWidth='2' />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='16'
      x2='20'
      y1='16'
      y2='20'
    />
  </Svg>
);

// Close/Clear icon (X)
export const CloseIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='6'
      x2='18'
      y1='6'
      y2='18'
    />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='18'
      x2='6'
      y1='6'
      y2='18'
    />
  </Svg>
);

// Back arrow icon (chevron left)
export const BackIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Polyline
      fill='none'
      points='15,6 9,12 15,18'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
    />
  </Svg>
);

// Chevron right icon
export const ChevronRightIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Polyline
      fill='none'
      points='9,6 15,12 9,18'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
    />
  </Svg>
);

// Clock icon (for timestamps)
export const ClockIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Circle cx='12' cy='12' fill='none' r='9' stroke={color} strokeWidth='2' />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='12'
      x2='12'
      y1='12'
      y2='7'
    />
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='12'
      x2='15'
      y1='12'
      y2='12'
    />
  </Svg>
);

// Status Circle icon (filled dot for indicators)
export const StatusCircleIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Circle cx='12' cy='12' fill={color} r='6' />
  </Svg>
);

// Arrow Right icon (for state transitions)
export const ArrowRightIcon = ({ color = '#666', size = 24 }: IconProps) => (
  <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
    <Line
      stroke={color}
      strokeLinecap='round'
      strokeWidth='2'
      x1='5'
      x2='19'
      y1='12'
      y2='12'
    />
    <Polyline
      fill='none'
      points='15,8 19,12 15,16'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
    />
  </Svg>
);

// Icon mapper for component names
export const iconMap: Record<string, React.ComponentType<IconProps>> = {
  accordion: AccordionIcon,
  alert: AlertIcon,
  avatar: AvatarIcon,
  badge: BadgeIcon,
  button: ButtonIcon,
  card: CardIcon,
  checkbox: CheckboxIcon,
  collapsible: AccordionIcon,
  default: ComponentIcon,
  dialog: ModalIcon,
  dropdown: SelectIcon,
  image: ImageIcon,
  input: InputIcon,
  list: ListIcon,
  loader: ProgressIcon,
  menu: MenuIcon,
  modal: ModalIcon,
  notification: AlertIcon,
  picker: SelectIcon,
  popover: TooltipIcon,
  progress: ProgressIcon,
  radio: RadioIcon,
  select: SelectIcon,
  slider: SliderIcon,
  spinner: ProgressIcon,
  switch: SwitchIcon,
  tabs: TabsIcon,
  textfield: InputIcon,
  textinput: InputIcon,
  toast: AlertIcon,
  toggle: SwitchIcon,
  tooltip: TooltipIcon,
};

// Get icon based on component name
export const getIconForComponent = (
  name: string,
): React.ComponentType<IconProps> => {
  const normalized = name.toLowerCase().replace(/[^a-z]/g, '');
  return iconMap[normalized] || iconMap.default;
};
