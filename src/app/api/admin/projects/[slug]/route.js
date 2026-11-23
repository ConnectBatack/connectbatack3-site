import { revalidatePath } from "next/cache";
import { ProjetsService, executerAvecSessionLib2, lireCorpsMutation } from "@/lib2/serveur";

export async function PATCH(request, { params }) {
  const { slug } = await params;
  const { corps, erreur } = await lireCorpsMutation(request);
  if (erreur) return erreur;
  const res = await executerAvecSessionLib2(
    () => ProjetsService.updateProjectApiV1ProjectsSlugPatch(slug, corps),
    request,
  );
  if (res.ok) {
    revalidatePath("/", "layout");
  }
  return res;
}

export async function DELETE(request, { params }) {
  const { slug } = await params;
  const res = await executerAvecSessionLib2(
    () => ProjetsService.deleteProjectApiV1ProjectsSlugDelete(slug),
    request,
  );
  if (res.ok) {
    revalidatePath("/", "layout");
  }
  return res;
}

