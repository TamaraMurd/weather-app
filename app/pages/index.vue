<template>
  <div class="page">

<div class="logo">
<img src="/logo.png" class="logo" />
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

    <div v-if="weather" class="result">
      <h2>{{ weather.name }}, {{ weather.sys.country }}</h2>
      <img 
        :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
        :alt="weather.weather[0].description"
      />
      <p class="opis">{{ weather.weather[0].description }}</p>
      <p class="temp">{{ Math.round(weather.main.temp) }}°C</p>
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
          <span>{{ Math.round(weather.main.feels_like) }}°C</span>
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
const posledniBarani = ref([])
const datum = ref('')
const cas = ref('')


const popularni = ['Skopje', 'London', 'New York', 'Paris', 'Tokyo']

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

  const apiKey = config.public.weatherApiKey
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${grad.value}&appid=${apiKey}&units=metric`

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
    weather.value = null
    alert('Градот не е пронајден!')
  }
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
  padding: 20px 0;
}

.search {
  display: flex;
  gap: 10px;
  width: 100%;
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
}

.detalItem {
  flex: 1;
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
</style>