import can from 'can';
import 'can/map/define/';

var Api = can.Model.extend({
  findAll: 'GET /apis',
  findOne: function (slug) {
    return $.get('/apis/' + slug);
  },
  create:  'POST /apis',
  update:  'PUT /apis/{id}',
  destroy: 'DELETE /apis/{id}' 
}, {
  define: {
    slug: {
      type: 'string',
      set: function (newVal, setVal) {
        var slug = newVal.replace(/\s/g, '-').toLowerCase();
        setVal(slug);
      }
    }
  }
});

export default Api;