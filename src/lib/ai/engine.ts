import type { AIResponse } from "@/types/ai";

/**
 * Mock AI engine — simulates responses until Claude API is integrated.
 * Detects keywords in the user message to generate relevant actions.
 */
export async function processMessage(message: string): Promise<AIResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const lower = message.toLowerCase();

  // Detect module creation intent
  if (
    lower.includes("contact") ||
    lower.includes("client") ||
    lower.includes("prospect")
  ) {
    return {
      message:
        "J'ai créé un module **Contacts** avec les champs essentiels : nom, email, téléphone et statut. Vous pouvez commencer à ajouter vos contacts dès maintenant !",
      actions: [
        {
          type: "create_module",
          payload: {
            name: "Contacts",
            slug: "contacts",
            icon: "users",
            description: "Gestion de vos contacts et clients",
            fields: [
              { name: "Nom", slug: "nom", type: "text", required: true, order: 0 },
              { name: "Email", slug: "email", type: "email", required: false, order: 1 },
              { name: "Téléphone", slug: "telephone", type: "phone", required: false, order: 2 },
              {
                name: "Statut",
                slug: "statut",
                type: "select",
                required: false,
                order: 3,
                options: {
                  choices: [
                    { label: "Nouveau", value: "nouveau", color: "#3b82f6" },
                    { label: "En cours", value: "en_cours", color: "#f59e0b" },
                    { label: "Client", value: "client", color: "#10b981" },
                    { label: "Perdu", value: "perdu", color: "#ef4444" },
                  ],
                },
              },
            ],
          },
        },
      ],
    };
  }

  if (lower.includes("deal") || lower.includes("opportunit") || lower.includes("vente")) {
    return {
      message:
        "J'ai créé un module **Deals** pour suivre vos opportunités commerciales avec un pipeline de vente intégré.",
      actions: [
        {
          type: "create_module",
          payload: {
            name: "Deals",
            slug: "deals",
            icon: "handshake",
            description: "Suivi de vos opportunités commerciales",
            fields: [
              { name: "Titre", slug: "titre", type: "text", required: true, order: 0 },
              { name: "Montant", slug: "montant", type: "currency", required: false, order: 1 },
              { name: "Date de clôture", slug: "date_cloture", type: "date", required: false, order: 2 },
              {
                name: "Étape",
                slug: "etape",
                type: "select",
                required: false,
                order: 3,
                options: {
                  choices: [
                    { label: "Qualification", value: "qualification", color: "#3b82f6" },
                    { label: "Proposition", value: "proposition", color: "#f59e0b" },
                    { label: "Négociation", value: "negociation", color: "#8b5cf6" },
                    { label: "Gagné", value: "gagne", color: "#10b981" },
                    { label: "Perdu", value: "perdu", color: "#ef4444" },
                  ],
                },
              },
            ],
          },
        },
      ],
    };
  }

  if (lower.includes("tâche") || lower.includes("tache") || lower.includes("task") || lower.includes("todo")) {
    return {
      message:
        "J'ai créé un module **Tâches** pour organiser votre travail. Vous pouvez y ajouter des tâches avec priorité et échéance.",
      actions: [
        {
          type: "create_module",
          payload: {
            name: "Tâches",
            slug: "taches",
            icon: "check-square",
            description: "Gestion de vos tâches et à-faire",
            fields: [
              { name: "Titre", slug: "titre", type: "text", required: true, order: 0 },
              { name: "Description", slug: "description", type: "text", required: false, order: 1 },
              { name: "Échéance", slug: "echeance", type: "date", required: false, order: 2 },
              {
                name: "Priorité",
                slug: "priorite",
                type: "select",
                required: false,
                order: 3,
                options: {
                  choices: [
                    { label: "Basse", value: "basse", color: "#6b7280" },
                    { label: "Moyenne", value: "moyenne", color: "#f59e0b" },
                    { label: "Haute", value: "haute", color: "#ef4444" },
                  ],
                },
              },
              { name: "Terminée", slug: "terminee", type: "checkbox", required: false, order: 4 },
            ],
          },
        },
      ],
    };
  }

  // Default response
  return {
    message:
      "Je comprends votre besoin. Pouvez-vous me préciser quels modules vous souhaitez créer ? Par exemple : **contacts**, **deals**, **tâches**, ou décrivez votre activité et je proposerai une structure adaptée.",
    actions: [],
  };
}
