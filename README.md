Временска Прогноза
Техничка документација


1. Вовед
„Временска Прогноза“ е веб-апликација за прикажување на моментални временски услови и 5-дневна прогноза за произволен град во светот. Апликацијата овозможува пребарување по име на град, автоматско откривање на локацијата на корисникот, брз пристап до популарни и претходно барани градови, промена помеѓу °C и °F, и промена помеѓу светла и темна тема.
Целта на овој документ е да ја опише архитектурата, технологиите, структурата на кодот и клучните функционалности на апликацијата.

2. Технологии
   Nuxt 3 (Vue 3)
   Vite
   JavaScript / Vue SFC (.vue)
   OpenWeatherMap API (Current Weather + 5 Day Forecast)
   CSS (scoped, во секоја компонента)
   Vitest (конфигурирано во vitest.config.ts)
   
3. Структура на проектот
weather-app/
├── app/
│   ├── app.vue              (главен layout: header, nav, sidebar, footer)
│   ├── public/
│   │   ├── logo.png
│   │   ├── favicon.ico
│   │   └── robots.txt
│   └── pages/
│       ├── index.vue        (Дневна прогноза - почетна страница)
│       ├── forecast.vue     (5-дневна прогноза)
│       ├── feedback.vue     (Остави мислење)
│       └── about.vue        (За нас)
├── nuxt.config.ts
├── package-lock.jsonn
├── package.json
├── tsconfig.json
└── vitest.config.ts

Клучна конфигурација во nuxt.config.ts:
export default defineNuxtConfig({
  srcDir: 'app/',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      weatherApiKey: process.env.NUXT_PUBLIC_WEATHER_API_KEY || '',
    },
  },
})
API клучот за OpenWeatherMap се чува во environment променлива (.env) и се чита преку useRuntimeConfig(), со цел да не биде хардкодиран директно во кодот.

4. Страници на апликацијата
   4.1 Дневна прогноза (index.vue)
Почетна страница на апликацијата. Овозможува:
    • Пребарување на моментално време по име на град (OpenWeatherMap Current Weather API)
    • Автоматско наоѓање на времето преку геолокација на корисникот
    • Брз пристап до популарни градови (Skopje, London, New York, Paris, Tokyo)
    • Листа на последно барани градови (максимум 4, се чуваат во текот на сесијата)
    • Приказ на температура, влажност, брзина на ветер и „се чувствува“ температура
    • Toggle помеѓу °C и °F
    • Loading индикатор (spinner) додека трае барањето
    • Прикажување на јасна порака за грешка наместо browser alert(), при непостоечки град или проблем со врската
  4.2 5-Дневна прогноза (forecast.vue)
Слична функционалност како index.vue, но повикува друга рута од OpenWeatherMap API (forecast) и групира резултати по ден (земајќи го записот во 12:00 часот за секој ден). Ги содржи истите функционалности: пребарување по град, геолокација, populatni градови, °C/°F toggle, loading и error состојби.
  4.3 Остави мислење (feedback.vue)
Страница со форма каде корисниците можат да остават мислење/фидбек за апликацијата.
  4.4 За нас (about.vue)
Статична страница со информации за апликацијата и/или авторот.
  4.5 app.vue (главен layout)
Содржи заеднички елементи за сите страници:
    • Хедер со наслов и навигациско мени (NuxtLink кон сите страници)
    • Странични панели (sidepanel) со брз преглед на температура во неколку градови и совети според времето
    • Анимирани облаци во позадина (декоративен CSS елемент)
    • Копче за менување помеѓу светла и темна тема
    • Footer со copyright и извор на податоци

5. Клучни функционалности - технички опис
   5.1 Пребарување по град
Функцијата fetchWeather() (index.vue) / fetchForecast() (forecast.vue) прави HTTP барање до OpenWeatherMap API со внесеното име на градот и API клучот од runtimeConfig. Одговорот се складира во reactive променлива (weather / forecast) и автоматски се рендерира преку Vue реактивноста.
async function fetchWeather() {
  if (!grad.value) return
  loading.value = true
  greska.value = ''
  weather.value = null
 
  const apiKey = config.public.weatherApiKey
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${grad.value}&appid=${apiKey}&units=metric`
 
  try {
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok) {
      weather.value = data
    } else {
      greska.value = 'Градот не е пронајден...'
    }
  } catch (err) {
    greska.value = 'Проблем со врската...'
  } finally {
    loading.value = false
  }
}
5.2 Промена на температурни единици (°C / °F)
Reactive променлива edinica ('C' или 'F') и функција pretvoriTemp() ја конвертираат температурата пред приказ, без повторно повикување на API-то:
function pretvoriTemp(tempC) {
  if (edinica.value === 'F') {
    return Math.round(tempC * 9/5 + 32)
  }
  return Math.round(tempC)
}
5.3 Loading и Error состојби
Наместо стандарден browser alert(), интерфејсот користи три реактивни состојби кои взаемно се исклучуваат преку v-if / v-else-if / v-else во темплејтот:
Состојба: loading = true              Прикажан UI елемент: Прикажан е анимиран spinner (CSS animation, ротирачки circle border)
Состојба: greska != ''                Прикажан UI елемент: Прикажана е обоена порака за грешка (пр. град не постои, проблем со интернет)
Состојба: weather / forecast != null  Прикажан UI елемент: Прикажан е резултатот со временски податоци

5.4 Геолокација
Копчето „📍 Моја локација“ ја користи вградената browser API navigator.geolocation.getCurrentPosition(), која бара дозвола од корисникот и враќа координати (latitude, longitude). Тие координати потоа се користат за повик до истиот OpenWeatherMap API, но со параметри lat/lon наместо име на град:
navigator.geolocation.getCurrentPosition(
  async (position) => {
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    const url = `.../weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    // ... fetch и прикажување, исто како при пребарување по град
  },
  (error) => {
    greska.value = 'Не дозволи пристап до локацијата...'
  }
)
5.5 Светла / темна тема
Reactive променлива temnoRezim (true/false) во app.vue се менува преку копче во навигацијата и се додава/отстранува CSS класа .temno на главниот <div class="app">. Стандардната (светла) состојба ја користи постоечката сина позадина; темниот режим користи потемна тег-сина позадина, со прилагодени контрасти за картичките, навигацијата и footer-от.
const temnoRezim = ref(false)
function promeniRezim() {
  temnoRezim.value = !temnoRezim.value
}
CSS:
.app.temno {
  background: linear-gradient(135deg, #041c3a, #062a52, #0a1f38);
}
5.6 Динамички приказ на слика (лого)
Логото се сервира од app/public/logo.png и се вчитува преку динамичко :src врзување (:src="'/logo.png'") наместо статички src атрибут, со цел Vite да не се обиде да го третира патот како ES-модул import при build/transform фазата.
