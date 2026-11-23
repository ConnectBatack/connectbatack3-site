import {
  AuthentificationService,
  effacerCookiesSession,
  executerAvecSessionLib2,
  lireCorpsMutation,
} from "@/lib2/serveur";

export async function POST(request) {
  const { corps, erreur } = await lireCorpsMutation(request);
  if (erreur) return erreur;
  const res = await executerAvecSessionLib2(
    () => AuthentificationService.changePasswordApiV1AuthChangePasswordPost(corps),
    request,
  );
  if (res.ok) {
    effacerCookiesSession(res);
  }
  return res;
}
