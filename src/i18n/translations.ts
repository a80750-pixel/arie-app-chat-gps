import type { Lang } from "../types";

export interface Dictionary {
  app: {
    name: string;
    tagline: string;
  };
  header: {
    simulation: string;
    simulationOn: string;
    simulationOff: string;
    theme: string;
    language: string;
    profile: string;
  };
  gps: {
    locating: string;
    active: string;
    denied: string;
    error: string;
    unsupported: string;
    retry: string;
    httpsHint: string;
    deniedHint: string;
  };
  onboarding: {
    title: string;
    step1: string;
    step2: string;
    step3: string;
    start: string;
  };
  map: {
    dropHint: string;
    simHint: string;
    accuracy: string;
  };
  compose: {
    title: string;
    titlePlaceholder: string;
    textPlaceholder: string;
    tag: string;
    tagMemory: string;
    tagReview: string;
    tagMessage: string;
    tagClue: string;
    expiry: string;
    expiryNever: string;
    expiry1d: string;
    expiry7d: string;
    expiry30d: string;
    addPhoto: string;
    removePhoto: string;
    submit: string;
    cancel: string;
    charCount: string;
    rateLimited: string;
    emptyError: string;
  };
  pin: {
    locked: string;
    lockedDistance: string;
    lockedVeryClose: string;
    unlockedBy: string;
    tapToOpen: string;
  };
  detail: {
    close: string;
    by: string;
    like: string;
    likes: string;
    comment: string;
    comments: string;
    commentPlaceholder: string;
    sendComment: string;
    directions: string;
    share: string;
    shareCopied: string;
    delete: string;
    deleteConfirm: string;
    report: string;
    reportConfirm: string;
    reportSent: string;
    favorite: string;
    unfavorite: string;
    expiresOn: string;
    neverExpires: string;
  };
  nearby: {
    title: string;
    empty: string;
    locked: string;
    unlocked: string;
    away: string;
    favoritesTitle: string;
    favoritesEmpty: string;
  };
  toast: {
    dropped: string;
    unlocked: string;
    deleted: string;
    reported: string;
    networkError: string;
  };
  profile: {
    title: string;
    nameLabel: string;
    nameHint: string;
    save: string;
    stats: string;
    notesDropped: string;
    notesUnlocked: string;
  };
  common: {
    close: string;
    edit: string;
    save: string;
    cancel: string;
    delete: string;
    meters: string;
  };
}

export const translations: Record<Lang, Dictionary> = {
  fr: {
    app: {
      name: "SpotMessage",
      tagline: "Laissez un mot là où vous êtes.",
    },
    header: {
      simulation: "Simulation",
      simulationOn: "Simulation activée",
      simulationOff: "Simulation désactivée",
      theme: "Thème",
      language: "Langue",
      profile: "Profil",
    },
    gps: {
      locating: "Recherche du signal GPS…",
      active: "Position en direct",
      denied: "Localisation refusée",
      error: "Erreur de localisation",
      unsupported: "GPS non supporté",
      retry: "Réessayer",
      httpsHint: "Le GPS nécessite une connexion sécurisée (HTTPS). Utilisez le site publié sur mobile.",
      deniedHint: "Localisation refusée. Autorisez-la dans les réglages du navigateur (icône ⓘ ou cadenas à côté de l'adresse du site), puis rechargez la page.",
    },
    onboarding: {
      title: "Bienvenue sur SpotMessage",
      step1: "Déposez une note exactement où vous êtes.",
      step2: "Une note reste verrouillée tant que vous n'êtes pas à moins de 10 mètres.",
      step3: "Pas moyen de marcher ? Activez le mode Simulation pour déplacer votre position sur la carte.",
      start: "Commencer",
    },
    map: {
      dropHint: "Appuyez sur + pour déposer une note exactement là où vous êtes.",
      simHint: "Mode simulation : déplacez le point bleu pour explorer. Dépôt de note désactivé — il faut votre vraie position.",
      accuracy: "Précision ±{value} m",
    },
    compose: {
      title: "Nouvelle note",
      titlePlaceholder: "Titre (optionnel)",
      textPlaceholder: "Qu'avez-vous à dire sur ce lieu ?",
      tag: "Catégorie",
      tagMemory: "Souvenir",
      tagReview: "Avis",
      tagMessage: "Message",
      tagClue: "Indice",
      expiry: "Expiration",
      expiryNever: "Jamais",
      expiry1d: "1 jour",
      expiry7d: "7 jours",
      expiry30d: "30 jours",
      addPhoto: "Ajouter une photo",
      removePhoto: "Retirer la photo",
      submit: "Déposer la note",
      cancel: "Annuler",
      charCount: "{count}/500",
      rateLimited: "Attendez quelques secondes avant de déposer une nouvelle note.",
      emptyError: "Écrivez un message avant de le déposer.",
    },
    pin: {
      locked: "Verrouillé",
      lockedDistance: "à {distance} du déverrouillage",
      lockedVeryClose: "Presque là ! Continuez tout droit",
      unlockedBy: "par {name}",
      tapToOpen: "Touchez pour ouvrir",
    },
    detail: {
      close: "Fermer",
      by: "par",
      like: "J'aime",
      likes: "j'aime",
      comment: "Commenter",
      comments: "commentaires",
      commentPlaceholder: "Ajouter un commentaire…",
      sendComment: "Envoyer",
      directions: "Itinéraire à pied",
      share: "Partager",
      shareCopied: "Lien copié !",
      delete: "Supprimer",
      deleteConfirm: "Supprimer définitivement cette note ?",
      report: "Signaler",
      reportConfirm: "Signaler cette note comme inappropriée ?",
      reportSent: "Signalement envoyé, merci.",
      favorite: "Ajouter aux favoris",
      unfavorite: "Retirer des favoris",
      expiresOn: "Expire le {date}",
      neverExpires: "N'expire jamais",
    },
    nearby: {
      title: "À proximité",
      empty: "Aucune note aux alentours pour le moment.",
      locked: "verrouillée",
      unlocked: "déverrouillée",
      away: "à {distance}",
      favoritesTitle: "Favoris",
      favoritesEmpty: "Aucun favori pour le moment.",
    },
    toast: {
      dropped: "Note déposée !",
      unlocked: "Nouvelle note déverrouillée à proximité !",
      deleted: "Note supprimée.",
      reported: "Note signalée.",
      networkError: "Connexion au serveur impossible. Réessayez.",
    },
    profile: {
      title: "Profil",
      nameLabel: "Votre pseudo",
      nameHint: "Ce pseudo est votre identité : pas de mot de passe. Quiconque tape le même pseudo, sur n'importe quel appareil, pourra agir à votre place.",
      save: "Enregistrer",
      stats: "Statistiques",
      notesDropped: "Notes déposées",
      notesUnlocked: "Notes déverrouillées",
    },
    common: {
      close: "Fermer",
      edit: "Modifier",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      meters: "m",
    },
  },
  en: {
    app: {
      name: "SpotMessage",
      tagline: "Leave a note right where you are.",
    },
    header: {
      simulation: "Simulation",
      simulationOn: "Simulation on",
      simulationOff: "Simulation off",
      theme: "Theme",
      language: "Language",
      profile: "Profile",
    },
    gps: {
      locating: "Searching for GPS signal…",
      active: "Live location",
      denied: "Location denied",
      error: "Location error",
      unsupported: "GPS not supported",
      retry: "Retry",
      httpsHint: "GPS requires a secure connection (HTTPS). Use the published site on mobile.",
      deniedHint: "Location denied. Allow it in your browser settings (the ⓘ or lock icon next to the site address), then reload the page.",
    },
    onboarding: {
      title: "Welcome to SpotMessage",
      step1: "Drop a note exactly where you're standing.",
      step2: "A note stays locked until you're within 10 meters of it.",
      step3: "Can't walk there? Turn on Simulation mode to move your position on the map.",
      start: "Get started",
    },
    map: {
      dropHint: "Tap + to drop a note right where you are.",
      simHint: "Simulation mode: drag the blue dot to explore. Dropping notes is disabled — your real position is required.",
      accuracy: "Accuracy ±{value} m",
    },
    compose: {
      title: "New note",
      titlePlaceholder: "Title (optional)",
      textPlaceholder: "What do you want to say about this place?",
      tag: "Category",
      tagMemory: "Memory",
      tagReview: "Review",
      tagMessage: "Message",
      tagClue: "Clue",
      expiry: "Expires",
      expiryNever: "Never",
      expiry1d: "1 day",
      expiry7d: "7 days",
      expiry30d: "30 days",
      addPhoto: "Add photo",
      removePhoto: "Remove photo",
      submit: "Drop note",
      cancel: "Cancel",
      charCount: "{count}/500",
      rateLimited: "Please wait a few seconds before dropping another note.",
      emptyError: "Write a message before dropping it.",
    },
    pin: {
      locked: "Locked",
      lockedDistance: "{distance} to unlock",
      lockedVeryClose: "Almost there! Keep going",
      unlockedBy: "by {name}",
      tapToOpen: "Tap to open",
    },
    detail: {
      close: "Close",
      by: "by",
      like: "Like",
      likes: "likes",
      comment: "Comment",
      comments: "comments",
      commentPlaceholder: "Add a comment…",
      sendComment: "Send",
      directions: "Walking directions",
      share: "Share",
      shareCopied: "Link copied!",
      delete: "Delete",
      deleteConfirm: "Permanently delete this note?",
      report: "Report",
      reportConfirm: "Report this note as inappropriate?",
      reportSent: "Report sent, thank you.",
      favorite: "Add to favorites",
      unfavorite: "Remove from favorites",
      expiresOn: "Expires on {date}",
      neverExpires: "Never expires",
    },
    nearby: {
      title: "Nearby",
      empty: "No notes around here yet.",
      locked: "locked",
      unlocked: "unlocked",
      away: "{distance} away",
      favoritesTitle: "Favorites",
      favoritesEmpty: "No favorites yet.",
    },
    toast: {
      dropped: "Note dropped!",
      unlocked: "New note unlocked nearby!",
      deleted: "Note deleted.",
      reported: "Note reported.",
      networkError: "Could not reach the server. Please try again.",
    },
    profile: {
      title: "Profile",
      nameLabel: "Your name",
      nameHint: "This name is your identity — no password. Anyone who types the same name, on any device, can act as you.",
      save: "Save",
      stats: "Stats",
      notesDropped: "Notes dropped",
      notesUnlocked: "Notes unlocked",
    },
    common: {
      close: "Close",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      meters: "m",
    },
  },
  he: {
    app: {
      name: "ספוט-מסג'",
      tagline: "השאירו פתק בדיוק במקום בו אתם נמצאים.",
    },
    header: {
      simulation: "סימולציה",
      simulationOn: "סימולציה פעילה",
      simulationOff: "סימולציה כבויה",
      theme: "ערכת נושא",
      language: "שפה",
      profile: "פרופיל",
    },
    gps: {
      locating: "מחפש אות GPS…",
      active: "מיקום חי",
      denied: "המיקום נחסם",
      error: "שגיאת מיקום",
      unsupported: "GPS אינו נתמך",
      retry: "נסה שוב",
      httpsHint: "GPS דורש חיבור מאובטח (HTTPS). השתמשו באתר המפורסם בנייד.",
      deniedHint: "המיקום נדחה. אפשרו אותו בהגדרות הדפדפן (סמל ⓘ או מנעול ליד כתובת האתר), ולאחר מכן טענו מחדש את הדף.",
    },
    onboarding: {
      title: "ברוכים הבאים ל-SpotMessage",
      step1: "השאירו פתק בדיוק במקום בו אתם עומדים.",
      step2: "פתק נשאר נעול עד שאתם במרחק של פחות מ-10 מטרים ממנו.",
      step3: "אי אפשר ללכת לשם? הפעילו מצב סימולציה כדי להזיז את המיקום שלכם על המפה.",
      start: "בואו נתחיל",
    },
    map: {
      dropHint: "הקישו על + כדי להשאיר פתק בדיוק במקום בו אתם נמצאים.",
      simHint: "מצב סימולציה: גררו את הנקודה הכחולה כדי לחקור. השארת פתק מושבתת - נדרש המיקום האמיתי שלכם.",
      accuracy: "דיוק ±{value} מ׳",
    },
    compose: {
      title: "פתק חדש",
      titlePlaceholder: "כותרת (רשות)",
      textPlaceholder: "מה תרצו לומר על המקום הזה?",
      tag: "קטגוריה",
      tagMemory: "זיכרון",
      tagReview: "ביקורת",
      tagMessage: "הודעה",
      tagClue: "רמז",
      expiry: "תפוגה",
      expiryNever: "לעולם לא",
      expiry1d: "יום אחד",
      expiry7d: "7 ימים",
      expiry30d: "30 ימים",
      addPhoto: "הוסף תמונה",
      removePhoto: "הסר תמונה",
      submit: "השאר פתק",
      cancel: "ביטול",
      charCount: "{count}/500",
      rateLimited: "המתינו מספר שניות לפני השארת פתק נוסף.",
      emptyError: "כתבו הודעה לפני ההשארה.",
    },
    pin: {
      locked: "נעול",
      lockedDistance: "{distance} עד לפתיחה",
      lockedVeryClose: "כמעט הגעתם! המשיכו",
      unlockedBy: "מאת {name}",
      tapToOpen: "הקישו לפתיחה",
    },
    detail: {
      close: "סגור",
      by: "מאת",
      like: "אהבתי",
      likes: "אהבו",
      comment: "הגב",
      comments: "תגובות",
      commentPlaceholder: "הוסיפו תגובה…",
      sendComment: "שלח",
      directions: "הנחיות הליכה",
      share: "שתף",
      shareCopied: "הקישור הועתק!",
      delete: "מחק",
      deleteConfirm: "למחוק את הפתק הזה לצמיתות?",
      report: "דווח",
      reportConfirm: "לדווח על הפתק הזה כלא הולם?",
      reportSent: "הדיווח נשלח, תודה.",
      favorite: "הוסף למועדפים",
      unfavorite: "הסר מהמועדפים",
      expiresOn: "פג תוקף בתאריך {date}",
      neverExpires: "לא פג תוקף לעולם",
    },
    nearby: {
      title: "בקרבת מקום",
      empty: "אין פתקים בסביבה כרגע.",
      locked: "נעול",
      unlocked: "פתוח",
      away: "במרחק {distance}",
      favoritesTitle: "מועדפים",
      favoritesEmpty: "אין מועדפים עדיין.",
    },
    toast: {
      dropped: "הפתק הושאר!",
      unlocked: "פתק חדש נפתח בקרבת מקום!",
      deleted: "הפתק נמחק.",
      reported: "הפתק דווח.",
      networkError: "לא ניתן להתחבר לשרת. נסו שוב.",
    },
    profile: {
      title: "פרופיל",
      nameLabel: "שם משתמש",
      nameHint: "השם הזה הוא הזהות שלך - בלי סיסמה. כל מי שיקליד את אותו שם, מכל מכשיר, יוכל לפעול במקומך.",
      save: "שמור",
      stats: "סטטיסטיקה",
      notesDropped: "פתקים שהושארו",
      notesUnlocked: "פתקים שנפתחו",
    },
    common: {
      close: "סגור",
      edit: "ערוך",
      save: "שמור",
      cancel: "ביטול",
      delete: "מחק",
      meters: "מ׳",
    },
  },
};

export const RTL_LANGS: Lang[] = ["he"];

export const LANG_LABELS: Record<Lang, string> = {
  fr: "Français",
  en: "English",
  he: "עברית",
};
