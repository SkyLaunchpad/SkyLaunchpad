import { createFileRoute } from "@tanstack/react-router";
import { CreateToken } from "@/components/create-token";
import { Shell } from "@/components/ui";

export const Route = createFileRoute("/launchpad/create")({
  component: function LaunchCreatePage() {
    return (
      <Shell>
        <CreateToken />
      </Shell>
    );
  },
});
