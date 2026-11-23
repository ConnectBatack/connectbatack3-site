import {
  AdministrationUtilisateursRLesService,
  executerAvecSessionLib2,
  lireCorpsMutation,
} from "@/lib2/serveur";

export async function GET(request) {
  return executerAvecSessionLib2(
    () => AdministrationUtilisateursRLesService.listUsersApiV1UsersGet(undefined, undefined, 100, 0),
    request,
  );
}

export async function POST(request) {
  const { corps, erreur } = await lireCorpsMutation(request);
  if (erreur) return erreur;
  return executerAvecSessionLib2(
    () => AdministrationUtilisateursRLesService.createUserApiV1UsersPost(corps),
    request,
  );
}
