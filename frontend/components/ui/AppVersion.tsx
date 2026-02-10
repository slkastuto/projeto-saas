import { APP_CONFIG } from "@/config/app";

export function AppVersion() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/70">
      {APP_CONFIG.name} • {APP_CONFIG.version}
    </div>
  );
}
