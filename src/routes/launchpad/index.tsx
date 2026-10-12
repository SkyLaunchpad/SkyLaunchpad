import { createFileRoute } from "@tanstack/react-router";
import { LaunchesBoard } from "@/components/launches-board";
import { Shell } from "@/components/ui";

export const Route = createFileRoute("/launchpad/")({
  component: function LaunchpadPage() {
    return (
      <Shell>
        <LaunchesBoard />
      </Shell>
    );
  },
});
