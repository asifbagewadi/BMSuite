<script>
    import { Menu, Bell, User, Search, FileText, Settings, ChartBar, Home, X, LogOut, Moon, Sun } from '@lucide/svelte';
    import { onMount } from 'svelte';
    
    /** @type {{ data?: any, children: import('svelte').Snippet }} */
    let { data, children } = $props();
    
    let mobileMenuOpen = $state(false);
    let isDark = $state(false);
    
    const handleLogout = () => {
        // Perform logout action - you might want to redirect to logout endpoint
        window.location.href = '/logout';
    };

    const toggleDarkMode = () => {
        isDark = !isDark;
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    onMount(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            isDark = true;
            document.documentElement.classList.add('dark');
        } else {
            isDark = false;
            document.documentElement.classList.remove('dark');
        }
    });
    
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Top navigation -->
    <header class="bg-white dark:bg-gray-800 dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
        <div class="px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo and primary navigation -->
                <div class="flex items-center">
                    <!-- Logo -->
                    <div class="flex-shrink-0">
                        <h1 class="text-xl font-bold text-blue-600 dark:text-blue-400">BMSuite</h1>
                    </div>
                    
                    <!-- Desktop navigation -->
                    <nav class="hidden md:ml-8 md:flex md:space-x-1">
                        <a href="/admin" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Home class="w-4 h-4 mr-2" />
                            Dashboard
                        </a>
                        <a href="/admin/blogs" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <FileText class="w-4 h-4 mr-2" />
                            Blog Posts
                        </a>
                        <a href="/admin/contacts" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <User class="w-4 h-4 mr-2" />
                            Contact Submissions
                        </a>
                        <a href="/admin/newsletter" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <ChartBar class="w-4 h-4 mr-2" />
                            Newsletter
                        </a>
                    </nav>
                </div>

                <!-- Right side items -->
                <div class="flex items-center space-x-4">
                    <!-- Theme Toggle -->
                    <button 
                        onclick={toggleDarkMode}
                        class="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Toggle dark mode"
                    >
                        {#if isDark}
                            <Sun class="w-5 h-5" />
                        {:else}
                            <Moon class="w-5 h-5" />
                        {/if}
                    </button>

                    <!-- User logout -->
                    <a 
                        class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        href="/logout">
                        <LogOut class="w-4 h-4" />
                        <span class="hidden sm:block">Logout</span>
                    </a>

                    <!-- Mobile menu button -->
                    <button 
                        class="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onclick={() => mobileMenuOpen = !mobileMenuOpen}
                    >
                        {#if mobileMenuOpen}
                            <X class="w-6 h-6" />
                        {:else}
                            <Menu class="w-6 h-6" />
                        {/if}
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile navigation menu -->
        {#if mobileMenuOpen}
            <div class="md:hidden border-t border-gray-200 dark:border-gray-700 dark:border-gray-700 bg-white dark:bg-gray-800 dark:bg-gray-800">
                <nav class="px-4 py-3 space-y-1">
                    <a href="/admin" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onclick={() => mobileMenuOpen = false}>
                        <Home class="w-5 h-5 mr-3" />
                        Dashboard
                    </a>
                    <a href="/admin/blogs" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onclick={() => mobileMenuOpen = false}>
                        <FileText class="w-5 h-5 mr-3" />
                        Blog Posts
                    </a>
                    <a href="/admin/contacts" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onclick={() => mobileMenuOpen = false}>
                        <User class="w-5 h-5 mr-3" />
                        Contact Submissions
                    </a>
                    <a href="/admin/analytics" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onclick={() => mobileMenuOpen = false}>
                        <ChartBar class="w-5 h-5 mr-3" />
                        Analytics
                    </a>
                    
                    <!-- Mobile logout -->
                    <button 
                        class="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        onclick={handleLogout}
                    >
                        <LogOut class="w-5 h-5 mr-3" />
                        Logout
                    </button>
                    
                    <!-- Mobile search -->
                    <div class="pt-2">
                        <div class="relative">
                            <label for="admin-search" class="sr-only">Search</label>
                            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <input 
                                id="admin-search"
                                type="text" 
                                placeholder="Search..." 
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:bg-gray-700 text-gray-900 dark:text-white dark:text-white text-sm"
                            />
                        </div>
                    </div>
                </nav>
            </div>
        {/if}
    </header>

    <!-- Main content area -->
    <main class="p-6">
        {@render children()}
    </main>
</div>
