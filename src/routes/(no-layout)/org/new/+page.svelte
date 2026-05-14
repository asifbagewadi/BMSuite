<script>
    import '../../../../app.css'
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { Building2, ArrowLeft, Check, AlertCircle, Building } from '@lucide/svelte';
    import imgLogo from '$lib/assets/images/logo.png';
  
    export let form; // This contains the result of your form action
    
    // Handle form submission success
    $: if (form?.data) {
        // Redirect after a short delay to show success message
        setTimeout(() => {
            goto('/org');
        }, 1500);
    }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-500">
    <!-- Header/Logo Area -->
    <div class="w-full max-w-7xl mx-auto px-6 pt-12">
        <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden p-2">
                <img src={imgLogo} alt="BMSuite Logo" class="w-full h-full object-contain" />
            </div>
            <div>
                <h1 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase italic">BMSuite</h1>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Enterprise Management</p>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center p-6 pb-24">
        <div class="w-full max-w-lg">
            <!-- Back Link -->
            <div class="mb-8">
                <a 
                    href="/org" 
                    class="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-bold transition-colors group"
                >
                    <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Selection
                </a>
            </div>

            <div class="text-center mb-10">
                <h2 class="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Create workspace</h2>
                <p class="text-gray-500 dark:text-gray-400 text-lg">Set up a new organization to start managing your data.</p>
            </div>

            <!-- Form Card -->
            <div class="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 p-8 sm:p-12">
                <form action="/org/new" method="POST" use:enhance class="space-y-8">
                    <!-- Organization Name Field -->
                    <div class="space-y-3">
                        <label for="org_name" class="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                            Organization Name
                        </label>
                        <div class="relative group">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <Building size={20} />
                            </div>
                            <input 
                                type="text" 
                                id="org_name" 
                                name="org_name" 
                                required 
                                class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-500 transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="e.g. Acme Corporation"
                            />
                        </div>
                    </div>

                    <!-- Status Messages -->
                    {#if form?.error}
                        <div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl animate-shake">
                            <AlertCircle class="w-5 h-5 text-red-500 flex-shrink-0" />
                            <span class="text-red-700 dark:text-red-400 text-sm font-semibold">{form.error.name}</span>
                        </div>
                    {/if}

                    {#if form?.data}
                        <div class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
                            <Check class="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span class="text-green-700 dark:text-green-400 text-sm font-semibold">
                                workspace created successfully!
                            </span>
                        </div>
                    {/if}

                    <!-- Submit Button -->
                    <button 
                        type="submit" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-4 rounded-2xl transition-all shadow-lg shadow-blue-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] text-lg"
                    >
                        Create Organization
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
    }
    .animate-shake {
        animation: shake 0.4s ease-in-out;
    }
</style>
