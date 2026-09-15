<template>
  <div class="page">

<div class="logo">
<img :src="'/logo.png'" class="logo" />
</div>


 <div class="dobrodojde">
      <p class="datum">📅 {{ datum }}</p>
      <p class="cas">🕐 {{ cas }}</p>
    </div>

    <div class="search">
      <input
        v-model="grad"
        type="text"
        placeholder="Внеси град..."
        @keyup.enter="fetchForecast"
      />
      <button @click="fetchForecast">Барај</button>
      <button @click="najdiMojaLokacija" class="lokacijaBtn">📍 Моја локација</button>
    </div>

    <div class="brziGradovi">
      <p class="label">🌍 Популарни градови:</p>
      <div class="kopchinja">
        <button
          v-for="g in popularni"
          :key="g"
          class="gradBtn"
          @click="brzoBaraj(g)"
        >
          {{ g }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="spinner"></div>

    <div v-else-if="greska" class="greskaBox">
      ⚠️ {{ greska }}
    </div>

    <div v-else-if="forecast" class="rezultat">
    <div class="naslovRed">
      <h2>📅 5-дневна прогноза за {{ gradIme }}</h2>
      <button class="unitBtn" @click="promeniEdinica">
        Смени на °{{ edinica === 'C' ? 'F' : 'C' }}
      </button>
    </div>
      <div class="denovi">
        <div v-for="den in forecast" :key="den.date" class="den">
          <p class="denDatum">{{ den.date }}</p>
          <img :src="`https://openweathermap.org/img/wn/${den.icon}@2x.png`" />
          <p class="denOpis">{{ den.opis }}</p>
          <p class="denTemp">{{ pretvoriTemp(den.temp) }}°{{ edinica }}</p>
          <div class="minmax">
            <span>⬆ {{ pretvoriTemp(den.max) }}°</span>
            <span>⬇ {{ pretvoriTemp(den.min) }}°</span>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="poraka">Внеси град за да ja видиш прогнозата ☝️</p>

    <NuxtLink to="/" class="btn">← Врати се на почетна страница</NuxtLink>


  </div>
</template>

<script setup>
const config = useRuntimeConfig()

const grad = ref('')
const gradIme = ref('')
const forecast = ref(null)
const datum = ref('')
const cas = ref('')
const loading = ref(false)
const greska = ref('')

const popularni = ['Skopje', 'London', 'New York', 'Paris', 'Tokyo']


const edinica = ref('C') // 'C' ili 'F'

function pretvoriTemp(tempC) {
  if (edinica.value === 'F') {
    return Math.round(tempC * 9/5 + 32)
  }
  return Math.round(tempC)
}

function promeniEdinica() {
  edinica.value = edinica.value === 'C' ? 'F' : 'C'
}

onMounted(() => {
  azurirajVreme()
  setInterval(azurirajVreme, 1000)
})

function azurirajVreme() {
  const sega = new Date()
  datum.value = sega.toLocaleDateString('mk-MK', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  cas.value = sega.toLocaleTimeString('mk-MK')
}

async function fetchForecast() {
  if (!grad.value) return

  loading.value = true
  greska.value = ''
  forecast.value = null

  const apiKey = config.public.weatherApiKey
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${grad.value}&appid=${apiKey}&units=metric`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      gradIme.value = data.city.name
      const denoviMap = {}
      data.list.forEach(item => {
        const d = item.dt_txt.split(' ')[0]
        if (item.dt_txt.includes('12:00:00')) {
          denoviMap[d] = {
            date: new Date(d).toLocaleDateString('mk-MK', { weekday: 'long', day: 'numeric', month: 'short' }),
            temp: Math.round(item.main.temp),
            max: Math.round(item.main.temp_max),
            min: Math.round(item.main.temp_min),
            opis: item.weather[0].description,
            icon: item.weather[0].icon
          }
        }
      })
      forecast.value = Object.values(denoviMap)
    } else {
      greska.value = 'Градот не е пронајден. Провери го името и пробај повторно.'
    }
  } catch (err) {
    greska.value = 'Проблем со конекцијата до API-то. Провери го интернетот и пробај повторно.'
  } finally {
    loading.value = false
  }
}

function najdiMojaLokacija() {
  if (!navigator.geolocation) {
    greska.value = 'Твојот browser не поддржува геолокација.'
    return
  }

  loading.value = true
  greska.value = ''
  forecast.value = null

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude
      const apiKey = config.public.weatherApiKey
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

      try {
        const response = await fetch(url)
        const data = await response.json()

        if (response.ok) {
          gradIme.value = data.city.name
          grad.value = data.city.name
          const denoviMap = {}
          data.list.forEach(item => {
            const d = item.dt_txt.split(' ')[0]
            if (item.dt_txt.includes('12:00:00')) {
              denoviMap[d] = {
                date: new Date(d).toLocaleDateString('mk-MK', { weekday: 'long', day: 'numeric', month: 'short' }),
                temp: Math.round(item.main.temp),
                max: Math.round(item.main.temp_max),
                min: Math.round(item.main.temp_min),
                opis: item.weather[0].description,
                icon: item.weather[0].icon
              }
            }
          })
          forecast.value = Object.values(denoviMap)
        } else {
          greska.value = 'Не успеав да ja најдам прогнозата за твојата локација.'
        }
      } catch (err) {
        greska.value = 'Проблем со врската. Пробај повторно.'
      } finally {
        loading.value = false
      }
    },
    (error) => {
      loading.value = false
      greska.value = 'Не дозволи пристап до локацијата, или има проблем со GPS.'
    }
  )
}

function brzoBaraj(imeGrad) {
  grad.value = imeGrad
  fetchForecast()
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 16px;
}

.logo {
  width: 100px;
  height: 100px;
  animation: lebdi 3s ease-in-out infinite alternate;
}

@keyframes lebdi {
  from { transform: translateY(0px); }
  to   { transform: translateY(-12px); }
}

.dobrodojde {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
}

.search {
  display: flex;
  gap: 10px;
  width: 100%;
  flex-wrap: wrap;
}

input {
  padding: 14px 24px;
  font-size: 1.1rem;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 50px;
  background: rgba(255,255,255,0.1);
  color: white;
  outline: none;
  flex: 1;
  min-width: 140px;
}
input::placeholder { color: rgba(255,255,255,0.5); }
input:focus { border-color: rgba(255,255,255,0.6); }

button {
  padding: 14px 28px;
  font-size: 1rem;
  background: rgba(0,0,0,0.2);       
  color: white;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover { background: rgba(0,0,0,0.35); }

.brziGradovi {
  width: 100%;
  text-align: center;
}

.label {
  color: rgba(255,255,255,0.5);
  font-size: 0.82rem;
  margin-bottom: 10px;
}

.kopchinja {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.gradBtn {
  padding: 8px 18px;
  font-size: 0.88rem;
  background: rgba(255,255,255,0.08);  
  color: white;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
}

.gradBtn:hover { background: rgba(0,0,0,0.35); }

.poraka {
  margin-bottom: 20px;
  color: rgba(255,255,255,0.45);
  font-size: 1rem;
}

.rezultat {
  width: 100%;
  text-align: center;
}

.rezultat h2 {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: rgba(255,255,255,0.9);
}

.denovi {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.den {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 20px 16px;
  text-align: center;
  flex: 1;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.den:hover {
  background: rgba(255,255,255,0.18);
  transform: translateY(-4px);
}

.denDatum {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  text-transform: capitalize;
}

.denOpis {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.65);
  text-transform: capitalize;
}

.denTemp {
  font-size: 1.8rem;
  font-weight: 700;
}

.minmax {
  display: flex;
  gap: 10px;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
}

.btn {
  padding: 12px 28px;
  background: rgba(255,255,255,0.15);
  color: white;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.2s;
  margin-bottom: 40px;
}

.btn:hover {
  background: rgba(255,255,255,0.25);
}

.naslovRed {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.naslovRed h2 {
  margin-bottom: 0;
}

.unitBtn {
  font-size: 0.85rem;
  padding: 8px 18px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255,255,255,0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: vrti 0.8s linear infinite;
  margin: 20px auto;
}

@keyframes vrti {
  to { transform: rotate(360deg); }
}

.greskaBox {
  background: rgba(220, 50, 50, 0.2);
  border: 1px solid rgba(220, 50, 50, 0.4);
  border-radius: 16px;
  padding: 16px 24px;
  color: rgba(255,255,255,0.9);
  font-size: 0.95rem;
}

.lokacijaBtn {
  white-space: nowrap;
}

/* responzivna */
@media (max-width: 600px) {
  .page {
    padding: 16px 12px;
  }

  .logo {
    width: 70px;
    height: 70px;
  }

  .search {
    flex-direction: column;
  }

  input, .search button {
    width: 100%;
  }

  .rezultat h2 {
    font-size: 1.15rem;
  }

  .den {
    min-width: 130px;
    padding: 16px 10px;
  }

  .denTemp {
    font-size: 1.5rem;
  }
}

@media (max-width: 380px) {
  .denovi {
    gap: 10px;
  }

  .den {
    min-width: 100%;
  }
}
</style>
