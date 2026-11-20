import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "~/components/LegalPage";

export const Route = createFileRoute("/dpa")({
  head: () => legalHead("dpa"),
  component: () => <LegalPage slug="dpa" />,
});
