import { cookies } from "next/headers";
import { PANEL_COOKIE_NAME, isValidPanelToken } from "@/core/auth/panel";
import { PanelLogin } from "@/clients/verdepower/components/mediamaraton/panel/PanelLogin";
import { PanelDashboard } from "@/clients/verdepower/components/mediamaraton/panel/PanelDashboard";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(PANEL_COOKIE_NAME)?.value;
  const authenticated = isValidPanelToken(token);

  return (
    <main className="min-h-screen bg-vp-forest-dark">
      {authenticated ? <PanelDashboard /> : <PanelLogin />}
    </main>
  );
}
