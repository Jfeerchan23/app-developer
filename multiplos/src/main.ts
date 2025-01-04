import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { AngularFireModule } from '@angular/fire/compat'; // Asegúrate de importar este módulo
import { importProvidersFrom } from '@angular/core'; // Importa importProvidersFrom para usar en proveedores
import { environment } from './environments/environment'; // Asegúrate de tener la configuración de Firebase

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // Usamos importProvidersFrom para incluir AngularFireModule
    importProvidersFrom(AngularFireModule.initializeApp(environment.firebaseConfig)),
  ],
});

