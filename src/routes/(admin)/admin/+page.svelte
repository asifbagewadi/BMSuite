<script>
    import { 
        Users, 
        Building2, 
        Contact, 
        UserCheck, 
        Target, 
        TrendingUp, 
        Calendar,
        FileText,
        AlertCircle
    } from '@lucide/svelte';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    const { metrics } = data;

    // Format numbers with commas
    const formatNumber = (/** @type {any} */ num) => {
        return new Intl.NumberFormat('en-US').format(num);
    };
</script>

<svelte:head>
    <title>Analytics - BMSuite</title>
</svelte:head>

<div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Overview of your CRM performance and key metrics</p>
    </div>

    <!-- Main Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Total Users -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">{formatNumber(metrics.totalUsers)}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-full">
                    <Users class="w-6 h-6 text-blue-600" />
                </div>
            </div>
            <div class="mt-4 text-sm text-gray-500">
                Active users in the system
            </div>
        </div>

        <!-- Total Organizations -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Organizations</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">{formatNumber(metrics.totalOrganizations)}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-full">
                    <Building2 class="w-6 h-6 text-purple-600" />
                </div>
            </div>
            <div class="mt-4 text-sm text-gray-500">
                Active organizations
            </div>
        </div>

        <!-- Total Accounts -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Accounts</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">{formatNumber(metrics.totalAccounts)}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-full">
                    <Contact class="w-6 h-6 text-green-600" />
                </div>
            </div>
            <div class="mt-4 text-sm text-green-600">
                +{formatNumber(metrics.newAccountsThisMonth)} this month
            </div>
        </div>
    </div>

    <!-- Secondary Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Total Contacts -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Contacts</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(metrics.totalContacts)}</p>
                </div>
                <div class="p-3 bg-indigo-100 rounded-full">
                    <UserCheck class="w-5 h-5 text-indigo-600" />
                </div>
            </div>
        </div>

        <!-- Total Leads -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Leads</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(metrics.totalLeads)}</p>
                </div>
                <div class="p-3 bg-pink-100 rounded-full">
                    <Target class="w-5 h-5 text-pink-600" />
                </div>
            </div>
            <div class="mt-2 text-sm text-gray-500">
                +{formatNumber(metrics.newLeadsThisMonth)} this month
            </div>
        </div>

        <!-- Opportunities -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Opportunities</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(metrics.totalOpportunities)}</p>
                </div>
                <div class="p-3 bg-orange-100 rounded-full">
                    <TrendingUp class="w-5 h-5 text-orange-600" />
                </div>
            </div>
            <div class="mt-2 text-sm text-gray-500">
                {formatNumber(metrics.openOpportunities)} active
            </div>
        </div>
    </div>

    <!-- Additional Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Tasks -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h3>
                <Calendar class="w-5 h-5 text-gray-400" />
            </div>
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Total Tasks</span>
                    <span class="font-medium">{formatNumber(metrics.totalTasks)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Completed This Month</span>
                    <span class="font-medium text-green-600">{formatNumber(metrics.tasksCompletedThisMonth)}</span>
                </div>
            </div>
        </div>

        <!-- Cases -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Support Cases</h3>
                <AlertCircle class="w-5 h-5 text-gray-400" />
            </div>
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Total Cases</span>
                    <span class="font-medium">{formatNumber(metrics.totalCases)}</span>
                </div>
            </div>
        </div>

        <!-- Activity This Month -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">This Month</h3>
                <FileText class="w-5 h-5 text-gray-400" />
            </div>
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">New Opportunities</span>
                    <span class="font-medium text-blue-600">{formatNumber(metrics.newOpportunitiesThisMonth)}</span>
                </div>
            </div>
        </div>
    </div>
</div>
