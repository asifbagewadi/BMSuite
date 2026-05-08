<script>
  import '../../../app.css';
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import { Mail, Lock, ArrowRight, Github } from '@lucide/svelte';
  
  export let data;
  export let form;

  let formElement;
  let googleCredential = '';
  let isLoading = false;

  onMount(() => {
    // Expose callback globally for Google Identity Services
    window.handleCredentialResponse = (response) => {
      googleCredential = response.credential;
      isLoading = true;
      setTimeout(() => {
        if (formElement) formElement.submit();
      }, 50);
    };
  });
</script>

<svelte:head>
  <title>Login - BMSuite</title>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-500">
  <!-- Main Container -->
  <div class="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-100 dark:border-gray-800">
    
    <!-- Left Side: Brand Visual (Hidden on Mobile) -->
    <div class="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
      <!-- Abstract Decorative Background Elements -->
      <div class="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px]"></div>
      <div class="absolute bottom-[-5%] left-[-10%] w-[200px] h-[200px] bg-indigo-400/20 rounded-full blur-[60px]"></div>
      
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-16">
          <div class="w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
             <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
             </svg>
          </div>
          <span class="text-3xl font-black tracking-tighter uppercase italic">BMSuite</span>
        </div>
        
        <h1 class="text-5xl font-black leading-[1.1] mb-6 tracking-tight">
          Everything you need <br/>
          <span class="text-blue-200">to grow faster.</span>
        </h1>
        <p class="text-blue-100/80 text-xl leading-relaxed max-w-sm">
          Empowering modern enterprises to build stronger customer relationships with precision and scale.
        </p>
      </div>
      
      <div class="relative z-10">
        <div class="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
          <div class="flex items-center gap-4 mb-3">
            <div class="flex -space-x-3">
              {#each [1, 2, 3] as i}
                <div class="w-8 h-8 rounded-full border-2 border-indigo-600 bg-blue-400 overflow-hidden">
                  <img src="https://i.pravatar.cc/100?u={i}" alt="user" class="w-full h-full object-cover" />
                </div>
              {/each}
            </div>
            <span class="text-sm font-semibold text-blue-100">+5,000 users active now</span>
          </div>
          <p class="text-sm text-blue-200 font-medium italic">
            "BMSuite has significantly improved our operational efficiency. It's fast, reliable, and incredibly scalable."
          </p>
        </div>
      </div>
    </div>
    
    <!-- Right Side: Form Content -->
    <div class="p-8 sm:p-14 lg:p-16 flex flex-col justify-center relative bg-white dark:bg-gray-900">
      
      <div class="max-w-md mx-auto w-full">
        <!-- Mobile Logo (Visible only on mobile) -->
        <div class="md:hidden flex items-center gap-2 mb-10">
           <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
             </svg>
           </div>
           <span class="text-xl font-bold tracking-tighter text-gray-900 dark:text-white uppercase italic">BMSuite</span>
        </div>

        <div class="mb-10">
          <h2 class="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Welcome back</h2>
          <p class="text-gray-500 dark:text-gray-400 text-lg">Enter your details to access your account.</p>
        </div>

        {#if form?.error}
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-6 text-sm font-medium flex items-center gap-3 animate-shake">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {form.error}
          </div>
        {/if}

        <!-- ✅ Email Login Form -->
        <form method="POST" action="?/emailLogin" use:enhance={() => { isLoading = true; return async ({ update }) => { isLoading = false; await update(); }; }} class="space-y-6">
          
          <div class="space-y-2">
            <label for="email" class="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email address</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
                class="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-500 transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center px-1">
              <label for="password" class="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
              <!-- Forgot password temporarily disabled
              <a href="/forgot-password" class="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">Forgot password?</a>
              -->
            </div>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                class="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-500 transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-none transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {#if isLoading}
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authenticating...
            {:else}
              Sign in to Dashboard
              <ArrowRight size={20} />
            {/if}
          </button>
        </form>

        <!-- Hidden form for Google Login action - temporarily disabled -->
        <!-- <form bind:this={formElement} method="POST" action="?/googleLogin" class="hidden">
          <input type="hidden" name="credential" bind:value={googleCredential} />
        </form> -->

        <!-- Google login temporarily disabled
        <div class="mt-8">
          {#if data.googleClientId}
            <div id="g_id_onload"
                 data-client_id="{data.googleClientId}"
                 data-context="signin"
                 data-ux_mode="popup"
                 data-callback="handleCredentialResponse"
                 data-auto_prompt="false">
            </div>

            <div class="g_id_signin w-full flex justify-center"
                 data-type="standard"
                 data-shape="rectangular"
                 data-theme="outline"
                 data-text="continue_with"
                 data-size="large"
                 data-width="100%"
                 data-logo_alignment="center"
                 style="border-radius: 1rem !important; overflow: hidden !important;">
            </div>
          {:else}
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center gap-3">
              <div class="text-blue-500">
                <Github size={20} />
              </div>
              <p class="text-xs text-blue-700 dark:text-blue-300 font-medium italic leading-tight">Corporate Single Sign-On is currently unavailable. Please use your email to continue.</p>
            </div>
          {/if}
        </div>
        -->
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) {
    background-color: #f9fafb;
  }
  
  :global(.dark body) {
    background-color: #030712;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }

  .animate-shake {
    animation: shake 0.4s ease-in-out;
  }

  /* Custom styling for Google Sign-In button container */
  :global(.S979Ac-j96v9c) {
    border-radius: 1rem !important;
  }
</style>
