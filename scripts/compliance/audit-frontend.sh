#!/usr/bin/env bash
# =============================================================================
# audit-frontend.sh - Auditoria de cumplimiento del frontend EFA
#
# Verifica que el frontend cumpla las mismas politicas de seguridad, calidad
# y observabilidad que el backend. Los identificadores de politica son los
# del catalogo comun (compliance/policies/catalog.yml en el repositorio del
# backend), de modo que ambos repositorios se evaluan con los mismos
# criterios.
#
# Politicas evaluadas:
#   P-SEC-001  Sin secretos hardcodeados
#   P-SEC-002  Imagen sin privilegios y con HEALTHCHECK
#   P-SEC-005  Imagen base fijada a una version
#   P-OBS-001  Sonda de salud y observabilidad del servidor web
#   P-QA-004  Acciones de GitHub fijadas a una version
#   P-CI-001   El despliegue depende de las verificaciones en verde
#
# Uso:
#   audit-frontend.sh [directorio_del_proyecto]
#
# Codigo de salida: 0 si no hay hallazgos, 1 si hay hallazgos.
# =============================================================================
set -uo pipefail

TARGET_DIR="${1:-.}"
cd "${TARGET_DIR}"

FINDINGS=0

report() {
  echo "[BLOCKER] $1 | $2 | $3"
  FINDINGS=$((FINDINGS + 1))
}

minor() {
  echo "[MINOR] $1 | $2 | $3"
}

echo "=== Auditoria de cumplimiento del frontend EFA ==="

# -----------------------------------------------------------------------------
# P-SEC-001 - Secretos hardcodeados
# -----------------------------------------------------------------------------
echo ""
echo "--- P-SEC-001: secretos hardcodeados ---"
SECRET_RESULTS="$(grep -rInE --exclude-dir=node_modules --exclude-dir=.git \
    --exclude-dir=coverage --exclude-dir=dist --exclude=package-lock.json \
    '(api[_-]?key|secret|token|password)[[:space:]]*[:=][[:space:]]*["'"'"'][A-Za-z0-9/+_-]{12,}["'"'"']?' \
    . 2>/dev/null || true)"

while IFS= read -r LINE; do
  [[ -z "${LINE}" ]] && continue
  FILE="${LINE%%:*}"
  REST="${LINE#*:}"
  # Se descartan las referencias a variables de entorno y los marcadores.
  if grep -qE 'REEMPLAZAR|PLACEHOLDER|EXAMPLE|\$\{|\$\(|import\.meta\.env|process\.env|your[_-]|changeme|xxx' <<< "${REST}"; then
    continue
  fi
  case "${FILE}" in
    scripts/compliance/*|docs/*|*.md) continue ;;
  esac
  report "P-SEC-001" "${FILE}" "credencial con valor literal: $(echo "${REST}" | cut -c1-70)"
done <<< "${SECRET_RESULTS}"

# El .env no debe estar versionado.
for FILE in ".env" ".env.local" ".env.production"; do
  if git ls-files --error-unmatch "${FILE}" >/dev/null 2>&1; then
    report "P-SEC-001" "${FILE}" "archivo de credenciales versionado"
  fi
done

# -----------------------------------------------------------------------------
# P-SEC-002 y P-SEC-005 - Dockerfile
# -----------------------------------------------------------------------------
echo ""
echo "--- P-SEC-002 / P-SEC-005: Dockerfile ---"
if [[ -f "Dockerfile" ]]; then
  # Se toma la ultima instruccion USER: en un Dockerfile multietapa, la que
  # cuenta es la de la etapa de ejecucion (la ultima).
  USER_LINE="$(grep -iE '^[[:space:]]*USER[[:space:]]+' "Dockerfile" 2>/dev/null \
    | tail -n 1 | sed 's/^[[:space:]]*[Uu][Ss][Ee][Rr][[:space:]]*//' | tr -d '\r')"

  if [[ -z "${USER_LINE}" ]]; then
    report "P-SEC-002" "Dockerfile" "no declara la instruccion USER: la imagen se ejecuta como root"
  elif [[ "${USER_LINE}" == "root" || "${USER_LINE}" == "0" ]]; then
    report "P-SEC-002" "Dockerfile" "declara USER root"
  else
    echo "  [INFO] Dockerfile ejecuta como usuario '${USER_LINE}'"
  fi

  if ! grep -qiE 'HEALTHCHECK' "Dockerfile"; then
    report "P-SEC-002" "Dockerfile" "no declara HEALTHCHECK"
  fi

  while IFS= read -r LINE; do
    IMAGE="$(awk '{print $2}' <<< "${LINE}")"
    if ! grep -qE "^FROM .+@" <<< "${LINE}" && ! grep -qE "^FROM [^ ]+:[^ ]+" <<< "${LINE}"; then
      report "P-SEC-005" "Dockerfile" "imagen base sin version fija: ${IMAGE}"
    fi
  done < <(grep -E '^FROM ' "Dockerfile" | grep -v ' AS ')

  if ! grep -qE '^FROM .+ AS ' "Dockerfile" && ! grep -qE '^FROM .+ as ' "Dockerfile"; then
    minor "P-SEC-005" "Dockerfile" "no usa una construccion multietapa"
  fi
else
  report "P-SEC-002" "Dockerfile" "no existe el Dockerfile del frontend"
fi

# -----------------------------------------------------------------------------
# P-OBS-001 - Observabilidad del servidor web
# -----------------------------------------------------------------------------
echo ""
echo "--- P-OBS-001: observabilidad del frontend ---"
if [[ ! -f "nginx.conf" ]]; then
  report "P-OBS-001" "nginx.conf" "no existe la configuracion de nginx"
else
  # El access log debe estar en JSON: sin ello, Loki no puede indexar los
  # campos del log del frontend.
  if ! grep -qE 'log_format\s+json' "nginx.conf"; then
    report "P-OBS-001" "nginx.conf" "no define un formato de log en JSON (log_format json)"
  fi

  if ! grep -q 'location = /healthz' "nginx.conf"; then
    report "P-OBS-001" "nginx.conf" "no expone la sonda de salud /healthz"
  fi

  if ! grep -q 'stub_status' "nginx.conf"; then
    report "P-OBS-001" "nginx.conf" "no expone /nginx_status para el exporter de metricas"
  fi

  if ! grep -q 'server_tokens off' "nginx.conf"; then
    minor "P-OBS-001" "nginx.conf" "no desactiva server_tokens: expone la version de nginx"
  fi
fi

# El Dockerfile debe servir con nginx (no con el servidor de Node), para
# que el access log sea estructurado.
if [[ -f "Dockerfile" ]] && ! grep -q 'nginx' "Dockerfile"; then
  report "P-OBS-001" "Dockerfile" "la imagen de produccion no usa nginx: el access log no seria estructurado"
fi

# -----------------------------------------------------------------------------
# P-QA-004 - Acciones de GitHub fijadas
# -----------------------------------------------------------------------------
echo ""
echo "--- P-QA-004 / P-CI-001: workflows ---"
WORKFLOW_COUNT=0
for WORKFLOW in .github/workflows/*.yml .github/workflows/*.yaml; do
  [[ -f "${WORKFLOW}" ]] || continue
  WORKFLOW_COUNT=$((WORKFLOW_COUNT + 1))

  while IFS= read -r MATCH; do
    # Se quita el numero de linea que antepone grep -n, para que el
    # segundo campo sea realmente la accion.
    LINE="${MATCH#*:}"
    ACTION="$(awk '{print $2}' <<< "${LINE}")"
    # Se admiten tags con digito (v4, v5, v4.2.1 o 0.29.0, que es como
    # etiqueta la propia accion de Trivy) o un SHA de 40 caracteres.
    if ! grep -qE '@(v?[0-9]+([.][0-9]+)*|[0-9a-f]{40})$' <<< "${LINE}"; then
      report "P-QA-004" "${WORKFLOW}" "accion sin version fija: ${ACTION}"
    fi
  done < <(grep -nE '^\s*uses:\s*\S+' "${WORKFLOW}" || true)

  # Ningun paso de control puede ser tolerante a fallos.
  while IFS='|' read -r STEP_LINE STEP_NAME; do
    [[ -z "${STEP_NAME}" ]] && continue
    if grep -qiE 'lint|test|coverage|audit|scan|trivy|gate|security|build' <<< "${STEP_NAME}"; then
      report "P-CI-003" "${WORKFLOW}" "el paso '${STEP_NAME}' declara continue-on-error: true (linea ${STEP_LINE})"
    fi
  done < <(awk '
    /^[[:space:]]*-[[:space:]]*name:/ {
      name = $0
      sub(/^.*name:[[:space:]]*/, "", name)
    }
    /continue-on-error:[[:space:]]*true/ {
      printf "%d|%s\n", NR, name
    }
  ' "${WORKFLOW}")
done

if [[ "${WORKFLOW_COUNT}" -eq 0 ]]; then
  report "P-CI-001" ".github/workflows" "no se encontraron workflows"
else
  # El despliegue debe depender de las etapas de validacion.
  DEPLOY_FOUND=0
  for WORKFLOW in .github/workflows/*.yml; do
    [[ -f "${WORKFLOW}" ]] || continue
    if grep -qE 'name:.*[Dd]eploy' "${WORKFLOW}"; then
      DEPLOY_FOUND=1
      if ! grep -qE 'needs:' "${WORKFLOW}"; then
        report "P-CI-001" "${WORKFLOW}" "el job de despliegue no declara dependencias (needs:)"
      fi
    fi
  done
  if [[ "${DEPLOY_FOUND}" -eq 0 ]]; then
    minor "P-CI-001" ".github/workflows" "no se identifico un workflow de despliegue explicito"
  fi
fi

# -----------------------------------------------------------------------------
# P-QA-002 - Gate de cobertura en el pipeline
# -----------------------------------------------------------------------------
echo ""
echo "--- P-QA-002: gate de cobertura ---"
COVERAGE_GATE=0
for WORKFLOW in .github/workflows/*.yml; do
  [[ -f "${WORKFLOW}" ]] || continue
  if grep -qE 'coverage-summary|coverage-final|coverage.*threshold|umbral' "${WORKFLOW}"; then
    COVERAGE_GATE=1
  fi
done
if [[ "${COVERAGE_GATE}" -eq 0 ]]; then
  minor "P-QA-002" ".github/workflows" "ningun workflow define un gate de cobertura"
fi

# -----------------------------------------------------------------------------
# Resultado
# -----------------------------------------------------------------------------
echo ""
if [[ "${FINDINGS}" -gt 0 ]]; then
  echo "P-SEC-001/P-SEC-002/P-SEC-005/P-OBS-001/P-QA-004/P-CI-001/P-CI-003 FALLIDAS: ${FINDINGS} hallazgo(s). El pipeline se detiene."
  exit 1
fi

echo "P-SEC-001/P-SEC-002/P-SEC-005/P-OBS-001/P-QA-004/P-CI-001/P-CI-003 APROBADAS: el frontend cumple las politicas."
exit 0
