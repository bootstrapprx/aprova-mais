#!/usr/bin/env bash
set -euo pipefail

# ─── Build iOS IPA via Capacitor ──────────────────────────────────
# Requisitos:
#   - macOS
#   - Xcode 15+ instalado
#   - Apple Developer account (para release)
#   - Provisioning profiles configurados (para release)
#
# Uso:
#   ./scripts/mobile-build-ios.sh [debug|release]
#
#   debug   → build para simulator/teste local (padrão)
#   release → archive + export IPA para App Store
# ────────────────────────────────────────────────────────────────

MODE="${1:-debug}"

if [ "$(uname)" != "Darwin" ]; then
  echo "❌ Build iOS requer macOS. Pulando..."
  exit 1
fi

echo "→ Verificando dependências..."
command -v xcodebuild >/dev/null 2>&1 || { echo "❌ Xcode não encontrado."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js não encontrado."; exit 1; }

echo "→ Instalando dependências npm..."
npm install --legacy-peer-deps

echo "→ Build do Next.js..."
CAPACITOR_SERVER_URL="${CAPACITOR_SERVER_URL:-}"
if [ -z "$CAPACITOR_SERVER_URL" ]; then
  echo "   CAPACITOR_SERVER_URL não definido — buildando com output estático"
  npx next build
else
  echo "   Modo servidor remoto: $CAPACITOR_SERVER_URL"
fi

echo "→ Sincronizando com Capacitor..."
npx cap sync ios

if [ "$MODE" = "release" ]; then
  echo "→ Build RELEASE (Archive + IPA)..."
  cd ios/App

  xcodebuild -workspace App.xcworkspace \
    -scheme "Aprova+" \
    -sdk iphoneos \
    -configuration Release \
    -archivePath "$PWD/build/Aprova+.xcarchive" \
    clean archive

  xcodebuild -exportArchive \
    -archivePath "$PWD/build/Aprova+.xcarchive" \
    -exportPath "$PWD/build" \
    -exportOptionsPlist "$PWD/exportOptions.plist"

  cd ../..
  echo ""
  echo "✅ IPA gerado em: ios/App/build/Aprova+.ipa"
  echo "   Use o Transporter ou Xcode para enviar à App Store Connect."
else
  echo "→ Build DEBUG..."
  npx cap run ios
  echo ""
  echo "✅ Build iOS concluído."
fi
