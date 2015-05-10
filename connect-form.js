

    Polymer({
      name: "",
      password: "",
      redisHost: "",
      redisPort: "",
      rememberPassword: false,
      connect: function() {
        if (this.name !== "") {
          var key = "servers:" + this.name;
          var val = {
            host: this.redisHost,
            port: this.redisPort,
            name: this.name,
          };
          if (this.rememberPassword && this.password) {
            val.password = this.password;
          }
          
          var s = {};
          s[key] = val;
          chrome.storage.sync.set(s);
        }

        this.fire("connect", {host: this.redisHost, port: this.redisPort, password: this.password});
      }
    });

