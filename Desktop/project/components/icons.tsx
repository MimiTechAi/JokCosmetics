import {
  User,
  Store,
  Loader2,
  Sparkles,
  X,
  Plus,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  user: User,
  store: Store,
  spinner: Loader2,
  sparkles: Sparkles,
  close: X,
  plus: Plus,
} as const;