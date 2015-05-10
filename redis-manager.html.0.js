

    Polymer({
      redis: null,
      activeUrl: "",
      connected: false,
      connecting: false,
      savedConnections: [],
      
      connectedChanged: function(oldVal, newVal) {
        if (newVal === true) {
          this.notify("connected to redis");
        } else {
          this.notify("disconnected from redis");
        }
      },
      connectingChanged: function(oldVal, newVal) {
        if (newVal === false && this.connected === false) {
          this.notify("connection failed");
        }
      },
      activeUrlChanged: function(oldUrl, newUrl) {
        if (this.redis) {
          this.redis.removeAllListeners();
          this.redis.disconnect();
          this.connected = false;
        }
        this.safeUrl = "";
        this.connecting = false;
        
        if (!newUrl) return;
        this.connecting = true;
        this.redis = new Redis(newUrl);
        var self = this;
        this.redis.on("end", function() {
          self.connected = false;
          self.connecting = false;
        });
        this.redis.on("ready", function() {
          self.connecting = false;
          self.connected = true;
        });
        this.safeUrl = newUrl.replace(/\/\/:.+@/, "//:***@");
      },
      
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
      notify: function(message) {
        this.$.notify.text = message;
        this.$.notify.show();
      },
      connect: function(opts) {
        var hostPort = (opts.host || "localhost") + ":" + (opts.port || 6379);
        var url;
        if (opts.password) {
          url = "redis://:" + opts.password + "@" + hostPort;
        } else {
          url = "redis://" + hostPort;
        }
        this.activeUrl = url;
      },
      connectFromForm: function(evt, opts, el) {
        this.connect(opts);
      },
      connectFromMenu: function(evt, something, el) {
        var self = this;
        var name = el.dataset.name;
        var key = "servers:" + name;
        chrome.storage.sync.get(key, function(vals){
          self.connect(vals[key]);
        });
      },
      
      ready: function() {
        this.refreshConnections();
        chrome.storage.onChanged.addListener(this.refreshConnections.bind(this));
      }
    });

