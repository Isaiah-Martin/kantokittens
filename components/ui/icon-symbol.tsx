// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@react-native-vector-icons/material-icons";
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'document.badge.clock' : 'schedule',
  '0.circle' : 'groups-3',
  'cat.circle.fill' : 'pets',
  '0.square' : 'coffee',
  'viewfinder' : 'landscape',
  'calendar' : 'calendar-view-day',
  'iphone.circle' : 'arrow-back-ios-new',
  'info' : 'info-outline',
  'lock.rectangle' : 'logout'
  //We need a Calendar, circleOutline, Information Circle and Logout
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
