#!/bin/bash

# Script de build para Vercel com logs detalhados

echo "🚀 Iniciando build para Vercel..."
echo "📊 Informações do ambiente:"
echo "  - Node version: $(node --version)"
echo "  - NPM version: $(npm --version)"
echo "  - Branch: $VERCEL_GIT_COMMIT_REF"
echo "  - Commit: $VERCEL_GIT_COMMIT_SHA"
echo ""

echo "📦 Verificando variáveis de ambiente..."
if [ -z "$VITE_SUPABASE_URL" ]; then
  echo "⚠️  VITE_SUPABASE_URL não está definida!"
else
  echo "✅ VITE_SUPABASE_URL está definida"
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "⚠️  VITE_SUPABASE_ANON_KEY não está definida!"
else
  echo "✅ VITE_SUPABASE_ANON_KEY está definida"
fi

if [ -z "$VITE_ENVIRONMENT" ]; then
  echo "⚠️  VITE_ENVIRONMENT não está definida!"
else
  echo "✅ VITE_ENVIRONMENT: $VITE_ENVIRONMENT"
fi

echo ""
echo "🔨 Executando build..."
npm run build

BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -eq 0 ]; then
  echo ""
  echo "✅ Build concluído com sucesso!"
  echo "📁 Arquivos gerados em dist/"
  ls -lh dist/ || echo "Não foi possível listar arquivos"
else
  echo ""
  echo "❌ Build falhou com código: $BUILD_EXIT_CODE"
  exit $BUILD_EXIT_CODE
fi
