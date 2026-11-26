import { useState } from 'react';
import { useBase, check, click } from './modelUtils';
export function useGuide() { const m = useBase(), [checks, setChecks] = useState([false, false, false, false]); const n = checks.filter(Boolean).length; m.check = i => check(checks[i], v => setChecks(old => old.map((x, j) => i === j ? v : x))); m.props = { 'progreso-barra': { 'aria-valuenow': n }, 'progreso-relleno': { style: { width: `${n * 25}%` } }, 'reiniciar-checklist': click(() => setChecks([false, false, false, false])) }; m.content = { 'progreso-texto': `${n} de 4 pasos completados` }; return m; }
