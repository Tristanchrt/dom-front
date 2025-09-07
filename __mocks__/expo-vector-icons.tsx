import React from 'react';
import { Text } from 'react-native';

// Generic icon stub used for all exported icon sets
const Icon = React.forwardRef<any, any>((props, ref) => {
  // Render a simple Text to avoid requiring native font loader
  return <Text ref={ref} {...props} />;
});

// Default export behaves like a module with any icon set name
const proxy = new Proxy({}, {
  get: () => Icon,
});

export default proxy;

// Named exports for common icon sets
export const FontAwesome = Icon;
export const AntDesign = Icon;
export const MaterialIcons = Icon;
export const Ionicons = Icon;
export const Entypo = Icon;
export const Feather = Icon;
export const EvilIcons = Icon;
export const Foundation = Icon;
export const MaterialCommunityIcons = Icon;
export const SimpleLineIcons = Icon;
export const Octicons = Icon;
export const Zocial = Icon;


