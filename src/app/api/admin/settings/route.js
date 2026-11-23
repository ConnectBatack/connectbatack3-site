import { revalidatePath } from "next/cache";
import {
  AdministrationParamTresDuSiteComptesService,
  executerAvecSessionLib2,
  lireCorpsMutation,
} from "@/lib2/serveur";

export async function GET(request) {
  return executerAvecSessionLib2(
    () => AdministrationParamTresDuSiteComptesService.readOrganizationSettingsApiV1SettingsOrganizationGet(),
    request,
  );
}

export async function PUT(request) {
  const { corps, erreur } = await lireCorpsMutation(request);
  if (erreur) return erreur;
  const res = await executerAvecSessionLib2(
    () =>
      AdministrationParamTresDuSiteComptesService.writeOrganizationSettingsApiV1SettingsOrganizationPut(
        corps,
      ),
    request,
  );
  if (res.ok) {
    revalidatePath("/", "layout");
  }
  return res;
}
