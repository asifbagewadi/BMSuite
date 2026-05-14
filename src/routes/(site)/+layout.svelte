<script>
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import '../../app.css';
  import logo from '$lib/assets/images/logo.png';
  import { Menu, X, ArrowRight } from '@lucide/svelte';

  let isMenuOpen = false;
  let scrollY = 0;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  $: if (page.url.pathname) {
    isMenuOpen = false;
  }

  $: navbarClass = scrollY > 10
    ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50'
    : 'bg-white/80 backdrop-blur-sm shadow-md';

  onMount(() => {
    const handleScroll = () => scrollY = window.scrollY;
    window.addEventListener('scroll', handleScroll);

    /** @param {Event} event */
    const handleClickOutside = (event) => {
      const nav = document.querySelector('nav');
      if (isMenuOpen && nav && !nav.contains(/** @type {Node} */ (event.target))) {
        isMenuOpen = false;
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<svelte:window bind:scrollY />

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/favicon.png" type="image/png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta name="theme-color" content="#2563EB" />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="MicroPyramid" />
  <link rel="canonical" href="https://bottlecrm.io{page.url.pathname}" />
  <meta property="og:site_name" content="BMSuite" />
  <meta property="og:locale" content="en_US" />
</svelte:head>

<div class="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
  <!-- Navigation -->
  <nav class="fixed top-0 w-full z-50 transition-all duration-300 {navbarClass}">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center flex-shrink-0">
          <a href="/" class="flex items-center group" aria-label="BMSuite Homepage">
            <div class="relative">
              <img src={logo} alt="BMSuite Logo" class="h-9 w-9 sm:h-12 sm:w-12 group-hover:opacity-90 transition-opacity duration-200" />
              <div class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <span class="ml-2 text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">BMSuite</span>
          </a>
        </div>

        <!-- Desktop nav — Login + Get Started only -->
        <div class="hidden sm:flex items-center space-x-3">
          <a href="/login" class="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Get Started
            <ArrowRight class="ml-2 w-4 h-4" />
          </a>
        </div>

        <!-- Mobile hamburger -->
        <div class="sm:hidden">
          <button
            onclick={toggleMenu}
            class="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {#if isMenuOpen}
              <X class="h-6 w-6" />
            {:else}
              <Menu class="h-6 w-6" />
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    {#if isMenuOpen}
      <div class="sm:hidden bg-white border-t border-gray-200 shadow-lg">
        <div class="px-4 pt-4 pb-6 space-y-3">
          <a href="/login" class="block w-full text-center px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all duration-200">
            Get Started
          </a>
        </div>
      </div>
    {/if}
  </nav>

  <!-- Page content -->
  <main class="flex-grow pt-16">
    <slot />
  </main>

  <!-- Minimal footer -->
  <footer class="bg-gray-900 text-gray-400 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <img src={logo} alt="BMSuite Logo" class="h-7 w-7" />
          <span class="text-white font-bold text-lg">BMSuite</span>
        </div>
        <p class="text-sm text-center">
          © {new Date().getFullYear()} BMSuite by
          All rights reserved.
        </p>
        <div class="flex gap-4 text-sm">
          <a href="/privacy-policy" class="hover:text-white transition-colors">Privacy</a>
          <a href="/terms-of-service" class="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </div>
  </footer>
</div>
