<template>
  <div class="page">

<div class="logo">
<img :src="'/logo.png'" class="logo" />
</div>

    <div class="naslov">
      <h2>Остави Feedback</h2>
      <p class="subtitle">Кажи ни го твоето мислење за апликацијата</p>
    </div>

    <div class="forma">
      <div class="pole">
        <label>👤 Име</label>
        <input v-model="ime" type="text" placeholder="Твоето име..." />
      </div>
      <div class="pole">
        <label>⭐ Оценка</label>
        <div class="zvezdi">
          <!-- gi generirame zvezdite -->
          <span
            v-for="n in 5"  
            :key="n"
            class="zvezda"
            :class="{ aktivna: n <= ocenka }"
            @click="ocenka = n"
          >★</span>
        </div>
      </div>
      <div class="pole">
        <label>📝 Коментар</label>
        <textarea
          v-model="komentar"
          placeholder="Напиши го твоето мислење..."
          rows="4"
        />
      </div>
      <button @click="praticFeedback">Прати Feedback</button>
    </div>

    <div v-if="prateno" class="uspeh">
      <p>✅ Благодариме за твојот feedback, {{ ime }}!</p>
      <p class="subtitle">Твојата оценка: {{ ocenka }}/5 ⭐</p>
    </div>

    <div v-if="feedbackLista.length > 0" class="lista">
      <h3>🗣 Досегашни мислења</h3>
      <div v-for="(f, i) in feedbackLista" :key="i" class="feedbackItem">
        <div class="feedbackGore">
          <span class="feedbackIme">👤 {{ f.ime }}</span>
          <span class="feedbackZvezdi">{{ '★'.repeat(f.ocenka) }}</span>
        </div>
        <p class="feedbackKomentar">{{ f.komentar }}</p>
      </div>
    </div>

    <NuxtLink to="/" class="btn">← Врати се на почетна страница</NuxtLink>


  </div>
</template>

<script setup>
const ime = ref('')
const ocenka = ref(0)
const komentar = ref('')
const prateno = ref(false)
const feedbackLista = ref([])

function praticFeedback() {
  if (!ime.value || !komentar.value || ocenka.value === 0) {
    alert('Сите полиња се задолжителни!')
    return
  }

  feedbackLista.value.unshift({
    ime: ime.value,
    ocenka: ocenka.value,
    komentar: komentar.value
  })

  prateno.value = true

  setTimeout(() => {
    prateno.value = false
    ime.value = ''
    ocenka.value = 0
    komentar.value = ''
  }, 10000)
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 0;
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

.naslov h2 {
  font-size: 1.8rem;

}
.forma {
  width: 100%;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pole {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.pole label {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
}

input, textarea {
  padding: 12px 18px;
  font-size: 1rem;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 14px;
  background: rgba(0,0,0,0.2);
  color: white;
  outline: none;
  font-family: system-ui, sans-serif;
  resize: none;
}

input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.4); }
input:focus, textarea:focus { border-color: rgba(255,255,255,0.5); }

.zvezdi {
  display: flex;
  gap: 8px;
}

.zvezda {
  font-size: 2rem;
  cursor: pointer;
  color: rgba(255,255,255,0.25);
  transition: all 0.2s;
}

.zvezda.aktivna {
  color: #fbbf24;
}

.zvezda:hover {
  transform: scale(1.2);
}

button {
  padding: 14px;
  font-size: 1rem;
  background: rgba(0,0,0,0.25);
  color: white;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover { background: rgba(0,0,0,0.4); }

.uspeh {
  background: rgba(34,197,94,0.2);
  border: 1px solid rgba(34,197,94,0.4);
  border-radius: 16px;
  padding: 20px 32px;
  text-align: center;
}

.uspeh p { font-size: 1.1rem; }

.lista {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lista h3 {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 4px;
}

.feedbackItem {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 16px;
  padding: 16px 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feedbackGore {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feedbackIme {
  font-size: 0.9rem;
  font-weight: 600;
}

.feedbackZvezdi {
  color: #fbbf24;
  font-size: 1rem;
}

.feedbackKomentar {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.5;
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

</style>