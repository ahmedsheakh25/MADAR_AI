import { Home, ImageIcon, User, Settings, Grid } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export interface NavItem {
  id: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  requiresAuth?: boolean;
}

export const useNavItems = () => {
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    {
      id: "home",
      labelKey: "common.navigation.home",
      icon: Home,
      path: "/",
      requiresAuth: false,
    },
    {
      id: "generator",
      labelKey: "common.navigation.generator",
      icon: Grid,
      path: "/generator",
      requiresAuth: false,
    },
    {
      id: "gallery",
      labelKey: "common.navigation.gallery",
      icon: ImageIcon,
      path: "/gallery",
      requiresAuth: false,
    },
  ];

  return navItems.map((item) => ({
    ...item,
    label: t(item.labelKey),
  }));
};
