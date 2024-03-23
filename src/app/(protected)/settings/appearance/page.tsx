import ThemeRadioGroup from "./components/theme-radio-group";

export default function SettingsAppearancePage() {
 
  return (
    <div className="w-1/2 mt-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-navTextColor">Appearance</h3>
        <ThemeRadioGroup />
      </div>
    </div>
  );
}
