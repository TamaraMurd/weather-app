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
        @keyup.enter="fetchWeather"
      />
      <button @click="fetchWeather">Барај</button>
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

<div v-else-if="weather" class="result">
  <h2>{{ weather.name }}, {{ weather.sys.country }}</h2>
  <img 
    :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
    :alt="weather.weather[0].description"
  />
  <p class="opis">{{ weather.weather[0].description }}</p>
  <p class="temp">
    {{ pretvoriTemp(weather.main.temp) }}°{{ edinica }}
    <button class="unitBtn" @click="promeniEdinica">
      Смени на °{{ edinica === 'C' ? 'F' : 'C' }}
    </button>
  </p>
  <div class="detali">
    <div class="detalItem">
      <span>💧</span>
      <span>{{ weather.main.humidity }}%</span>
      <span>Влажност</span>
    </div>
    <div class="detalItem">
      <span>💨</span>
      <span>{{ weather.wind.speed }} m/s</span>
      <span>Ветер</span>
    </div>
    <div class="detalItem">
      <span>🌡</span>
      <span>{{ pretvoriTemp(weather.main.feels_like) }}°{{ edinica }}</span>
      <span>Се чувствува</span>
    </div>
  </div>
</div>

<p v-else class="poraka">Внеси град за да го видиш времето ☝️</p>

    <div v-if="posledniBarani.length > 0" class="posledni">
      <p class="label">🕐 Последно пребарувани:</p>
      <div class="kopchinja">
        <button
          v-for="g in posledniBarani"
          :key="g"
          class="gradBtn"
          @click="brzoBaraj(g)"
        >
          {{ g }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
const config = useRuntimeConfig()

const grad = ref('')
const weather = ref(null)
const loading = ref(false)
const greska = ref('')
const posledniBarani = ref([])
const datum = ref('')
const cas = ref('')


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


//pri vcituvanje na stranicata se povikkuva i  go azurira sekoja skunda 1000
onMounted(() => {
  azurirajVreme()
  setInterval(azurirajVreme, 1000)
})

//kreirame nov date objekt so posle go formatirame na mkd
function azurirajVreme() {
  const sega = new Date()
  datum.value = sega.toLocaleDateString('mk-MK', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  cas.value = sega.toLocaleTimeString('mk-MK')
}

//fetch funkcja za kopce baraj grad

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

      if (!posledniBarani.value.includes(grad.value)) {
        posledniBarani.value.unshift(grad.value)
        if (posledniBarani.value.length > 4) {
          posledniBarani.value.pop()
        }
      }
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
  weather.value = null

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude
      const apiKey = config.public.weatherApiKey
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

      try {
        const response = await fetch(url)
        const data = await response.json()

        if (response.ok) {
          weather.value = data
          grad.value = data.name
        } else {
          greska.value = 'Не успеав да го најдам времето за твојата локација.'
        }
      } catch (err) {
        greska.value = 'Проблем со конекцијата. Пробај повторно.'
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
  fetchWeather()
}
</script>
<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  min-height: 40vh;
  justify-content: center;   
  padding: 20px 16px;
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

.logo {
  width: 100px;
  height: 100px;
  animation: lebdi 3s ease-in-out infinite alternate;
}

@keyframes lebdi {
  from { transform: translateY(0px); }
  to   { transform: translateY(-12px); }
}

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

.result {
  width: 100%;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
}

.result h2 {
  font-size: 2rem;
  margin-bottom: 4px;
}

.result img {
  width: 100px;
  height: 100px;
}

.temp {
  font-size: 5rem;
  font-weight: 700;
  line-height: 1;
  margin: 8px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.opis {
  text-transform: capitalize;
  color: rgba(255,255,255,0.7);
  font-size: 1.1rem;
  margin-bottom: 24px;
}

.detali {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.detalItem {
  flex: 1;
  min-width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  background: rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 16px 10px;
  color: rgba(255,255,255,0.75);
}

.detalItem span:nth-child(2) {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
}

.dobrodojde {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
}

.brziGradovi, .posledni {
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
  color: white;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
}

.gradBtn:hover { background: rgba(255,255,255,0.2); }

.poraka {
  color: rgba(255,255,255,0.45);
  font-size: 1rem;
}

.unitBtn {
  font-size: 0.9rem;
  padding: 6px 14px;
  margin-left: 0;
  vertical-align: middle;
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
    gap: 14px;
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

  .result {
    padding: 24px 18px;
  }

  .result h2 {
    font-size: 1.5rem;
  }

  .temp {
    font-size: 3rem;
  }

  .detali {
    gap: 10px;
  }

  .detalItem {
    min-width: 80px;
    padding: 12px 8px;
    font-size: 0.8rem;
  }

  .dobrodojde {
    gap: 10px;
    font-size: 0.8rem;
    text-align: center;
  }
}

@media (max-width: 380px) {
  .temp {
    font-size: 2.3rem;
    flex-direction: column;
    gap: 8px;
  }

  .result h2 {
    font-size: 1.3rem;
  }
}
</style>
