import { ProjetsService, executerAvecSessionLib2, lireCorpsMutation } from "@/lib2/serveur";

export async function POST(request) {
  const { corps, erreur } = await lireCorpsMutation(request);
  if (erreur) return erreur;
  return executerAvecSessionLib2(
    () => ProjetsService.translateProjectApiV1ProjectsTranslatePost(corps),
    request,
  );
}

