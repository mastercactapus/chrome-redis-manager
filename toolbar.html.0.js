

Polymer({
  connect: function(evt, n, el) {
    console.log(arguments)
  },
  savedConnections: [],
  refreshConnections: function() {
    var self = this;
    chrome.storage.sync.get(null, function(vals){
      var ary = [];
      for (var key in vals) {
        if (key.startsWith("servers:")) {
          ary.push(vals[key]);
        }
      }
      self.savedConnections = ary;
    }); 
  },
  ready: function() {
    this.refreshConnections();
    chrome.storage.onChanged.addListener(this.refreshConnections.bind(this));
  }
});
