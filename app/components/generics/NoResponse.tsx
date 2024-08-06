import { useLocation } from "@remix-run/react"

export default function NoResponse() {
    const { pathname } = useLocation()
    return (
        <main className="a_main sp">
            <section className="a_main_2">
                <div className="a_search_fr">
                    <h1 className="a_h1">404 / 500</h1>
                    <p>Die Seite <em>{pathname}</em> konnte nicht angezeigt werden.</p>
                    <p>Möglicherweise ist die URL nicht korrekt oder es handelt sich um einen internen Fehler.</p>
                </div>
            </section>
        </main>
    )
}