"use client";
import PocketBase from "pocketbase";
import { PB_URL } from "./config";

let client: PocketBase | null = null;

/** Client PocketBase unique côté navigateur (session gardée dans localStorage). */
export function pb(): PocketBase {
  if (!client) {
    client = new PocketBase(PB_URL);
    client.autoCancellation(false);
  }
  return client;
}

export type Role = "eleve" | "prof" | "adulte" | "admin";

export interface User {
  id: string;
  email?: string;
  name?: string;
  pseudo?: string;
  role: Role;
  theme?: "" | "clair" | "sombre";
  xp: number;
  classe?: string;
}
