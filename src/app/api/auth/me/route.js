import {
  AuthentificationService,
  executerAvecSessionLib2,
  lireCorpsMutation,
} from "@/lib2/serveur";

export async function GET(request) {
  return executerAvecSessionLib2(() => AuthentificationService.getMeApiV1AuthMeGet(), request);
}

export async function PATCH(request) {
  const { corps, erreur } = await lireCorpsMutation(request);
  if (erreur) return erreur;
  return executerAvecSessionLib2(
    () => AuthentificationService.updateMeApiV1AuthMePatch(corps),
    request,
  );
}
