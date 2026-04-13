<script>
  export let data;
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
  <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
      Login to BM Suite
    </h2>

    <form method="POST" class="space-y-4">
      
      <div>
        <label class="block text-sm text-gray-600 dark:text-gray-300">Email</label>
        <input 
          name="email"
          type="email"
          required
          class="w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 dark:text-gray-300">Password</label>
        <input 
          name="password"
          type="password"
          required
          class="w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <button
        type="submit"
        name="emailLogin"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>

    </form>

  </div>
</div>