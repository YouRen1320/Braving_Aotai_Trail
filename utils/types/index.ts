export interface ChoiceCost {
  hp?: number;
  hunger?: number;
  sanity?: number;
}

export interface SceneChoice {
  text: string;
  target?: string; // Target scene ID. 'resume' for random events.
  cost?: ChoiceCost;
  action?: string; // Special actions: 'restart', 'rest', 'loot_supplies', 'refill_water', 'look_back'
  requiredRole?: string; // Only visible if player has this role
  condition?: string; // e.g., 'shuiwozi_water' (must be true in worldFlags) or '!liang2_blocked'
}

export interface Scene {
  id: string;
  text: string;
  choices: SceneChoice[];
  bg?: string;
  type?: "normal" | "loot" | "event";
  weatherText?: Record<string, string>; // Key: WeatherType (sunny, storm, etc.)
  safe?: boolean; // If true, no random events will occur when transitioning to this scene
  progress?: number; // [NEW] Trip progress percentage (0-100)
  roleText?: Record<string, string>; // [NEW] Role-specific text overrides
}
