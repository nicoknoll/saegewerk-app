import Navigation from './components/Navigation.tsx';
import { DataProvider } from './data/DataContext.tsx';
import { TranslationProvider } from './utils/useTranslation.tsx';
import locale from './locale.ts';

function App(props: any) {
    return (
        <TranslationProvider translations={locale}>
            <DataProvider>
                <Navigation />
                {props.children}
            </DataProvider>
        </TranslationProvider>
    );
}

export default App;
