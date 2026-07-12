// Ruta relativa a propósito: nginx sirve el CRM y proxea /ms-plans bajo el MISMO
// origen (crm.ius-cloud.com), así que no hay CORS que configurar ni host que
// hardcodear. Si algún día el CRM se sirve desde otro dominio, aquí va la URL completa.
export const environment = {
  production: true,
  apiMsPlans: '/ms-plans/api/v1',
};
