import {ref, type Ref, watchEffect} from "vue";
import axios, {type CancelTokenSource} from "axios";

export function useUserFetch(userId: Ref<number>) {
  const data = ref<any>({})
  const loading = ref<boolean>(true)
  const error = ref<any>(null)

  const cache = new Map<number, any>()
  let cancelSource: CancelTokenSource | null = null

  watchEffect(async (onCleanup) => {
    const id = userId.value
    if (!id) return;

    if (cache.has(id)) {
      data.value = cache.get(id)
      return;
    }

    if (cancelSource) cancelSource.cancel()
    cancelSource = axios.CancelToken.source()

    loading.value = true
    error.value = null;

    try {
      const response = await axios.get(`https://my-json-server.typicode.com/typicode/demo/posts/${id}`, {
        cancelToken: cancelSource.token,
      })
      cache.set(id, response.data)
      data.value = response.data
    } catch (err) {
      if (axios.isCancel(err)) error.value = err
    } finally {
      loading.value = false
    }

    onCleanup(() => {
      if (cancelSource) cancelSource.cancel()
    })
  })

  return { loading, error, data }
}