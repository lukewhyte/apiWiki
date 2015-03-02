import can from 'can';
import template from './api-list.stache!';
import API from 'models/api';

can.Component.extend({
  tag: 'api-list',
  template: template,
  scope: {
    API: API
  },
  events: {
    'inserted': function () {
      var scope = this.scope;
      API.findAll({}, function (apis) {
        scope.attr('apis', apis);
      });
    },
    '{scope.API} created': function (API, ev, newApi) {
      this.scope.attr('allApis').unshift(newApi);
    }
  }
});