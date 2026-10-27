import type { MetadataRoute } from "next";
import { APP_NAME } from "@/lib/config";

/** L'app s'installe sur l'écran d'accueil (tablette, téléphone, ordinateur). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: "Le programme de l’école romande, 20 minutes par jour, avec Pi.",
    lang: "fr-CH",
    start_url: "/parcours",
    scope: "/",
    display: "standalone",
    background_color: "#F5F7FC",
    theme_color: "#2356E8",
    icons: [
      { src: "/icons/app-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/app-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/app-192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/app-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
