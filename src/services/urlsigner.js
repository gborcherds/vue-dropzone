export default {
  getSignedURL(file, config) {
    let payload = {
      filePath: file.name,
      contentType: file.type
    }

    return new Promise((resolve, reject) => {
      var fd = new FormData();
      let request = new XMLHttpRequest(),
          signingURL = (typeof config.signingURL === "function") ?  config.signingURL(file) : config.signingURL;
      request.open("POST", signingURL);
      request.onload = function () {
        if (request.status == 200) {
          resolve(JSON.parse(request.response));
        } else {
          reject((request.statusText));
        }
      };
      request.onerror = function (err) {
        console.error("Network Error : Could not send request to AWS (Maybe CORS errors)");
        reject(err)
      };
      Object.entries(config.headers || {}).forEach(([name, value]) => {
        request.setRequestHeader(name, value);
      });
      payload = Object.assign(payload, config.params || {});
      Object.entries(payload).forEach(([name, value]) => {
        fd.append(name, value);
      });

      request.send(fd);
    });
  },
  sendFile(file, config, is_sending_s3) {
    var handler = (is_sending_s3) ? this.setResponseHandler : this.sendS3Handler;

    return this.getSignedURL(file, config)
      .then((response) => {return handler(response, file)})
      .catch((error) => { return error; });
  },
  setResponseHandler(response, file) {
    file.s3Signature = response.signature;
    file.s3Url = response.postEndpoint;
  },
  sendS3Handler(response, file) {
    let fd = new FormData(),
      signature = response.signature;

    Object.keys(signature).forEach(function (key) {
      fd.append(key, signature[key]);
    });
    fd.append('file', file);
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open('POST', response.postEndpoint);
      request.onload = function () {
        if (request.status == 201) {
          resolve({
            'success': true,
            'message': request.response
          })
        } else {
          reject({
            'success': false,
            'message': request.response
          })
        }
      };
      request.onerror = function (err) {
        reject({
          'success': false,
          'message': request.response
        })
      };
      request.send(fd);
    });
  }
}
