import { NextResponse } from "next/server";
import { origineAutorisee } from "@/lib/requete";
import { MDiasFichiersLocauxService, executerAvecSessionLib2 } from "@/lib2/serveur";

export async function GET(request) {
  return executerAvecSessionLib2(
    () => MDiasFichiersLocauxService.listMediaApiV1MediaGet("photo", 100, 0),
    request,
  );
}

export async function POST(request) {
  if (!origineAutorisee(request)) {
    return NextResponse.json({ detail: "Origine non autorisée." }, { status: 403 });
  }
  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ detail: "Requête multipart invalide." }, { status: 400 });
  }
  const file = form.get("file");
  const slug = String(form.get("slug") || "").trim();
  if (!(file instanceof File) || file.size <= 0) {
    return NextResponse.json({ detail: "Fichier image requis." }, { status: 400 });
  }

  return executerAvecSessionLib2(
    () =>
      MDiasFichiersLocauxService.uploadMediaApiV1MediaUploadPost({
        file,
        category: "photo",
        ...(slug ? { slug } : {}),
      }),
    request,
  );
}

