#!/usr/bin/env bash
set -euo pipefail

# ─── Build Android APK/AAB via Capacitor ──────────────────────────
# Requisitos:
#   - Android Studio (ou Android SDK) instalado
#   - ANDROID_HOME definido (ou Android Studio cuida disso)
#   - JDK 17+
#   - Para release: keystore configurado (ou use debug keystore abaixo)
#
# Uso:
#   ./scripts/mobile-build-android.sh [debug|release]
#
#   debug   → gera apk debug (padrão)
#   release → gera aab release (requer keystore)
# ────────────────────────────────────────────────────────────────

MODE="${1:-debug}"

echo "→ Verificando dependências..."
command -v java >/dev/null 2>&1 || { echo "❌ JDK não encontrado. Instale o JDK 17+."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js não encontrado."; exit 1; }

echo "→ Instalando dependências npm..."
npm install --legacy-peer-deps

echo "→ Build do Next.js..."
CAPACITOR_SERVER_URL="${CAPACITOR_SERVER_URL:-}"
if [ -z "$CAPACITOR_SERVER_URL" ]; then
  echo "   CAPACITOR_SERVER_URL não definido — buildando com output estático (next export)"
  npx next build
else
  echo "   Modo servidor remoto: $CAPACITOR_SERVER_URL"
fi

echo "→ Sincronizando com Capacitor..."
npx cap sync android

if [ "$MODE" = "release" ]; then
  echo "→ Build RELEASE (AAB)..."
  cd android
  ./gradlew bundleRelease
  cd ..
  echo ""
  echo "✅ AAB gerado em: android/app/build/outputs/bundle/release/app-release.aab"
  echo "   Use este arquivo para publicar na Google Play Store."
else
  echo "→ Build DEBUG (APK)..."
  cd android
  ./gradlew assembleDebug
  cd ..
  echo ""
  echo "✅ APK gerado em: android/app/build/outputs/apk/debug/app-debug.apk"
  echo "   Instale no dispositivo com: adb install android/app/build/outputs/apk/debug/app-debug.apk"
fi
