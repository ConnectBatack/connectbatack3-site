import "server-only";
import { redirect } from "next/navigation";
import { AuthentificationService } from "@/lib2/serveur";

export const ROLES = {
  admin: "admin",
  membre: "membre",
  tresorier: "tresorier",
  encadrant: "encadrant",
};

export async function lireSession() {
  try {
    const user = await AuthentificationService.getMeApiV1AuthMeGet();
    return {
      maquette: false,
      id: user.id,
      email: user.email,
      nom: user.full_name,
      telephone: user.phone || "",
      role: user.role,
      mustChangePassword: Boolean(user.must_change_password),
      totpEnabled: Boolean(user.totp_enabled),
    };
  } catch {
    return null;
  }
}

export async function exigerSession(lang, rolesAutorises = Object.values(ROLES)) {
  const session = await lireSession();
  if (!session) redirect(`/${lang}/connexion`);
  if (!rolesAutorises.includes(session.role)) redirect(`/${lang}/connexion`);
  return session;
}
