import { FC } from 'react';
import {
  PaintBucket,
  Hammer,
  Calculator,
  Sparkles,
  Wrench,
  Home as HomeIcon,
  FolderOpen,
  MoreHorizontal,
  Palette,
  Building,
} from 'lucide-react';

// Define the mapping of icon names to components
const iconMap: { [key: string]: FC<any> } = {
  PaintBucket,
  Hammer,
  Calculator,
  Sparkles,
  Wrench,
  HomeIcon,
  FolderOpen,
  MoreHorizontal,
  Palette,
  Building,
};

interface IconProps {
  name: string;
  className?: string;
}

const Icon: FC<IconProps> = ({ name, className }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    // Return a default icon or null if the name is not found
    return <MoreHorizontal className={className} />;
  }

  return <IconComponent className={className} />;
};

export default Icon;
