const transportLinks = new Vue({
  el: '#transport',
  delimiters: ['[[', ']]'],
  data: {
    connections: []
  },
  methods: {
    loadData: function () {
      const datetime = new Date()
      const year = datetime.getFullYear()
      const month = datetime.getMonth()
      const day = datetime.getDay()
      const time = datetime.getHours() + ':' + datetime.getMinutes()
      const date = year + '-' + month + '-' + day
      axios.get('http://transport.opendata.ch/v1/connections?from=europaplatz&to=bern&date'+date+'&time='+time)
        .then(response => {this.connections = response.data.connections})
        .catch(error => {this.connections = ["Test Error"]})
    },
    is_train: function (connection) {
      for (let i = 0; i < connection.sections.length; i++) {
        if (connection.sections[i].journey) {
          return connection.sections[i].journey.category === 'S';
        }
      }
    }
  },
  filters: {
    isoDate: function (value) {
      return value.slice(0, 1)
    },
    isoTime: function (value) {
      return value.slice(11, 16)
    },
    minutesFromNow: function (value) {
      const now = new Date()
      const remaining = (Date.parse(value) - now)
      return Math.ceil(remaining / 60000);
    },
    connectionType: function (value) {
      for (let i = 0; i < value.sections.length; i++) {
        if (value.sections[i].journey) {
          return value.sections[i].journey.category
        }
      }
    }
  },
  created() {
    this.loadData()

    setInterval(function () {
       this.loadData()
    }.bind(this), 30000)
  }
});

const clock = new Vue({
    el: '#clock',
    delimiters: ['[[', ']]'],
    data: {
        time: '',
        date: ''
    },
    methods: {
      updateTime: function () {
        var week = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        var cd = new Date()
        this.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2)
        this.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth()+1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()]
      }
    },
    created() {
      this.updateTime()

      setInterval(function () {
         this.updateTime()
      }.bind(this), 1000)
    }
});


// HELPER FUNCTIONS

/*
  Add zero padding to time values for the clock.
 */
function zeroPadding(num, digit) {
  var zero = '';
  for(var i = 0; i < digit; i++) {
    zero += '0';
  }
  return (zero + num).slice(-digit);
}