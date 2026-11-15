# Plantilla de Pull Request — Frontend EFA

## Descripción

<!-- Qué cambia este Pull Request y por qué es necesario. -->

## Tipo de cambio

- [ ] Corrección de error (bugfix)
- [ ] Nueva funcionalidad (feature)
- [ ] Mejora de la observabilidad
- [ ] Cambio en el pipeline CI/CD
- [ ] Documentación
- [ ] Configuración de infraestructura

## Impacto en la observabilidad

- [ ] No afecta la observabilidad
- [ ] Afecta los logs: se revisa el formato del access log de nginx
- [ ] Afecta las métricas: se revisa el exporter de nginx
- [ ] Afecta las sondas: se revisan `/healthz` y `/nginx_status`

## Cumplimiento

- [ ] `npm run lint` pasa sin errores
- [ ] `npm test` pasa sin errores
- [ ] La cobertura no baja del umbral exigido (60 %)
- [ ] La imagen Docker no tiene vulnerabilidades `HIGH` ni `CRITICAL` (Trivy)
- [ ] No se introducen secretos en el código
- [ ] Se ejecutó `bash scripts/compliance/audit-frontend.sh` y el resultado fue aprobado

## Lista de verificación para la revisión

- [ ] El código es legible y sigue las convenciones del proyecto
- [ ] Los mensajes de error son útiles para diagnosticar un incidente
- [ ] Se probaron los cambios localmente (`npm run dev`)

## Evidencia

<!-- Enlace a la ejecución del workflow o capturas de los dashboards. -->
