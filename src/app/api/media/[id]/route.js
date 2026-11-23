import { NextResponse } from "next/server";
import { chargerMediaBinaire } from "@/lib2/serveur";

export async function GET(_request, { params }) {
  const { id } = await params;
  try {
    const res = await chargerMediaBinaire(id);
    if (!res.ok) {
      return NextResponse.json({ detail: "Média introuvable." }, { status: res.status });
    }
    const buf = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ detail: "Média indisponible." }, { status: 503 });
  }
}

