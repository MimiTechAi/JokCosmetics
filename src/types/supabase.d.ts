type Json =
  | string
  | number
  | boolean
  | { [key: string]: Json | undefined }
  | Json[];

export type { Json };
