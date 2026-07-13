import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';

/**
 * Proveedores comunes para los tests del CRM.
 *
 * Son tests de humo: comprueban que cada componente y servicio se puede construir
 * con sus dependencias reales. No prueban lógica, pero atrapan lo que el build no
 * ve: un servicio mal inyectado, un proveedor que falta, un template que revienta
 * al renderizar. Si mañana aparece una dependencia global nueva, va acá y no en
 * los 20 specs.
 */
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

export const testImports: unknown[] = [];

export const testProviders = [
  provideHttpClient(),
  provideHttpClientTesting(), // ningún test debe salir a la red de verdad
  // Comodín: los componentes con routerLink fallan con NG04002 si el router no
  // tiene rutas. Acá no se prueba el ruteo, solo que el componente se cree.
  provideRouter([{ path: '**', children: [] }]),
  provideIcons({}),
];
