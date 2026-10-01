// js/config/neon-config.js
// Crea y exporta la conexión a Neon (PostgreSQL serverless) una sola vez.
// Todas las demás carpetas de js/ importan `sql` desde aquí.

import { neon } from 'https://esm.sh/@neondatabase/serverless';

const CONNECTION_STRING = 'postgresql://neondb_owner:npg_UdFJm6fRB0oj@ep-bold-sound-b55c6fsc-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

export const sql = neon(CONNECTION_STRING);
