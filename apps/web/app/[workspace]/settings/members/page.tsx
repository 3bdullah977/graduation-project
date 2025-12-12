export default function MembersPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl">Members</h1>
        <p className="text-muted-foreground text-sm">
          Manage workspace members and their permissions
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">Members content will go here</p>
      </div>
    </div>
  );
}
