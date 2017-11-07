'use strict';

angular.module('TN_App.version', [
  'TN_App.version.interpolate-filter',
  'TN_App.version.version-directive'
])

.value('version', '0.1');
