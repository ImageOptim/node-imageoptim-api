'use strict';

const denodeify = require('denodeify');
const fs = require('fs');
const writeFile = denodeify(fs.writeFile);
const request = require('superagent');

function ImageOptim() {
    if ('undefined' === typeof Promise) {
        throw Error("ES6 Promise support required.\nPlease use a modern version of nodejs or a polyfill");
    }
    this._baseURL = 'https://imageoptim.com/mozjpeg';
}

ImageOptim.prototype.compress = function(options) {
    return new ImageOptimOptionsBuilder(this._baseURL, options);
}

module.exports = ImageOptim;

function ImageOptimOptionsBuilder(baseURL, options) {
    this._baseURL = baseURL;
}

ImageOptimOptionsBuilder.prototype.file = function(path) {
    if ('string' !== typeof path) throw Error("Source path must be a string");
    this._srcFilePath = path;
    return this;
};

ImageOptimOptionsBuilder.prototype.save = function(path) {
    if ('string' !== typeof path) throw Error("Destination path must be a string");
    this._destFilePath = path;
    return this;
};

ImageOptimOptionsBuilder.prototype.then = function(resolve, reject) {
    return this.end().then(resolve, reject);
};

ImageOptimOptionsBuilder.prototype.end = function() {
    if (this._result) return this._result;

    const dest = this._destFilePath;
    const src = this._srcFilePath;

    if (!src) return Promise.reject(Error("Source file path not specified, please use .file()"));

    return Promise.resolve(request.post(this._baseURL)
            .field('quality', 'medium')
            .field('chroma_quality', 'auto')
            .attach('file', src))
            .then(function(res) {
                if (!dest) {
                    return res.body;
                }
                return writeFile(dest, res.body);
            });
};

