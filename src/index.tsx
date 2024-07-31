/* @refresh reload */

import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';

import App from './App';
import InstallPage from './pages/InstallPage.tsx';
import TimetablePage from './pages/TimetablePage.tsx';
import LocationPage from './pages/LocationPage.tsx';
import ArtistPage from './pages/ArtistPage.tsx';
import ArtistsPage from './pages/ArtistsPage.tsx';
import MapPage from './pages/MapPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import { ARTIST_PATH, ARTISTS_PATH, HOME_PATH, LOCATION_PATH, MAP_PATH, TIMETABLE_PATH } from './constants.ts';

import './index.css';

const root = document.getElementById('root');

render(
    () => (
        <Router root={App}>
            <Route path={HOME_PATH} component={InstallPage} />

            <Route path={ARTISTS_PATH} component={ArtistsPage} />
            <Route path={ARTIST_PATH} component={ArtistPage} />

            <Route path={TIMETABLE_PATH} component={TimetablePage} />
            <Route path={LOCATION_PATH} component={LocationPage} />

            <Route path={MAP_PATH} component={MapPage} />

            <Route path="*404" component={NotFoundPage} />
        </Router>
    ),
    root!
);
