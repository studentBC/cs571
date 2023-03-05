import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { FavoritesComponent } from './favorites/favorites.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '#businessTab', component: SearchComponent },
  { path: '#spotifyArtist', component: SearchComponent },
  { path: '#venuesDetails', component: SearchComponent },
  { path: '**', redirectTo: 'search'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
