# SpotMessage

Application web mobile-first : déposez une note ancrée à votre position GPS exacte. Les autres utilisateurs ne peuvent la lire qu'en s'approchant physiquement à moins de 10 mètres (formule de Haversine).

- **Frontend** : React + TypeScript + Vite + Tailwind CSS + Leaflet.js
- **Backend** : Node/Express + PostgreSQL (avec repli en mémoire si aucune base n'est configurée)
- **i18n** : Français, English, עברית (RTL complet)
- **Thèmes** : clair / sombre "noir pur"

## Développement local

```bash
npm install

# Terminal 1 : API backend (port 3000, stockage en mémoire si pas de DATABASE_URL)
npm run server:dev

# Terminal 2 : frontend avec hot-reload (port 5173, proxy /api vers le port 3000)
npm run dev
```

Ouvrez http://localhost:5173. Le GPS fonctionne sur `localhost` (contexte sécurisé), mais sur mobile il faut du HTTPS — voir la section déploiement.

## Déployer sur Railway (gratuit pour commencer, payant pour un usage prolongé)

1. Poussez ce repo sur GitHub (déjà fait si vous lisez ceci depuis la branche déployée).
2. Sur [railway.app](https://railway.app), **New Project → Deploy from GitHub repo**, sélectionnez ce dépôt.
3. Ajoutez une base de données : **+ New → Database → PostgreSQL**. Railway relie automatiquement la variable `DATABASE_URL` au service de l'app.
4. Railway détecte `npm run build` (build command) et `npm start` (start command) automatiquement via `package.json`. Rien d'autre à configurer.
5. Une fois déployé, Railway fournit une URL HTTPS publique — c'est cette URL qu'il faut utiliser sur mobile pour que la géolocalisation fonctionne.

Sans base Postgres attachée, le serveur fonctionne quand même (stockage en mémoire), mais les notes sont perdues à chaque redéploiement/redémarrage. Pour un vrai usage partagé et persistant entre tous les utilisateurs, attachez bien PostgreSQL (étape 3).

## Structure

```
src/            frontend React
  hooks/        GPS, thème, messages (fetch API), toasts
  components/   carte, header, modales (compose, détail, profil, à proximité)
  i18n/         traductions FR/EN/HE + contexte RTL
  utils/        Haversine, formatage, compression d'image, ids
server/
  index.js      serveur Express (API + fichiers statiques buildés)
  db.js         accès PostgreSQL (ou stockage mémoire de secours)
```

## API

| Méthode | Route | Description |
| --- | --- | --- |
| GET | `/api/messages` | Liste les notes actives (non expirées, non signalées ≥3 fois) |
| POST | `/api/messages` | Crée une note |
| DELETE | `/api/messages/:id?authorId=...` | Supprime une note (auteur uniquement) |
| POST | `/api/messages/:id/like` | Ajoute/retire un like |
| POST | `/api/messages/:id/comments` | Ajoute un commentaire |
| POST | `/api/messages/:id/report` | Signale une note |
