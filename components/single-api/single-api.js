import can from 'can';
import template from './single-api.stache!';
import API from 'models/api';

export var SingleAPIViewModel = can.Map.extend({
  createApi: function (vals) {
    var self = this;
    vals.slug = vals.name;
    new API(vals).save().then(function (api) {
      self.attr('isEditing', 'false');
    });
  },
  updateApi: function (vals) {
    var self = this;
    this.api.attr(vals).save().then(function () {
      self.attr('isEditing', 'false');
    });
  },
  API: API,
  define: {
    api: {
      set: function (newVal, setVal) {
        if (newVal && newVal instanceof API) {
          setVal(newVal);
        } else {
          var slug = can.route.attr('api');
          API.findOne(slug).then(function (api) {
            if (api[0]) {
              setVal(api[0]);
            }
          });
        }
      }
    },
    isEditing: {
      type: 'boolean',
      get: function () {
        return can.route.attr('editing');
      },
      set: function (newVal, setVal) {
        can.route.attr('editing', 'false');
        setVal(newVal);
      }
    },
    isInvalid: {
      value: new can.List([])
    }
  }
});

export default can.Component.extend({
  tag: 'single-api',
  template: template,
  scope: SingleAPIViewModel.extend({
    save: function (scope, el) {
      var vals = {},
        re = /[^\s]/,
        api = scope.attr('api');

      console.log(api instanceof API);

      el.parent().find('.apiProp').each(function (i, prop) {
        var $prop = $(prop),
          key = $prop.attr('id');
        vals[key] = $prop.val();
        if (!re.test(vals[key])) {
          this.isInvalid.push(id);
        }
      });

      if (this.isInvalid.attr('length') === 0) {
        if (api && api instanceof API) {
          this.updateApi(vals);
        } else {
          this.createApi(vals);
        }
      }
    }
  }),
  events: {
    'focus input': function () {
      if (this.isInvalid.attr('length') > 0) {
        this.isInvalid.attr('length', 0);
      }
    }
  },
  helpers: {
    ifEditing: function (options) {
      if (this.attr('isEditing')) {
        console.log(options);
        return options.fn(options.scope, options.options);
      } else {
        return options.inverse(options.scope, options.options);
      }
    },
    ifInvalid: function (str, options) {
      if (this.isInvalid.indexOf(str) !== -1) {
        return options.fn(options.scope, options.options);
      }
    }
  }
});