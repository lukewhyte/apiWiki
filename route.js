import can from 'can';

can.route(':state', {
  state: 'all'
});
can.route(':state/:api/');
can.route(':state/:api/:editing', {
  editing: 'false'
});

can.route.ready();