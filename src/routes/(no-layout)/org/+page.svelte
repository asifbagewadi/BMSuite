<script>
    import '../../../app.css'
    import { enhance } from '$app/forms';
    import { Building, LogOut, Plus, ChevronRight, LayoutGrid } from '@lucide/svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import imgLogo from '$lib/assets/images/logo.png';
    
    // Get the data from the server load function
    export let data;
    const { orgs } = data;
    
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-500">
    <!-- Header/Logo Area -->
    <div class="w-full max-w-7xl mx-auto px-6 pt-12 flex justify-between items-start">
        <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden p-2">
                <img src={imgLogo} alt="BMSuite Logo" class="w-full h-full object-contain" />
            </div>
            <div>
                <h1 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase italic">BMSuite</h1>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Enterprise Management</p>
            </div>
        </div>

        <a 
            href="/logout" 
            class="flex items-center gap-2 px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-200 font-semibold text-sm group"
        >
            <LogOut class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            Sign out
        </a>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center p-6 pb-24">
        <div class="w-full max-w-4xl">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Choose your organization</h2>
                <p class="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">Select a workspace to continue managing your customers and operations.</p>
            </div>

            <!-- Organizations Grid -->
            {#if orgs.length > 0}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {#each orgs as org}
                        <form method="POST" action="?/select" use:enhance class="w-full">
                            <input type="hidden" name="orgId" value={org.id} />
                            <input type="hidden" name="orgName" value={org.name} />
                            
                            <button 
                                class="group relative bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 text-left overflow-hidden w-full"
                                type="submit"
                            >
                                <!-- Top Accent Bar -->
                                <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <!-- Background Accent Glow -->
                                <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/5 rounded-bl-full translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500"></div>

                                <div class="relative z-10">
                                    <div class="flex items-center gap-5 mb-6">
                                        <div class="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm border border-blue-100 dark:border-blue-800/50">
                                            <Building class="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {org.name}
                                            </h3>
                                            <div class="flex items-center gap-2 mt-1">
                                                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                                                    {org.role || 'Member'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center justify-between text-xs font-bold text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-widest">
                                        <span>Enter Workspace</span>
                                        <ChevronRight class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </button>
                        </form>
                    {/each}

                    <!-- Create New Card -->
                    <a 
                        href="/org/new"
                        class="group relative bg-gray-50 dark:bg-gray-800/30 rounded-[2rem] p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white hover:bg-white dark:hover:bg-gray-900 transition-all duration-300 flex flex-col items-center justify-center text-center gap-4"
                    >
                        <div class="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center text-gray-400 group-hover:bg-gray-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-gray-900 group-hover:scale-110 transition-all duration-300">
                            <Plus class="w-8 h-8" />
                        </div>
                        <div>
                            <span class="block text-lg font-bold text-gray-900 dark:text-white">Create New</span>
                            <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">Add another organization</span>
                        </div>
                    </a>
                </div>
            {:else}
                <div class="bg-white dark:bg-gray-900 rounded-[3rem] p-16 text-center shadow-xl border border-gray-100 dark:border-gray-800">
                    <div class="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-blue-600 dark:text-blue-400">
                        <LayoutGrid class="w-12 h-12" />
                    </div>
                    <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">No organizations found</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-lg mb-10 max-w-xs mx-auto">You're logged in, but you don't belong to any organizations yet.</p>
                    <a 
                        href="/org/new"
                        class="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus class="w-6 h-6" />
                        Create Organization
                    </a>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    :global(body) {
        overflow-x: hidden;
    }
</style>
