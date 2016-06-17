var servicesModule = angular.module('starter.services', []);

servicesModule.factory('storage', ['$log', function ($log) {

    return {
        LoadData: function(key) {
            $log.info('storage.LoadData for key: ' + key);
            var loadedData = window.localStorage[key];
            if (loadedData !== null) {
                try {
                    return angular.fromJson(loadedData)    
                } catch (error) {
                    return null;
                }
            }
            return null;
        },
        SaveData: function(key, data) {
            $log.info('storage.SaveData for key: ' + key + ' with data: ', data);
            var dataToBeSaved = (data !== null) ? angular.toJson(data) : null;
            window.localStorage[key] = dataToBeSaved;
        }
    };
}]);