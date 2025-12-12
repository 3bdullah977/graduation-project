export default function PreferencesPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl">Preferences</h1>
        <p className="text-muted-foreground text-sm">
          Manage your workspace preferences and settings
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Preferences content will go here
        </p>
      </div>
    </div>
  );
}
