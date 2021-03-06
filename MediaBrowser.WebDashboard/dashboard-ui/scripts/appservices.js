define(["loading", "libraryMenu"], function(loading, libraryMenu) {
    "use strict";

    function reloadList(page) {
        loading.show();
        var promise1 = ApiClient.getAvailablePlugins({
                TargetSystems: "Server"
            }),
            promise2 = ApiClient.getInstalledPlugins();
        Promise.all([promise1, promise2]).then(function(responses) {
            renderInstalled(page, responses[0], responses[1]), renderCatalog(page, responses[0], responses[1])
        })
    }

    function getCategories() {
        var context = getParameterByName("context"),
            categories = [];
        return "sync" == context ? categories.push("Sync") : "livetv" == context ? categories.push("Live TV") : "notifications" == context && categories.push("Notifications"), categories
    }

    function renderInstalled(page, availablePlugins, installedPlugins) {
        requirejs(["scripts/pluginspage"], function() {
            var category = getCategories()[0];
            installedPlugins = installedPlugins.filter(function(i) {
                var catalogEntry = availablePlugins.filter(function(a) {
                    return (a.guid || "").toLowerCase() == (i.Id || "").toLowerCase()
                })[0];
                return !!catalogEntry && catalogEntry.category == category
            }), PluginsPage.renderPlugins(page, installedPlugins)
        })
    }

    function renderCatalog(page, availablePlugins, installedPlugins) {
        requirejs(["scripts/plugincatalogpage"], function() {
            var categories = getCategories();
            PluginCatalog.renderCatalog({
                catalogElement: page.querySelector(".catalog"),
                availablePlugins: availablePlugins,
                installedPlugins: installedPlugins,
                categories: categories,
                showCategory: !1,
                context: getParameterByName("context"),
                targetSystem: "Server"
            })
        })
    }

    function onPageShow() {
        var page = this,
            context = getParameterByName("context");
        "sync" == context ? (libraryMenu.setTitle(Globalize.translate("TitleSync")), page.querySelector(".headerHelpButton").setAttribute("href", "https://github.com/MediaBrowser/Wiki/wiki/Sync")) : "livetv" == context ? (libraryMenu.setTitle(Globalize.translate("TitleLiveTV")), page.querySelector(".headerHelpButton").setAttribute("href", "https://github.com/MediaBrowser/Wiki/wiki/Live%20TV")) : "notifications" == context && (libraryMenu.setTitle(Globalize.translate("TitleNotifications")), page.querySelector(".headerHelpButton").setAttribute("href", "https://github.com/MediaBrowser/Wiki/wiki/Notifications"))
    }
    pageIdOn("pagebeforeshow", "appServicesPage", onPageShow), pageIdOn("pageshow", "appServicesPage", onPageShow), pageIdOn("pageshow", "appServicesPage", function() {
        reloadList(this)
    })
});