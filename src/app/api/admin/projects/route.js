import { revalidatePath } from "next/cache";
import { ProjetsService, executerAvecSessionLib2, lireCorpsMutation } from "@/lib2/serveur";

export async function GET(request) {
  return executerAvecSessionLib2(() => ProjetsService.listProjectsApiV1ProjectsGet(true), request);
}

export async function POST(request) {
  const { corps, erreur } = await lireCorpsMutation(request);
  if (erreur) return erreur;
  const res = await executerAvecSessionLib2(
    () => ProjetsService.createProjectApiV1ProjectsPost(corps),
    request,
  );
  if (res.ok) {
    revalidatePath("/", "layout");
  }
  return res;
}

