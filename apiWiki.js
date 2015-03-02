import can from 'can';
import $ from 'jquery';
import stache from 'can/view/stache/';
import 'can/map/define/';
import apiWikiStache from 'apiWiki.stache!';
import 'route';

/*****************************************
 * FIRST ROUND PROTO
 * states:
 *  - view single api/sdki
 *  - edit/create new api/sdk
 *  - view all/filtered set of apis 
 *
 * model data:
 *  - name
 *  - url
 *  - example usage (markdown)
 *  - tags
 *
 * components/templates:
 *  - list of apis
 *  - single api
 *
 ******************************************/

can.Component.extend({
  tag: 'api-wiki',
  scope: {
    getSingleApi: function (api) {
      if (api && api.slug) {
        this.attr('currApi', api);
        can.route.attr({
          state: 'single',
          api: api.slug
        });
      }
    },
    define: {
      currApi: {
        value: {}
      },
      state: {
        get: function () {
          return can.route.attr('state');
        }
      }
    }
  },
  helpers: {
    isState: function (stateName, options) { 
      // get 'state' property's value & compare it to the string referenced by {{#isState}} in apiWikiStache
      // if a match is found, load the content inside the {{#isState}} conditional
      if (stateName === this.attr('state')) {
        return options.fn(options.scope, options.options); // more on this voodoo here: http://canjs.com/docs/can.mustache.helperOptions.html
      } else {
        return options.inverse(options.scope, options.options);
      }
    }
  }
});

var main = apiWikiStache({});

$('body').append(main);
