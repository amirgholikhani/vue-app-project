import {computed, ref} from "vue";
import axios, {AxiosError} from "axios";

export function useCircuitBreaker(baseURL: string) {
  const loading = ref<boolean>(false);
  const state = ref<"OPEN" | "HALF_OPEN" | "CLOSED">("CLOSED")
  const openUntil = ref<number | null>(null);
  const failures = ref<number>(0)

  const CIRCUIT_BREAKER_THRESHOLD = 3
  const CIRCUIT_BREAKER_TIMEOUT = 60 * 1000

  const api = axios.create({ baseURL })

  api.interceptors.request.use((config) => {
    if (state.value === "OPEN") {
      if(Date.now() < (openUntil.value || 0)) {
        console.warn('Service temporarily unavailable (circuit OPEN)')

        return Promise.reject(
          new AxiosError("Circuit is OPEN", "ERR_CIRCUIT_OPEN", config)
        );
      } else {
        state.value = "HALF_OPEN"
      }
    }
    loading.value = true
    return config;
  })

  api.interceptors.response.use((res) => {
    if (state.value === "HALF_OPEN") {
      state.value = "CLOSED"
    }
    failures.value = 0
    loading.value = false
    return res
  }, (error) => {
    failures.value++;
    if (state.value === "HALF_OPEN" || failures.value >= CIRCUIT_BREAKER_THRESHOLD) {
      state.value = "OPEN"
      openUntil.value = Date.now() + CIRCUIT_BREAKER_TIMEOUT
      failures.value = 0;
      console.warn('Circuit Breaker open duo to failures')
    }
    loading.value = false
    return Promise.reject(error);
  })

  const message = computed(() =>
    state.value === "OPEN"
      ? "Service temporarily unavailable, try soon ..." : null
  )

  return { failures, message, api, loading, state}
}