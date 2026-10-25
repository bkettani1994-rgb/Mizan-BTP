"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { chantierDemo, depensesDemo, fournisseursDemo } from "@/lib/mock-data";
import type { Chantier, Depense, Fournisseur } from "@/lib/types";
import {
  chantierDepuisLigne,
  chantierVersLigne,
  depenseDepuisLigne,
  depenseVersLigne,
  fournisseurDepuisLigne,
  fournisseurVersLigne,
  type ChantierRow,
  type DepenseRow,
  type FournisseurRow,
} from "@/lib/supabase/mappers";

type DonneesPersistees = {
  chantiers: Chantier[];
  depenses: Depense[];
  fournisseurs: Fournisseur[];
};

function donneesVides(): DonneesPersistees {
  return { chantiers: [], depenses: [], fournisseurs: [] };
}

type AppContextValue = DonneesPersistees & {
  /** Vrai pendant le tout premier chargement des données depuis le cloud. */
  chargement: boolean;
  ajouterDepense: (depense: Omit<Depense, "id">) => Promise<void>;
  /** Met à jour une dépense existante. */
  modifierDepense: (id: string, patch: Partial<Omit<Depense, "id">>) => Promise<void>;
  /** Supprime définitivement une dépense. */
  supprimerDepense: (id: string) => Promise<void>;
  /** Crée un chantier et renvoie son identifiant (utile pour y naviguer ensuite). */
  ajouterChantier: (chantier: Omit<Chantier, "id">) => Promise<string>;
  /** Met à jour un chantier existant (ex. compléter ses informations détaillées). */
  modifierChantier: (id: string, patch: Partial<Omit<Chantier, "id">>) => Promise<void>;
  /** Supprime un chantier et toutes ses dépenses associées. */
  supprimerChantier: (id: string) => Promise<void>;
  /** Crée un fournisseur et renvoie son identifiant. */
  ajouterFournisseur: (fournisseur: Omit<Fournisseur, "id">) => Promise<string>;
  /** Met à jour les coordonnées d'un fournisseur existant. */
  modifierFournisseur: (id: string, patch: Partial<Omit<Fournisseur, "id">>) => Promise<void>;
  /** Retire un fournisseur du carnet (n'efface pas les dépenses déjà enregistrées à son nom). */
  supprimerFournisseur: (id: string) => Promise<void>;
  /** Efface toutes les données du compte et réinsère le chantier de démonstration. */
  reinitialiser: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

/**
 * Sème le chantier de démonstration pour un tout nouveau compte, afin que
 * l'utilisateur découvre l'application déjà peuplée plutôt qu'une page vide.
 */
async function semerDonneesDemo(
  supabase: SupabaseClient,
  userId: string,
): Promise<DonneesPersistees> {
  const { data: chantierRow, error: erreurChantier } = await supabase
    .from("chantiers")
    .insert({ ...chantierVersLigne(chantierDemo), user_id: userId })
    .select()
    .single();
  if (erreurChantier || !chantierRow) throw erreurChantier ?? new Error("Échec du semis du chantier de démonstration");

  const chantier = chantierDepuisLigne(chantierRow as ChantierRow);

  const { data: depensesRows, error: erreurDepenses } = await supabase
    .from("depenses")
    .insert(
      depensesDemo.map((depense) => ({
        ...depenseVersLigne({ ...depense, chantierId: chantier.id }),
        user_id: userId,
      })),
    )
    .select();
  if (erreurDepenses) throw erreurDepenses;

  const { data: fournisseursRows, error: erreurFournisseurs } = await supabase
    .from("fournisseurs")
    .insert(fournisseursDemo.map((fournisseur) => ({ ...fournisseurVersLigne(fournisseur), user_id: userId })))
    .select();
  if (erreurFournisseurs) throw erreurFournisseurs;

  return {
    chantiers: [chantier],
    depenses: ((depensesRows ?? []) as DepenseRow[]).map(depenseDepuisLigne),
    fournisseurs: ((fournisseursRows ?? []) as FournisseurRow[]).map(fournisseurDepuisLigne),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [donnees, setDonnees] = useState<DonneesPersistees>(donneesVides);
  const [chargement, setChargement] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let actif = true;

    async function charger() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!actif) return;
      if (!user) {
        setChargement(false);
        return;
      }
      setUserId(user.id);

      const [{ data: chantiersRows }, { data: depensesRows }, { data: fournisseursRows }] =
        await Promise.all([
          supabase.from("chantiers").select("*").eq("user_id", user.id).order("date_debut", { ascending: false }),
          supabase.from("depenses").select("*").eq("user_id", user.id).order("date", { ascending: false }),
          supabase.from("fournisseurs").select("*").eq("user_id", user.id).order("nom", { ascending: true }),
        ]);
      if (!actif) return;

      let chargees: DonneesPersistees = {
        chantiers: ((chantiersRows ?? []) as ChantierRow[]).map(chantierDepuisLigne),
        depenses: ((depensesRows ?? []) as DepenseRow[]).map(depenseDepuisLigne),
        fournisseurs: ((fournisseursRows ?? []) as FournisseurRow[]).map(fournisseurDepuisLigne),
      };

      if (
        chargees.chantiers.length === 0 &&
        chargees.depenses.length === 0 &&
        chargees.fournisseurs.length === 0
      ) {
        chargees = await semerDonneesDemo(supabase, user.id);
      }

      if (!actif) return;
      setDonnees(chargees);
      setChargement(false);
    }

    charger();
    return () => {
      actif = false;
    };
  }, [supabase]);

  const assurerUtilisateur = useCallback(() => {
    if (!userId) throw new Error("Utilisateur non connecté");
    return userId;
  }, [userId]);

  const value = useMemo<AppContextValue>(
    () => ({
      ...donnees,
      chargement,
      ajouterDepense: async (depense) => {
        const uid = assurerUtilisateur();
        const { data, error } = await supabase
          .from("depenses")
          .insert({ ...depenseVersLigne(depense), user_id: uid })
          .select()
          .single();
        if (error || !data) throw error ?? new Error("Échec de l'ajout de la dépense");
        const nouvelle = depenseDepuisLigne(data as DepenseRow);
        setDonnees((prev) => ({ ...prev, depenses: [nouvelle, ...prev.depenses] }));
      },
      modifierDepense: async (id, patch) => {
        const { data, error } = await supabase
          .from("depenses")
          .update(depenseVersLigne(patch))
          .eq("id", id)
          .select()
          .single();
        if (error || !data) throw error ?? new Error("Échec de la modification de la dépense");
        const modifiee = depenseDepuisLigne(data as DepenseRow);
        setDonnees((prev) => ({
          ...prev,
          depenses: prev.depenses.map((depense) => (depense.id === id ? modifiee : depense)),
        }));
      },
      supprimerDepense: async (id) => {
        const { error } = await supabase.from("depenses").delete().eq("id", id);
        if (error) throw error;
        setDonnees((prev) => ({
          ...prev,
          depenses: prev.depenses.filter((depense) => depense.id !== id),
        }));
      },
      ajouterChantier: async (chantier) => {
        const uid = assurerUtilisateur();
        const { data, error } = await supabase
          .from("chantiers")
          .insert({ ...chantierVersLigne(chantier), user_id: uid })
          .select()
          .single();
        if (error || !data) throw error ?? new Error("Échec de la création du chantier");
        const nouveau = chantierDepuisLigne(data as ChantierRow);
        setDonnees((prev) => ({ ...prev, chantiers: [...prev.chantiers, nouveau] }));
        return nouveau.id;
      },
      modifierChantier: async (id, patch) => {
        const { data, error } = await supabase
          .from("chantiers")
          .update(chantierVersLigne(patch))
          .eq("id", id)
          .select()
          .single();
        if (error || !data) throw error ?? new Error("Échec de la modification du chantier");
        const modifie = chantierDepuisLigne(data as ChantierRow);
        setDonnees((prev) => ({
          ...prev,
          chantiers: prev.chantiers.map((chantier) => (chantier.id === id ? modifie : chantier)),
        }));
      },
      supprimerChantier: async (id) => {
        // La contrainte "on delete cascade" côté base supprime aussi les dépenses liées.
        const { error } = await supabase.from("chantiers").delete().eq("id", id);
        if (error) throw error;
        setDonnees((prev) => ({
          ...prev,
          chantiers: prev.chantiers.filter((chantier) => chantier.id !== id),
          depenses: prev.depenses.filter((depense) => depense.chantierId !== id),
        }));
      },
      ajouterFournisseur: async (fournisseur) => {
        const uid = assurerUtilisateur();
        const { data, error } = await supabase
          .from("fournisseurs")
          .insert({ ...fournisseurVersLigne(fournisseur), user_id: uid })
          .select()
          .single();
        if (error || !data) throw error ?? new Error("Échec de l'ajout du fournisseur");
        const nouveau = fournisseurDepuisLigne(data as FournisseurRow);
        setDonnees((prev) => ({ ...prev, fournisseurs: [...prev.fournisseurs, nouveau] }));
        return nouveau.id;
      },
      modifierFournisseur: async (id, patch) => {
        const { data, error } = await supabase
          .from("fournisseurs")
          .update(fournisseurVersLigne(patch))
          .eq("id", id)
          .select()
          .single();
        if (error || !data) throw error ?? new Error("Échec de la modification du fournisseur");
        const modifie = fournisseurDepuisLigne(data as FournisseurRow);
        setDonnees((prev) => ({
          ...prev,
          fournisseurs: prev.fournisseurs.map((fournisseur) =>
            fournisseur.id === id ? modifie : fournisseur,
          ),
        }));
      },
      supprimerFournisseur: async (id) => {
        const { error } = await supabase.from("fournisseurs").delete().eq("id", id);
        if (error) throw error;
        setDonnees((prev) => ({
          ...prev,
          fournisseurs: prev.fournisseurs.filter((fournisseur) => fournisseur.id !== id),
        }));
      },
      reinitialiser: async () => {
        const uid = assurerUtilisateur();
        await Promise.all([
          supabase.from("depenses").delete().eq("user_id", uid),
          supabase.from("fournisseurs").delete().eq("user_id", uid),
        ]);
        // Les chantiers sont supprimés après coup : leur suppression entraîne déjà
        // celle de leurs dépenses, mais on l'a fait ci-dessus pour les dépenses
        // qui ne seraient plus rattachées à un chantier existant.
        await supabase.from("chantiers").delete().eq("user_id", uid);
        const fraiches = await semerDonneesDemo(supabase, uid);
        setDonnees(fraiches);
      },
    }),
    [donnees, chargement, supabase, assurerUtilisateur],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppData doit être utilisé à l'intérieur de <AppProvider>");
  }
  return ctx;
}
