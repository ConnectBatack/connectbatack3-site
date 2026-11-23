import {
  AdministrationUtilisateursRLesService,
  executerAvecSessionLib2,
  lireCorpsMutation,
} from "@/lib2/serveur";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { corps, erreur } = await lireCorpsMutation(request);
  if (erreur) return erreur;
  return executerAvecSessionLib2(
    () => AdministrationUtilisateursRLesService.updateUserApiV1UsersUserIdPatch(id, corps),
    request,
  );
}
