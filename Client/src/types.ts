import type { RefObject } from "react";
import type { Color, Mesh, PlaneGeometry, ShaderMaterial } from "three";

export type AuthMode = "login" | "register";

export interface AuthRoutePageProps {
  initialMode: AuthMode;
}

export interface AuthContextType {
  token: string | null;
  role: string | null;
  userId: number | null;
  userName: string | null;
  login: (
    token: string,
    role: string,
    userId: number,
    userName: string,
  ) => void;
  logout: () => void;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string | null;
  genre?: string | null;
  published?: string | null;
  pages: number;
  rating: number;
  copiesAvailable: number;
  imageUrl?: string | null;
  badge?: string | null;
  coverColor: string;
  spineColor: string;
}

export interface Rental {
  id: number;
  username?: string | null;
  bookTitle: string;
  bookAuthor: string;
  coverColor: string;
  rentalDate: string;
  returnDate: string | null;
  collectionCode: string | null;
  pickupDeadline: string | null;
  status: string;
}

export interface RentalSummary {
  id: number;
  bookTitle: string;
  status: string;
  collectionCode?: string | null;
  pickupDeadline?: string | null;
}

export interface NavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export type SilkUniforms = {
  uSpeed: { value: number };
  uScale: { value: number };
  uNoiseIntensity: { value: number };
  uColor: { value: Color };
  uRotation: { value: number };
  uTime: { value: number };
};

export interface SilkPlaneProps {
  uniforms: SilkUniforms;
  meshRef: RefObject<Mesh<PlaneGeometry, ShaderMaterial> | null>;
}

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
}