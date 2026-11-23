import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { covidebaComptes, covidebaContact } from "@/donnees/covideba";
import { ecrituresExemple, instanceExemple } from "@/donnees/exemple-gestion";
import { projets as projetsDefaut } from "@/donnees/projets";
import { lireObjetJson, origineAutorisee } from "@/lib/requete";
import { ApiError } from "./core/ApiError";
import { OpenAPI } from "./core/OpenAPI";
import { AdministrationParamTresDuSiteComptesService } from "./services/AdministrationParamTresDuSiteComptesService";
import { AdministrationUtilisateursRLesService } from "./services/AdministrationUtilisateursRLesService";
import { AuthentificationService } from "./services/AuthentificationService";
import { DonsDPTsAvecReUService } from "./services/DonsDPTsAvecReUService";
import { MDiasFichiersLocauxService } from "./services/MDiasFichiersLocauxService";
import { PlanificationDInvestissementMilpV55Service } from "./services/PlanificationDInvestissementMilpV55Service";
import { ProjetsService } from "./services/ProjetsService";
import { RegistreFinancierChaNService } from "./services/RegistreFinancierChaNService";
import { SuiviDesProjetsRgpdService } from "./services/SuiviDesProjetsRgpdService";
import { TChesCandidatesService } from "./services/TChesCandidatesService";
import { VitrinePubliqueService } from "./services/VitrinePubliqueService";

export const BACKEND_API_URL = OpenAPI.BASE;
export const ACCESS_COOKIE = "cb3_access";
export const REFRESH_COOKIE = "cb3_refresh";
export const PARITE_FCFA = 655.957;

const tokenOverrideStorage = new AsyncLocalStorage<string>();

OpenAPI.TOKEN = async () => {
  const override = tokenOverrideStorage.getStore();
  if (override !== undefined) return override;
  try {
    const store = await cookies();
    return store.get(ACCESS_COOKIE)?.value || "";
  } catch {
    return "";
  }
};

export function cookieEstHttps(request: Request & { nextUrl?: URL }) {
  const proto = request.headers?.get("x-forwarded-proto");
  const protocol = request.nextUrl?.protocol;
  return protocol === "https:" || proto === "https";
}

export function appliquerCookiesSession(
  response: NextResponse,
  request: Request & { nextUrl?: URL },
  tokens: { access_token: string; refresh_token: string; expires_in?: number },
) {
  const secure = cookieEstHttps(request);
  response.cookies.set(ACCESS_COOKIE, tokens.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: tokens.expires_in || 60 * 30,
  });
  response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function effacerCookiesSession(response: NextResponse) {
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
}

export function reponseErreurLib2(err: unknown) {
  if (err instanceof ApiError) {
    const body = err.body && typeof err.body === "object" ? err.body : { detail: err.message };
    return NextResponse.json(body, { status: err.status || 502 });
  }
  return NextResponse.json(
    { detail: "Impossible de joindre le serveur principal (backend)." },
    { status: 503 },
  );
}

async function rafraichirJetonSiPossible() {
  try {
    const store = await cookies();
    const refreshToken = store.get(REFRESH_COOKIE)?.value;
    if (!refreshToken) return null;
    return await AuthentificationService.refreshTokensApiV1AuthRefreshPost({
      refresh_token: refreshToken,
    });
  } catch {
    return null;
  }
}

export async function executerAvecSessionLib2<T>(
  appel: () => Promise<T>,
  request?: Request & { nextUrl?: URL },
): Promise<NextResponse> {
  try {
    const store = await cookies();
    if (!store.get(ACCESS_COOKIE)?.value && !store.get(REFRESH_COOKIE)?.value) {
      return NextResponse.json({ detail: "Authentification requise." }, { status: 401 });
    }
    const data = await appel();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      const tokens = await rafraichirJetonSiPossible();
      if (tokens) {
        try {
          const data = await tokenOverrideStorage.run(tokens.access_token, appel);
          const res = NextResponse.json(data, { status: 200 });
          if (request) appliquerCookiesSession(res, request, tokens);
          return res;
        } catch (retryErr) {
          return reponseErreurLib2(retryErr);
        }
      }
    }
    return reponseErreurLib2(err);
  }
}

export async function lireCorpsMutation(request: Request) {
  if (!origineAutorisee(request)) {
    return { erreur: NextResponse.json({ detail: "Origine non autorisée." }, { status: 403 }) };
  }
  const corps = await lireObjetJson(request);
  if (!corps) {
    return { erreur: NextResponse.json({ detail: "Requête JSON invalide." }, { status: 400 }) };
  }
  return { corps };
}

function avecDelai<T>(promesse: Promise<T>, ms = 1500): Promise<T> {
  return Promise.race([
    promesse,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

const SLUGS_PHOTOS_STATIQUES = new Set([
  "accueil-chants",
  "batack-paysage",
  "dispensaire-facade",
  "ecole-publique",
  "installation-electrique",
  "marche",
  "panneau-solaire",
  "salle-de-classe",
]);

function urlPhotoProjet(p: { photo_slug?: string | null; photo_id?: string | null }) {
  if (p.photo_slug && SLUGS_PHOTOS_STATIQUES.has(p.photo_slug)) {
    return `/images/${p.photo_slug}.jpg`;
  }
  if (p.photo_id) {
    return `/api/media/${encodeURIComponent(p.photo_id)}`;
  }
  return "/images/batack-paysage.jpg";
}

function normaliserProjetBackend(p: any) {
  const objectifFcfa = Math.max(0, Math.round(Number(p.target_amount_eur || 0) * PARITE_FCFA));
  const collecteFcfa = Math.max(0, Math.round(Number(p.collected_amount_eur || 0) * PARITE_FCFA));
  return {
    id: p.slug,
    slug: p.slug,
    photo: p.photo_slug || "batack-paysage",
    photoId: p.photo_id || null,
    photoSrc: urlPhotoProjet(p),
    collecte: collecteFcfa,
    objectif: objectifFcfa,
    contributeurs: p.contributors_count || 0,
    isFeaturedNeed: Boolean(p.is_featured_need),
    status: p.status,
    textes: {
      category: p.category || {},
      title: p.title || {},
      tagline: p.tagline || {},
      description: p.description || {},
    },
  };
}

export async function chargerInfosCovideba() {
  try {
    const data = await avecDelai(DonsDPTsAvecReUService.getPaymentAccountsApiV1DonationsAccountsGet());
    return {
      contact: {
        telephone: data.covideba_phone || covidebaContact.telephone,
        email: data.covideba_email || covidebaContact.email,
        adressePostale: data.postal_address || "",
        autresInfos: data.other_info || "",
      },
      comptes: {
        titulaire: data.bank_holder || covidebaComptes.titulaire,
        banque: data.bank_name || covidebaComptes.banque,
        compteBancaire: data.bank_account || covidebaComptes.compteBancaire,
        mtnMomo: data.mobile_money_mtn || covidebaComptes.mtnMomo,
        orangeMoney: data.mobile_money_orange || covidebaComptes.orangeMoney,
        adressePostale: data.postal_address || "",
        autresInfos: data.other_info || "",
      },
    };
  } catch {
    return {
      contact: { ...covidebaContact, adressePostale: "", autresInfos: "" },
      comptes: { ...covidebaComptes, adressePostale: "", autresInfos: "" },
    };
  }
}

export async function chargerProjetsSite() {
  try {
    const items = await avecDelai(ProjetsService.listProjectsApiV1ProjectsGet(false));
    if (Array.isArray(items) && items.length > 0) {
      return items.map(normaliserProjetBackend);
    }
  } catch {
    // Repli automatique sur les données locales lorsque le backend est indisponible.
  }
  return projetsDefaut.map((p) => ({
    ...p,
    photoSrc: `/images/${p.photo}.jpg`,
    isFeaturedNeed: p.id === "dispensaire",
    textes: null,
  }));
}

export async function chargerProjetSite(slug: string) {
  try {
    const item = await avecDelai(ProjetsService.getProjectApiV1ProjectsSlugGet(slug));
    return normaliserProjetBackend(item);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    const local = projetsDefaut.find((p) => p.id === slug);
    return local
      ? { ...local, photoSrc: `/images/${local.photo}.jpg`, isFeaturedNeed: local.id === "dispensaire", textes: null }
      : null;
  }
}

export async function chargerMediaBinaire(assetId: string) {
  const token =
    typeof OpenAPI.TOKEN === "function" ? await OpenAPI.TOKEN({ method: "GET", url: "" }) : OpenAPI.TOKEN;
  const headers: Record<string, string> = {};
  if (typeof token === "string" && token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(`${OpenAPI.BASE}/api/v1/media/files/${encodeURIComponent(assetId)}`, {
    headers,
    cache: "no-store",
  });
}

function formaterEcritureRegistre(e: any) {
  const entree = e.direction === "entree" ? Number(e.amount || 0) : 0;
  const sortie = e.direction === "sortie" ? Number(e.amount || 0) : 0;
  const hashCourt =
    typeof e.entry_hash === "string" && e.entry_hash.length > 8
      ? `${e.entry_hash.slice(0, 4)}…${e.entry_hash.slice(-4)}`
      : e.entry_hash || "";
  return {
    id: e.id,
    numero: e.entry_number,
    date: e.entry_date,
    libelle: e.label,
    compte: e.account,
    entree,
    sortie,
    devise: e.currency,
    etat: e.status,
    hash: hashCourt,
  };
}

export async function chargerTransparenceSite() {
  try {
    const data = await avecDelai(VitrinePubliqueService.getPublicTransparencyApiV1PublicTransparenceGet());
    const collectedFcfa = Math.max(0, Math.round(Number(data.total_collected_eur || 0) * PARITE_FCFA));
    const spentFcfa = Math.max(0, Math.round(Number(data.total_spent_eur || 0) * PARITE_FCFA));
    const balanceFcfa = Math.max(0, Math.round(Number(data.available_balance_eur || 0) * PARITE_FCFA));
    return {
      depuisBackend: true,
      collectedFcfa,
      spentFcfa,
      balanceFcfa,
      donorsCount: Number(data.donors_count || 0),
      projectsCount: Number(data.projects_count || 0),
      recentEntries: Array.isArray(data.recent_entries) ? data.recent_entries : [],
    };
  } catch {
    return {
      depuisBackend: false,
      collectedFcfa: 0,
      spentFcfa: 0,
      balanceFcfa: 0,
      donorsCount: 0,
      projectsCount: 0,
      recentEntries: [],
    };
  }
}

export async function chargerRegistreGestion(limit = 100) {
  try {
    const [summary, entriesRes] = await Promise.all([
      RegistreFinancierChaNService.getSummaryApiV1RegistrySummaryGet(),
      RegistreFinancierChaNService.listEntriesApiV1RegistryEntriesGet(
        undefined,
        undefined,
        undefined,
        undefined,
        limit,
        0,
      ),
    ]);
    return {
      depuisBackend: true,
      summary,
      ecritures: Array.isArray(entriesRes?.items) ? entriesRes.items.map(formaterEcritureRegistre) : [],
    };
  } catch {
    return {
      depuisBackend: false,
      summary: null,
      ecritures: ecrituresExemple,
    };
  }
}

export async function chargerInstancePlanGestion() {
  try {
    const [summary, tasks, plans] = await Promise.all([
      RegistreFinancierChaNService.getSummaryApiV1RegistrySummaryGet(),
      TChesCandidatesService.listTasksApiV1TasksGet(),
      PlanificationDInvestissementMilpV55Service.listPlansApiV1PlansGet().catch(() => []),
    ]);

    const latestPlan = Array.isArray(plans) && plans.length > 0 ? plans[0] : null;
    const planInst = latestPlan?.instance_data || {};
    const precedences: number[][] = [];
    const taches = (Array.isArray(tasks) ? tasks : []).map((t) => {
      for (const pred of t.predecessor_code_ids || []) {
        precedences.push([pred, t.code_id]);
      }
      return {
        id: t.code_id,
        libelle: t.label,
        cout: Math.max(0, Math.round(Number(t.cost_eur || 0) * PARITE_FCFA)),
        duree: Number(t.duration_months || 1),
        poids: Number(t.weight || 1),
      };
    });

    const S0 = summary ? Number(summary.available_balance_fcfa || 0) : instanceExemple.S0;
    const Smin = Number.isFinite(Number(planInst.Smin)) ? Number(planInst.Smin) : instanceExemple.Smin;
    const h = Number.isInteger(planInst.h) ? planInst.h : instanceExemple.h;
    const delta = Number.isFinite(Number(planInst.delta)) ? Number(planInst.delta) : instanceExemple.delta;
    const D =
      Array.isArray(planInst.D) && planInst.D.length > 0
        ? planInst.D.map((x: any) => Math.max(0, Math.round(Number(x || 0))))
        : Array.from({ length: h }, () => instanceExemple.D[0]);

    return {
      depuisBackend: true,
      instance: {
        nom: latestPlan?.name || "plan_batack",
        h,
        S0,
        Smin,
        delta,
        D,
        taches: taches.length > 0 ? taches : instanceExemple.taches,
        precedences: taches.length > 0 ? precedences : instanceExemple.precedences,
      },
    };
  } catch {
    return {
      depuisBackend: false,
      instance: instanceExemple,
    };
  }
}

export {
  AdministrationParamTresDuSiteComptesService,
  AdministrationUtilisateursRLesService,
  ApiError,
  AuthentificationService,
  DonsDPTsAvecReUService,
  MDiasFichiersLocauxService,
  OpenAPI,
  PlanificationDInvestissementMilpV55Service,
  ProjetsService,
  RegistreFinancierChaNService,
  SuiviDesProjetsRgpdService,
  TChesCandidatesService,
  VitrinePubliqueService,
};
