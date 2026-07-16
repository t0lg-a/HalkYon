import { useEffect } from "react"
import { useHashRoute } from "@/lib/route"
import { Shell, type PageKey } from "@/site/shell"
import Anasayfa from "@/site/anasayfa"
import Projeksiyon from "@/site/projeksiyon"
import Anketler from "@/site/anketler"
import Secimler from "@/site/secimler"
import Simulator from "@/site/simulator"
import Analizler from "@/site/analizler"

/* The site. Six surfaces on one shell; unknown hashes land on the front
   page. Everything rendered anywhere here is a synthetic specimen. */

const KEYS: PageKey[] = ["anasayfa", "projeksiyon", "anketler", "secimler", "simulator", "analizler"]
const TITLES: Record<PageKey, string> = {
  anasayfa: "anasayfa",
  projeksiyon: "projeksiyon",
  anketler: "anketler",
  secimler: "seçimler",
  simulator: "simülatör",
  analizler: "analizler",
}

export default function App() {
  const route = useHashRoute()
  const page: PageKey = (KEYS as string[]).includes(route.page) ? (route.page as PageKey) : "anasayfa"
  const paramsKey = route.params.toString()

  useEffect(() => {
    document.title = `halkyön · ${TITLES[page]} · temsili şablon`
  }, [page])
  useEffect(() => {
    scrollTo(0, 0)
  }, [page, paramsKey])

  return (
    <Shell active={page}>
      {page === "anasayfa" ? <Anasayfa /> : null}
      {page === "projeksiyon" ? <Projeksiyon /> : null}
      {page === "anketler" ? <Anketler params={route.params} /> : null}
      {page === "secimler" ? <Secimler params={route.params} /> : null}
      {page === "simulator" ? <Simulator /> : null}
      {page === "analizler" ? <Analizler params={route.params} /> : null}
    </Shell>
  )
}
