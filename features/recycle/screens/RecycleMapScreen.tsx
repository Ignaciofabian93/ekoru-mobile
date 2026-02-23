import Colors from "@/constants/Colors";
import * as Location from "expo-location";
import { Leaf, MapPin, Navigation, X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_DEFAULT,
  type Region,
} from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface RecyclePoint {
  id: number;
  lat: number;
  lon: number;
  name?: string;
  operator?: string;
  openingHours?: string;
  materials: string[];
}

// ------------------------------------------------------------------
// Overpass API
// ------------------------------------------------------------------

const MATERIAL_KEYS = [
  "glass",
  "paper",
  "cardboard",
  "plastic",
  "plastic_bottles",
  "cans",
  "aluminium",
  "metal",
  "clothes",
  "batteries",
  "electronics",
  "organic",
  "wood",
];

const MATERIAL_LABELS: Record<string, string> = {
  glass: "Vidrio",
  paper: "Papel",
  cardboard: "Cartón",
  plastic: "Plástico",
  plastic_bottles: "Botellas",
  cans: "Latas",
  aluminium: "Aluminio",
  metal: "Metales",
  clothes: "Ropa",
  batteries: "Baterías",
  electronics: "Electrónica",
  organic: "Orgánico",
  wood: "Madera",
};

async function fetchRecyclePoints(
  lat: number,
  lng: number,
  radiusMeters = 5000,
): Promise<RecyclePoint[]> {
  const query = `
    [out:json][timeout:20];
    node[amenity=recycling](around:${radiusMeters},${lat},${lng});
    out body;
  `;
  const body = `data=${encodeURIComponent(query)}`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await res.json();

  return (json.elements ?? []).map(
    (el: Record<string, unknown>): RecyclePoint => {
      const tags = (el.tags ?? {}) as Record<string, string>;
      const materials = MATERIAL_KEYS.filter(
        (k) => tags[`recycling:${k}`] === "yes",
      );
      return {
        id: el.id as number,
        lat: el.lat as number,
        lon: el.lon as number,
        name: tags.name,
        operator: tags.operator,
        openingHours: tags.opening_hours,
        materials,
      };
    },
  );
}

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function PermissionDenied() {
  return (
    <View style={styles.centered}>
      <MapPin size={52} color={Colors.foregroundMuted} strokeWidth={1.5} />
      <Text style={styles.stateTitle}>Permiso de ubicación requerido</Text>
      <Text style={styles.stateSubtitle}>
        Activa el permiso de ubicación en Configuración para encontrar puntos de
        reciclaje cercanos.
      </Text>
    </View>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.centered}>
      <X size={52} color={Colors.danger} strokeWidth={1.5} />
      <Text style={styles.stateTitle}>No se pudo cargar</Text>
      <Text style={styles.stateSubtitle}>
        Revisa tu conexión e intenta de nuevo.
      </Text>
      <Pressable style={styles.retryBtn} onPress={onRetry}>
        <Text style={styles.retryBtnText}>Reintentar</Text>
      </Pressable>
    </View>
  );
}

function MaterialTag({ label }: { label: string }) {
  return (
    <View style={styles.materialTag}>
      <Text style={styles.materialTagText}>{label}</Text>
    </View>
  );
}

interface PointSheetProps {
  point: RecyclePoint;
  onClose: () => void;
}

function PointSheet({ point, onClose }: PointSheetProps) {
  return (
    <View style={styles.sheet}>
      <View style={styles.sheetHeader}>
        <View style={styles.sheetTitleRow}>
          <Leaf size={16} color={Colors.primary} strokeWidth={2} />
          <Text style={styles.sheetTitle} numberOfLines={2}>
            {point.name ?? "Punto de Reciclaje"}
          </Text>
        </View>
        <Pressable onPress={onClose} hitSlop={8}>
          <X size={18} color={Colors.foregroundSecondary} strokeWidth={2} />
        </Pressable>
      </View>

      {point.operator && (
        <Text style={styles.sheetOperator}>{point.operator}</Text>
      )}

      {point.openingHours && (
        <Text style={styles.sheetHours}>🕐 {point.openingHours}</Text>
      )}

      {point.materials.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.materialList}
        >
          {point.materials.map((m) => (
            <MaterialTag key={m} label={MATERIAL_LABELS[m] ?? m} />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noMaterials}>
          Materiales aceptados no especificados
        </Text>
      )}
    </View>
  );
}

// ------------------------------------------------------------------
// Main Screen
// ------------------------------------------------------------------

const SANTIAGO: Region = {
  latitude: -33.4489,
  longitude: -70.6693,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

type Status = "loading" | "permission_denied" | "error" | "ready";

export default function RecycleMapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  const [status, setStatus] = useState<Status>("loading");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState<Region>(SANTIAGO);
  const [points, setPoints] = useState<RecyclePoint[]>([]);
  const [selected, setSelected] = useState<RecyclePoint | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const loadPoints = useCallback(async (lat: number, lng: number) => {
    setIsFetching(true);
    try {
      const data = await fetchRecyclePoints(lat, lng, 5000);
      setPoints(data);
    } catch {
      setStatus("error");
    } finally {
      setIsFetching(false);
    }
  }, []);

  const init = useCallback(async () => {
    setStatus("loading");
    const { status: perm } = await Location.requestForegroundPermissionsAsync();
    if (perm !== "granted") {
      setStatus("permission_denied");
      return;
    }
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = loc.coords;
    setUserLocation({ latitude, longitude });
    const r: Region = {
      latitude,
      longitude,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    };
    setRegion(r);
    setStatus("ready");
    loadPoints(latitude, longitude);
  }, [loadPoints]);

  useEffect(() => {
    init();
  }, [init]);

  const centerOnUser = () => {
    if (!userLocation) return;
    mapRef.current?.animateToRegion(
      {
        ...userLocation,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      500,
    );
  };

  if (status === "permission_denied") return <PermissionDenied />;
  if (status === "error") return <ErrorState onRetry={init} />;

  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {points.map((point) => (
          <Marker
            key={point.id}
            coordinate={{ latitude: point.lat, longitude: point.lon }}
            onPress={() => setSelected(point)}
            pinColor={Colors.primary}
          >
            <View style={styles.markerPin}>
              <Leaf size={14} color="#fff" strokeWidth={2.5} />
            </View>
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutText} numberOfLines={2}>
                  {point.name ?? "Punto de Reciclaje"}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Loading spinner overlay */}
      {(status === "loading" || isFetching) && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBadge}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingText}>
              {status === "loading"
                ? "Obteniendo ubicación..."
                : "Cargando puntos..."}
            </Text>
          </View>
        </View>
      )}

      {/* Point count badge */}
      {status === "ready" && !isFetching && (
        <View
          style={[styles.countBadge, { top: insets.top + 12 }]}
          pointerEvents="none"
        >
          <Text style={styles.countText}>
            {points.length} punto{points.length !== 1 ? "s" : ""} en 5 km
          </Text>
        </View>
      )}

      {/* Center on me button */}
      {userLocation && (
        <Pressable
          style={[styles.myLocationBtn, { bottom: selected ? 220 : 24 }]}
          onPress={centerOnUser}
          hitSlop={8}
        >
          <Navigation size={20} color={Colors.primary} strokeWidth={2} />
        </Pressable>
      )}

      {/* Selected point sheet */}
      {selected && (
        <PointSheet point={selected} onClose={() => setSelected(null)} />
      )}
    </View>
  );
}

// ------------------------------------------------------------------
// Styles
// ------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  map: {
    flex: 1,
  },
  // States
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
    backgroundColor: Colors.background,
  },
  stateTitle: {
    fontSize: 17,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.foreground,
    textAlign: "center",
    marginTop: 8,
  },
  stateSubtitle: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
    textAlign: "center",
    lineHeight: 21,
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryBtnText: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
  // Marker
  markerPin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  callout: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    maxWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  calloutText: {
    fontSize: 12,
    fontFamily: "Cabin_500Medium",
    color: Colors.foreground,
  },
  // Loading
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.12)",
    pointerEvents: "none",
  } as any,
  loadingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: "Cabin_500Medium",
    color: Colors.foreground,
  },
  // Count badge
  countBadge: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  countText: {
    fontSize: 12,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
  // My location button
  myLocationBtn: {
    position: "absolute",
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  // Bottom sheet
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  sheetTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: "Cabin_600SemiBold",
    color: Colors.foreground,
    flex: 1,
  },
  sheetOperator: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
  },
  sheetHours: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundSecondary,
  },
  materialList: {
    gap: 6,
    paddingVertical: 2,
  },
  materialTag: {
    backgroundColor: Colors.backgroundPrimaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  materialTagText: {
    fontSize: 12,
    fontFamily: "Cabin_500Medium",
    color: Colors.primary,
  },
  noMaterials: {
    fontSize: 12,
    fontFamily: "Cabin_400Regular",
    color: Colors.foregroundTertiary,
    fontStyle: "italic",
  },
});
